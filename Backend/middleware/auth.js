import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function authenticate(req, res, next) {
  try {
    const token = req.cookies.accessToken || req.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.sub).select('name email role wardNumber active');
    if (!user?.active) return res.status(401).json({ message: 'Authentication required' });
    req.user = user; next();
  } catch { res.status(401).json({ message: 'Authentication required' }); }
}
export const allowRoles = (...roles) => (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ message: 'Access denied' });
