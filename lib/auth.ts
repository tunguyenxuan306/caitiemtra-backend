import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET = process.env.JWT_SECRET || 'your-dev-secret';

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
