import Citizen from '../models/Citizen.js';
import AuditLog from '../models/AuditLog.js';
export async function dashboard(req, res) {
  const wardScope = req.user.role === 'WARD_CHAIRPERSON' ? { wardNumber: req.user.wardNumber } : {};
  const [citizenTotal, statuses, categories, wards] = await Promise.all([
    Citizen.countDocuments(wardScope),
    Citizen.aggregate([{ $match: wardScope }, { $group: { _id: '$verificationStatus', count: { $sum: 1 } } }]),
    Citizen.aggregate([{ $match: wardScope }, { $group: { _id: '$economicCategory', count: { $sum: 1 } } }]),
    req.user.role === 'WARD_CHAIRPERSON' ? [] : Citizen.aggregate([{ $group: { _id: '$wardNumber', citizens: { $sum: 1 }, verified: { $sum: { $cond: [{ $eq: ['$verificationStatus', 'VERIFIED'] }, 1, 0] } }, pending: { $sum: { $cond: [{ $eq: ['$verificationStatus', 'PENDING'] }, 1, 0] } } } }, { $project: { wardNumber: '$_id', citizens: 1, verified: 1, pending: 1 } }, { $sort: { wardNumber: 1 } }])
  ]);
  const count = (list, key) => list.find(x => x._id === key)?.count ?? 0;
  res.json({ totals: { citizens: citizenTotal, verified: count(statuses, 'VERIFIED'), pending: count(statuses, 'PENDING'), rejected: count(statuses, 'REJECTED'), needsCorrection: count(statuses, 'NEEDS_CORRECTION') }, categories: { SAMPANNA: count(categories, 'SAMPANNA'), MADHYAM: count(categories, 'MADHYAM'), BIPANNA: count(categories, 'BIPANNA') }, wards });
}
export async function auditLogs(req, res) {
  const filter = {};
  if (req.query.entityId) filter.entityId = req.query.entityId;
  const items = await AuditLog.find(filter).populate('actor', 'name role').sort({ createdAt: -1 }).limit(200);
  res.json({ items });
}
