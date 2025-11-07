import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, CheckCircle, XCircle, Calendar } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="pt-16">
          <div className="p-6">
            <PageHeader
              title="Shipping Report"
              breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reports" }, { label: "Shipping" }]}
              actions={
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last 30 Days
                </Button>
              }
            />

            <div className="mb-6 grid gap-6 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Delivered</p>
                      <p className="text-2xl font-bold text-gray-900">1,234</p>
                      <p className="text-sm text-[#50cd89]">86.4% success rate</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8fff3]">
                      <CheckCircle className="h-6 w-6 text-[#50cd89]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">In Transit</p>
                      <p className="text-2xl font-bold text-gray-900">156</p>
                      <p className="text-sm text-gray-600">Currently shipping</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e1f0ff]">
                      <Truck className="h-6 w-6 text-[#009ef7]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">89</p>
                      <p className="text-sm text-gray-600">Awaiting pickup</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff8dd]">
                      <Package className="h-6 w-6 text-[#ffc700]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Failed</p>
                      <p className="text-2xl font-bold text-gray-900">23</p>
                      <p className="text-sm text-[#f1416c]">1.6% failure rate</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff5f8]">
                      <XCircle className="h-6 w-6 text-[#f1416c]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Order
                        </th>
                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Customer
                        </th>
                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Courier
                        </th>
                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Method
                        </th>
                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Tracking
                        </th>
                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        {
                          order: "#ORD-1234",
                          customer: "John Doe",
                          courier: "FedEx",
                          method: "Express",
                          tracking: "FX123456789",
                          status: "Delivered",
                        },
                        {
                          order: "#ORD-1235",
                          customer: "Jane Smith",
                          courier: "UPS",
                          method: "Standard",
                          tracking: "UP987654321",
                          status: "In Transit",
                        },
                        {
                          order: "#ORD-1236",
                          customer: "Bob Johnson",
                          courier: "DHL",
                          method: "Express",
                          tracking: "DH456789123",
                          status: "In Transit",
                        },
                        {
                          order: "#ORD-1237",
                          customer: "Alice Brown",
                          courier: "USPS",
                          method: "Standard",
                          tracking: "US789123456",
                          status: "Pending",
                        },
                        {
                          order: "#ORD-1238",
                          customer: "Charlie Wilson",
                          courier: "FedEx",
                          method: "Express",
                          tracking: "FX321654987",
                          status: "Delivered",
                        },
                      ].map((shipment, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-4 text-sm font-medium text-gray-900">{shipment.order}</td>
                          <td className="py-4 text-sm text-gray-900">{shipment.customer}</td>
                          <td className="py-4 text-sm text-gray-600">{shipment.courier}</td>
                          <td className="py-4 text-sm text-gray-600">{shipment.method}</td>
                          <td className="py-4 text-sm font-mono text-gray-600">{shipment.tracking}</td>
                          <td className="py-4">
                            <Badge
                              variant="secondary"
                              className={
                                shipment.status === "Delivered"
                                  ? "bg-[#e8fff3] text-[#50cd89]"
                                  : shipment.status === "In Transit"
                                    ? "bg-[#e1f0ff] text-[#009ef7]"
                                    : "bg-[#fff8dd] text-[#ffc700]"
                              }
                            >
                              {shipment.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
