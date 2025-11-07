import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "#ORD-2024-001",
    customer: "Sarah Johnson",
    product: "Premium Widget Set",
    amount: "$299.00",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "#ORD-2024-002",
    customer: "Michael Chen",
    product: "Starter Package",
    amount: "$149.00",
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "#ORD-2024-003",
    customer: "Emma Wilson",
    product: "Enterprise Bundle",
    amount: "$599.00",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "#ORD-2024-004",
    customer: "James Brown",
    product: "Basic Widget",
    amount: "$79.00",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "#ORD-2024-005",
    customer: "Lisa Anderson",
    product: "Pro Package",
    amount: "$399.00",
    status: "completed",
    date: "2024-01-13",
  },
]

const statusColors = {
  completed: "bg-[#e8fff3] text-[#50cd89]",
  processing: "bg-[#fff8dd] text-[#ffc700]",
  pending: "bg-[#f8f5ff] text-[#7239ea]",
}

export function RecentOrders() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
        <button className="text-sm font-medium text-[#009ef7] hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{order.id}</p>
                <Badge variant="secondary" className={statusColors[order.status as keyof typeof statusColors]}>
                  {order.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-gray-600">{order.customer}</p>
              <p className="text-sm text-gray-500">{order.product}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{order.amount}</p>
              <p className="text-sm text-gray-500">{order.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
