import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' };
export async function login(req, res) {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+passwordHash');
  if (!user?.active || !await bcrypt.compare(String(password), user.passwordHash)) return res.status(401).json({ message: 'Invalid email or password' });
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) throw new Error('JWT secrets are required');
  const claims = { sub: user.id, role: user.role, wardNumber: user.wardNumber };
  res.cookie('accessToken', jwt.sign(claims, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' }), { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', jwt.sign(claims, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }), { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, wardNumber: user.wardNumber } });
}
export async function refresh(req, res) {
  try {
    const payload = jwt.verify(req.cookies.refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub).select('name email role wardNumber active');
    if (!user?.active) throw new Error();
    res.cookie('accessToken', jwt.sign({ sub: user.id, role: user.role, wardNumber: user.wardNumber }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' }), { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.json({ user });
  } catch { res.clearCookie('accessToken', cookieOptions); res.clearCookie('refreshToken', cookieOptions); res.status(401).json({ message: 'Please sign in again' }); }
}
export function logout(req, res) { res.clearCookie('accessToken', cookieOptions); res.clearCookie('refreshToken', cookieOptions); res.status(204).end(); }
export function me(req, res) { res.json({ user: req.user }); }
