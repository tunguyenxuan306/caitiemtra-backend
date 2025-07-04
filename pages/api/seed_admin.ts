// pages/api/seed-admin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const existing = await prisma.user.findUnique({ where: { username: 'admin' } });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const hashed = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashed,
        role: 'admin',
      },
    });

    res.status(201).json({ message: '✅ Admin created and seed file will self-delete', admin });

    // XÓA FILE SAU KHI CHẠY
    const filePath = path.join(process.cwd(), 'pages', 'api', 'seed-admin.ts');
    fs.unlink(filePath, (err) => {
      if (err) console.error('⚠️ Không thể xoá file seed-admin.ts:', err);
      else console.log('🧹 seed-admin.ts đã được xoá sau khi chạy');
    });

  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: '❌ Failed to create admin' });
  }
}
