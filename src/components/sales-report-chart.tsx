'use client';

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { month: 'Jan', sales: 45000, orders: 320 },
  { month: 'Feb', sales: 52000, orders: 380 },
  { month: 'Mar', sales: 48000, orders: 350 },
  { month: 'Apr', sales: 61000, orders: 420 },
  { month: 'May', sales: 55000, orders: 390 },
  { month: 'Jun', sales: 67000, orders: 450 },
];

export function SalesReportChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#009ef7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#009ef7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e1e3ea" />
            <XAxis dataKey="month" stroke="#7e8299" />
            <YAxis stroke="#7e8299" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="sales" stroke="#009ef7" fillOpacity={1} fill="url(#colorSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
