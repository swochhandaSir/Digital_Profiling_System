import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
const definitions = [
  { env: 'SEED_ADMIN_EMAIL', pass: 'SEED_ADMIN_PASSWORD', name: 'System Administrator', role: 'ADMIN' },
  { env: 'SEED_MAYOR_EMAIL', pass: 'SEED_MAYOR_PASSWORD', name: 'Mayor', role: 'MAYOR' },
  ...Array.from({ length: 12 }, (_, i) => ({ env: `SEED_WARD_${i + 1}_EMAIL`, pass: `SEED_WARD_${i + 1}_PASSWORD`, name: `Ward ${i + 1} Chairperson`, role: 'WARD_CHAIRPERSON', wardNumber: i + 1 }))
];
try {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  await mongoose.connect(process.env.MONGODB_URI, process.env.MONGODB_DATABASE ? { dbName: process.env.MONGODB_DATABASE } : {});
  for (const d of definitions) {
    if (!process.env[d.env] && !process.env[d.pass]) continue;
    if (!process.env[d.env] || !process.env[d.pass]) throw new Error(`Both ${d.env} and ${d.pass} are required`);
    const email = process.env[d.env].toLowerCase().trim();
    const passwordHash = await bcrypt.hash(process.env[d.pass], 12);
    await User.findOneAndUpdate({ email }, { $set: { name: d.name, email, passwordHash, role: d.role, wardNumber: d.wardNumber ?? null, active: true } }, { upsert: true, new: true, runValidators: true });
    console.log(`Seeded ${d.role}${d.wardNumber ? ` ward ${d.wardNumber}` : ''}: ${email}`);
  }
  console.log('Seeding completed');
} catch (error) { console.error('Seed failed:', error.message); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
