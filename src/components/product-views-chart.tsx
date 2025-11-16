'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Mon', views: 4000, conversions: 240 },
  { name: 'Tue', views: 3000, conversions: 139 },
  { name: 'Wed', views: 2000, conversions: 980 },
  { name: 'Thu', views: 2780, conversions: 390 },
  { name: 'Fri', views: 1890, conversions: 480 },
  { name: 'Sat', views: 2390, conversions: 380 },
  { name: 'Sun', views: 3490, conversions: 430 },
];

export function ProductViewsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Views Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e1e3ea" />
            <XAxis dataKey="name" stroke="#7e8299" />
            <YAxis stroke="#7e8299" />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#009ef7" radius={[8, 8, 0, 0]} />
            <Bar dataKey="conversions" fill="#50cd89" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
