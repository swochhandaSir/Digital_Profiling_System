import mongoose from 'mongoose';
const householdSchema = new mongoose.Schema({
  householdCode: { type: String, required: true, trim: true }, wardNumber: { type: Number, required: true, min: 1, max: 12 },
  residentialArea: { type: String, required: true, trim: true }, familyMemberCount: { type: Number, required: true, min: 1 },
  headOfHousehold: { type: String, trim: true }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
householdSchema.index({ householdCode: 1, wardNumber: 1 }, { unique: true });
export default mongoose.model('Household', householdSchema);
