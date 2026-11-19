import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['ADMIN', 'MAYOR', 'WARD_CHAIRPERSON'], required: true },
  wardNumber: { type: Number, min: 1, max: 12, default: null },
  active: { type: Boolean, default: true }
}, { timestamps: true });
userSchema.index({ role: 1, wardNumber: 1 });
export default mongoose.model('User', userSchema);
