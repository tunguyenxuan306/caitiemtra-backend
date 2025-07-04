// pages/api/employees.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';
import { hash } from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET danh sách nhân viên
  if (req.method === 'GET') {
    const users = await prisma.user.findMany({
      where: { role: { not: 'admin' } },
      select: { id: true, username: true, role: true, createdAt: true },
    });
    return res.status(200).json(users);
  }

  // POST - tạo nhân viên
  if (req.method === 'POST') {
    const { username, password, role = 'staff' } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashed, role },
    });
    return res.status(201).json({ id: user.id, username: user.username, role: user.role });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
