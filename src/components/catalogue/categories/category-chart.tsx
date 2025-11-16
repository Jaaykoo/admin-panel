'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';

const data = [
  { name: 'Widgets', value: 45, color: '#009ef7' },
  { name: 'Packages', value: 30, color: '#50cd89' },
  { name: 'Bundles', value: 15, color: '#ffc700' },
  { name: 'Services', value: 10, color: '#7239ea' },
];

export function CategoryChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Sales by Category</h3>
        <p className="text-sm text-gray-500">Product category distribution</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={value => [`${value}%`, 'Share']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
