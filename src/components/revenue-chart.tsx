"use client"

import { Card } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  { month: "Jan", revenue: 12500, expenses: 8200 },
  { month: "Feb", revenue: 15800, expenses: 9100 },
  { month: "Mar", revenue: 18200, expenses: 10500 },
  { month: "Apr", revenue: 16900, expenses: 9800 },
  { month: "May", revenue: 21400, expenses: 11200 },
  { month: "Jun", revenue: 24800, expenses: 12800 },
  { month: "Jul", revenue: 22100, expenses: 11900 },
  { month: "Aug", revenue: 26500, expenses: 13500 },
  { month: "Sep", revenue: 28900, expenses: 14200 },
  { month: "Oct", revenue: 31200, expenses: 15100 },
  { month: "Nov", revenue: 29800, expenses: 14800 },
  { month: "Dec", revenue: 34500, expenses: 16200 },
]

export function RevenueChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Revenue vs Expenses</h3>
        <p className="text-sm text-gray-500">Monthly comparison of revenue and expenses</p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#a1a5b7" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#a1a5b7"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e1e3ea",
              borderRadius: "8px",
            }}
            formatter={(value) => [`$${value}`, ""]}
          />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#009ef7" strokeWidth={2} name="Revenue" />
          <Line type="monotone" dataKey="expenses" stroke="#f1416c" strokeWidth={2} name="Expenses" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
