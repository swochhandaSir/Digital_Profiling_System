import mongoose from 'mongoose';
const citizenSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 150 }, phoneNumber: { type: String, trim: true, maxlength: 30 },
  wardNumber: { type: Number, required: true, min: 1, max: 12, index: true }, household: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', index: true },
  residentialArea: { type: String, trim: true, maxlength: 120 }, familyMemberNames: [{ type: String, trim: true, maxlength: 150 }],
  economicCategory: { type: String, enum: ['SAMPANNA', 'MADHYAM', 'BIPANNA'], required: true },
  categorySource: { type: String, enum: ['SELF_REPORTED', 'PROVISIONAL_ASSESSMENT'], default: 'SELF_REPORTED' }, categoryAssessedAt: Date, assessmentNotes: { type: String, maxlength: 1000 },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED', 'NEEDS_CORRECTION'], default: 'PENDING', index: true },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, verifiedAt: Date, verificationNotes: String, rejectionReason: String, correctionMessage: String
}, { timestamps: true });
citizenSchema.index({ wardNumber: 1, phoneNumber: 1 }, { unique: true, sparse: true });
citizenSchema.index({ wardNumber: 1, fullName: 1 });
export default mongoose.model('Citizen', citizenSchema);
