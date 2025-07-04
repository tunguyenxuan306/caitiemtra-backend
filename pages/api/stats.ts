// pages/api/stats.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({ _sum: { total: true } });

  const bestSelling = await prisma.orderItem.groupBy({
    by: ['menuItemId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 1,
  });

  const bestMenu = bestSelling[0]
    ? await prisma.menuItem.findUnique({ where: { id: bestSelling[0].menuItemId } })
    : null;

  res.status(200).json({
    totalOrders,
    revenue: totalRevenue._sum.total || 0,
    bestSeller: bestMenu?.name || null,
  });
}
