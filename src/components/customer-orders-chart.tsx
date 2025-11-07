"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", newCustomers: 45, returningCustomers: 120 },
  { month: "Feb", newCustomers: 52, returningCustomers: 135 },
  { month: "Mar", newCustomers: 48, returningCustomers: 142 },
  { month: "Apr", newCustomers: 61, returningCustomers: 158 },
  { month: "May", newCustomers: 55, returningCustomers: 165 },
  { month: "Jun", newCustomers: 67, returningCustomers: 178 },
]

export function CustomerOrdersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Order Frequency</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e1e3ea" />
            <XAxis dataKey="month" stroke="#7e8299" />
            <YAxis stroke="#7e8299" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="newCustomers" stroke="#009ef7" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="returningCustomers" stroke="#50cd89" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
