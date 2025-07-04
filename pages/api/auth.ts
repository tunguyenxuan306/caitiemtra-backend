// pages/api/auth.ts
import { compare } from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing credentials' });

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isValid = await compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

  // Không dùng JWT nếu bạn không muốn, trả về basic thông tin:
  res.status(200).json({ id: user.id, username: user.username, role: user.role });
}
