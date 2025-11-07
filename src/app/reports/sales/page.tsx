import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, ShoppingCart, TrendingUp, Calendar } from "lucide-react"
import { SalesReportChart } from "@/components/sales-report-chart"
import { SalesReportTable } from "@/components/sales-report-table"

export default function SalesReportPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="pt-16">
          <div className="p-6">
            <PageHeader
              title="Sales Report"
              breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reports" }, { label: "Sales" }]}
              actions={
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Last 30 Days
                  </Button>
                  <Button className="bg-[#009ef7] hover:bg-[#0077b6]">Export Report</Button>
                </div>
              }
            />

            <div className="mb-6 grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Sales</p>
                      <p className="text-2xl font-bold text-gray-900">$124,563</p>
                      <p className="text-sm text-[#50cd89]">+18.2% from last month</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8fff3]">
                      <DollarSign className="h-6 w-6 text-[#50cd89]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">1,429</p>
                      <p className="text-sm text-[#50cd89]">+8.2% from last month</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e1f0ff]">
                      <ShoppingCart className="h-6 w-6 text-[#009ef7]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                      <p className="text-2xl font-bold text-gray-900">$87.15</p>
                      <p className="text-sm text-[#50cd89]">+5.4% from last month</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff8dd]">
                      <TrendingUp className="h-6 w-6 text-[#ffc700]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <SalesReportChart />
            </div>

            <SalesReportTable />
          </div>
        </main>
      </div>
    </div>
  )
}
