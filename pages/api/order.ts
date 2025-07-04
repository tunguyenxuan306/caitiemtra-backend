// pages/api/orders.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(orders);
  }

  if (req.method === 'POST') {
    const { userId, items } = req.body; // items = [{menuItemId, quantity}]
    if (!userId || !items?.length) return res.status(400).json({ message: 'Missing data' });

    const total = await items.reduce(async (sumPromise: any, item: any) => {
      const sum = await sumPromise;
      const menu = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      return sum + (menu?.price || 0) * item.quantity;
    }, Promise.resolve(0));

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        orderItems: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        },
      },
    });

    return res.status(201).json(order);
  }

  res.status(405).json({ message: 'Method not allowed' });
}
