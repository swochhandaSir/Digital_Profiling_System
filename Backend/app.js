import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import api from './routes/api.js';
import { errorHandler, notFound } from './middleware/errors.js';
const app = express();
app.disable('x-powered-by'); app.set('trust proxy', 1); app.use(helmet());
const configuredOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const isDevelopmentOrigin = (origin) => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    const isLocalHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const isPrivateIpv4 = /^(10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})$/.test(url.hostname);
    return url.protocol === 'http:' && url.port === '5173' && (isLocalHost || isPrivateIpv4);
  } catch {
    return false;
  }
};
app.use(cors({
  origin(origin, callback) {
    if (!origin || configuredOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && isDevelopmentOrigin(origin))) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' })); app.use(cookieParser()); app.use(morgan('combined', { skip: (req) => req.url.includes('/auth') }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' })); app.use('/api', api); app.use(notFound); app.use(errorHandler);
export default app;
