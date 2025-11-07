import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const returns = [
  {
    id: "RET-1234",
    product: "Widget Pro",
    customer: "John Doe",
    date: "2024-01-15",
    reason: "Defective",
    status: "Processing",
  },
  {
    id: "RET-1235",
    product: "Basic Widget",
    customer: "Jane Smith",
    date: "2024-01-14",
    reason: "Wrong Item",
    status: "Approved",
  },
  {
    id: "RET-1236",
    product: "Deluxe Package",
    customer: "Bob Johnson",
    date: "2024-01-14",
    reason: "Not as Described",
    status: "Completed",
  },
  {
    id: "RET-1237",
    product: "Starter Kit",
    customer: "Alice Brown",
    date: "2024-01-13",
    reason: "Changed Mind",
    status: "Processing",
  },
  {
    id: "RET-1238",
    product: "Premium Bundle",
    customer: "Charlie Wilson",
    date: "2024-01-13",
    reason: "Defective",
    status: "Approved",
  },
]

export function ReturnsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Returns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Return ID
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Product</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Customer
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Reason</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {returns.map((ret) => (
                <tr key={ret.id} className="hover:bg-gray-50">
                  <td className="py-4 text-sm font-medium text-gray-900">{ret.id}</td>
                  <td className="py-4 text-sm text-gray-900">{ret.product}</td>
                  <td className="py-4 text-sm text-gray-600">{ret.customer}</td>
                  <td className="py-4 text-sm text-gray-600">{ret.reason}</td>
                  <td className="py-4">
                    <Badge
                      variant="secondary"
                      className={
                        ret.status === "Completed"
                          ? "bg-[#e8fff3] text-[#50cd89]"
                          : ret.status === "Processing"
                            ? "bg-[#fff8dd] text-[#ffc700]"
                            : "bg-[#e1f0ff] text-[#009ef7]"
                      }
                    >
                      {ret.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
