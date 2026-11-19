import { z } from 'zod';
import Citizen from '../models/Citizen.js';
import Household from '../models/Household.js';
import AuditLog from '../models/AuditLog.js';

const citizenInput = z.object({ fullName: z.string().trim().min(2).max(150), phoneNumber: z.string().trim().max(30).optional().or(z.literal('')), householdCode: z.string().trim().max(50).optional().or(z.literal('')), residentialArea: z.string().trim().max(120).optional().or(z.literal('')), familyMemberCount: z.preprocess((value) => value === '' || value == null ? undefined : value, z.coerce.number().int().min(1).max(50).optional()), familyMemberNames: z.preprocess((value) => (Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[\n,]+/) : []).map(name => typeof name === 'string' ? name.trim() : name).filter(Boolean), z.array(z.string().min(1).max(150)).max(50)), headOfHousehold: z.string().trim().max(150).optional(), economicCategory: z.enum(['SAMPANNA', 'MADHYAM', 'BIPANNA']), categorySource: z.enum(['SELF_REPORTED', 'PROVISIONAL_ASSESSMENT']).default('SELF_REPORTED'), assessmentNotes: z.string().max(1000).optional() });
function scopeFor(user) { return user.role === 'WARD_CHAIRPERSON' ? { wardNumber: user.wardNumber } : {}; }
export async function listCitizens(req, res) {
  const filter = { ...scopeFor(req.user) };
  if (req.user.role !== 'WARD_CHAIRPERSON' && req.query.ward) filter.wardNumber = Number(req.query.ward);
  if (req.query.status) filter.verificationStatus = req.query.status;
  if (req.query.category) filter.economicCategory = req.query.category;
  if (req.query.q) filter.fullName = { $regex: String(req.query.q).slice(0, 80), $options: 'i' };
  const page = Math.max(1, Number(req.query.page) || 1), limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
  const [items, total] = await Promise.all([Citizen.find(filter).populate('household', 'householdCode familyMemberCount').populate('submittedBy', 'name role').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Citizen.countDocuments(filter)]);
  res.json({ items, total, page, limit });
}
export async function getCitizen(req, res) {
  const citizen = await Citizen.findOne({ _id: req.params.id, ...scopeFor(req.user) }).populate('household').populate('submittedBy', 'name role');
  if (!citizen) return res.status(404).json({ message: 'Citizen record not found' });
  res.json({ citizen });
}
export async function createCitizen(req, res) {
  const parsed = citizenInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Please check the submitted information', issues: parsed.error.issues.map(({ path, message }) => ({ field: path.join('.'), message })) });
  const d = parsed.data, wardNumber = req.user.role === 'WARD_CHAIRPERSON' ? req.user.wardNumber : Number(req.body.wardNumber);
  if (!Number.isInteger(wardNumber) || wardNumber < 1 || wardNumber > 12) return res.status(400).json({ message: 'A valid ward number is required' });
  let household;
  if (d.householdCode) {
    household = await Household.findOne({ householdCode: d.householdCode, wardNumber });
    if (household && (household.residentialArea !== d.residentialArea || household.familyMemberCount !== d.familyMemberCount)) return res.status(409).json({ message: 'Household details differ from the existing record; contact an administrator' });
    if (!household) household = await Household.create({ householdCode: d.householdCode, wardNumber, residentialArea: d.residentialArea, familyMemberCount: d.familyMemberCount, headOfHousehold: d.headOfHousehold, createdBy: req.user.id });
  }
  const citizen = await Citizen.create({ fullName: d.fullName, phoneNumber: d.phoneNumber || undefined, wardNumber, household: household?.id, residentialArea: d.residentialArea, familyMemberNames: d.familyMemberNames, economicCategory: d.economicCategory, categorySource: d.categorySource, categoryAssessedAt: d.categorySource === 'PROVISIONAL_ASSESSMENT' ? new Date() : undefined, assessmentNotes: d.assessmentNotes, submittedBy: req.user.id, verificationStatus: 'PENDING' });
  await AuditLog.create({ actor: req.user.id, action: 'CITIZEN_CREATED', entityType: 'Citizen', entityId: citizen.id, ipAddress: req.ip });
  res.status(201).json({ citizen });
}
export async function updateCitizen(req, res) {
  const citizen = await Citizen.findOne({ _id: req.params.id, ...scopeFor(req.user) });
  if (!citizen) return res.status(404).json({ message: 'Citizen record not found' });
  if (citizen.submittedBy.toString() !== req.user.id || !['PENDING', 'NEEDS_CORRECTION'].includes(citizen.verificationStatus)) return res.status(403).json({ message: 'This record cannot be edited by your account' });
  const parsed = citizenInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Please check the submitted information' });
  const d = parsed.data;
  let household;
  if (d.householdCode) {
    household = await Household.findOne({ householdCode: d.householdCode, wardNumber: citizen.wardNumber });
    if (!household) household = await Household.create({ householdCode: d.householdCode, wardNumber: citizen.wardNumber, residentialArea: d.residentialArea, familyMemberCount: d.familyMemberCount, headOfHousehold: d.headOfHousehold, createdBy: req.user.id });
  }
  Object.assign(citizen, { fullName: d.fullName, phoneNumber: d.phoneNumber || undefined, household: household?.id, residentialArea: d.residentialArea, familyMemberNames: d.familyMemberNames, economicCategory: d.economicCategory, categorySource: d.categorySource, assessmentNotes: d.assessmentNotes, verificationStatus: 'PENDING', correctionMessage: undefined, rejectionReason: undefined });
  await citizen.save();
  await AuditLog.create({ actor: req.user.id, action: 'CITIZEN_RESUBMITTED', entityType: 'Citizen', entityId: citizen.id, ipAddress: req.ip });
  res.json({ citizen });
}
export async function verifyCitizen(req, res) {
  const schema = z.discriminatedUnion('decision', [z.object({ decision: z.literal('VERIFIED'), notes: z.string().max(2000).optional() }), z.object({ decision: z.literal('REJECTED'), reason: z.string().trim().min(1).max(2000) }), z.object({ decision: z.literal('NEEDS_CORRECTION'), message: z.string().trim().min(1).max(2000) })]);
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'A valid decision and required notes are needed' });
  const citizen = await Citizen.findById(req.params.id);
  if (!citizen) return res.status(404).json({ message: 'Citizen record not found' });
  if (citizen.verificationStatus === 'VERIFIED') return res.status(409).json({ message: 'Verified records cannot be changed' });
  const d = parsed.data;
  citizen.verificationStatus = d.decision; citizen.verifiedBy = req.user.id; citizen.verifiedAt = new Date();
  citizen.verificationNotes = d.notes; citizen.rejectionReason = d.reason; citizen.correctionMessage = d.message;
  await citizen.save();
  await AuditLog.create({ actor: req.user.id, action: `CITIZEN_${d.decision}`, entityType: 'Citizen', entityId: citizen.id, details: { note: d.notes ?? d.reason ?? d.message }, ipAddress: req.ip });
  res.json({ citizen });
}

export async function deleteCitizen(req, res) {
  const citizen = await Citizen.findById(req.params.id);
  if (!citizen) return res.status(404).json({ message: 'Citizen record not found' });

  await AuditLog.create({
    actor: req.user.id,
    action: 'CITIZEN_DELETED',
    entityType: 'Citizen',
    entityId: citizen.id,
    details: { fullName: citizen.fullName, wardNumber: citizen.wardNumber, verificationStatus: citizen.verificationStatus },
    ipAddress: req.ip
  });
  await citizen.deleteOne();
  res.json({ message: 'Citizen record deleted' });
}
