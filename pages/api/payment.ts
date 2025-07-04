// pages/api/payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: 'success', message: 'Thanh toán thành công (giả lập)' });
}
