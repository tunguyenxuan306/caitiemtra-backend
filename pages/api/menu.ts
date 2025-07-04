// pages/api/menu.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const items = await prisma.menuItem.findMany();
    return res.status(200).json(items);
  }

  if (req.method === 'POST') {
    const { name, price } = req.body;
    const newItem = await prisma.menuItem.create({ data: { name, price } });
    return res.status(201).json(newItem);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    await prisma.menuItem.delete({ where: { id } });
    return res.status(204).end();
  }

  res.status(405).json({ message: 'Method not allowed' });
}
