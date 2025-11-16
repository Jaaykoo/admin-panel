'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Defective', value: 45 },
  { name: 'Wrong Item', value: 28 },
  { name: 'Not as Described', value: 32 },
  { name: 'Changed Mind', value: 22 },
];

const COLORS = ['#f1416c', '#ffc700', '#009ef7', '#50cd89'];

export function ReturnsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Return Reasons</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                <span className="text-gray-600">{item.name}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
