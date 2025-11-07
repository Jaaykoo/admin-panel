"use client"

import { Card } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { month: "Jan", sales: 12500 },
  { month: "Feb", sales: 15800 },
  { month: "Mar", sales: 18200 },
  { month: "Apr", sales: 16900 },
  { month: "May", sales: 21400 },
  { month: "Jun", sales: 24800 },
  { month: "Jul", sales: 22100 },
  { month: "Aug", sales: 26500 },
  { month: "Sep", sales: 28900 },
  { month: "Oct", sales: 31200 },
  { month: "Nov", sales: 29800 },
  { month: "Dec", sales: 34500 },
]

export function SalesChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Sales Overview</h3>
        <p className="text-sm text-gray-500">Monthly sales performance</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
            formatter={(value) => [`$${value}`, "Sales"]}
          />
          <Bar dataKey="sales" fill="#009ef7" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
