import { Sidebar } from "@/components/layouts/sidebar"
import { Header } from "@/components/layouts/header"
import { RevenueChart } from "@/components/revenue-chart"
import { CategoryChart } from "@/components/category-chart"
import { TopProducts } from "@/components/top-products"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="pt-16">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-sm text-gray-500">Track your business performance and insights</p>
              </div>
              <Button variant="outline" className="border-gray-300 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>

            {/* Key Metrics */}
            <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">$282,500</p>
                    <div className="mt-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-[#50cd89]" />
                      <span className="text-sm font-medium text-[#50cd89]">+12.5%</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#e8fff3] p-3">
                    <DollarSign className="h-6 w-6 text-[#50cd89]" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">42.3%</p>
                    <div className="mt-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-[#50cd89]" />
                      <span className="text-sm font-medium text-[#50cd89]">+3.2%</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#e1f0ff] p-3">
                    <TrendingUp className="h-6 w-6 text-[#009ef7]" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">$197.65</p>
                    <div className="mt-2 flex items-center gap-1">
                      <TrendingDown className="h-4 w-4 text-[#f1416c]" />
                      <span className="text-sm font-medium text-[#f1416c]">-2.1%</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#fff8dd] p-3">
                    <ShoppingBag className="h-6 w-6 text-[#ffc700]" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">3.24%</p>
                    <div className="mt-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-[#50cd89]" />
                      <span className="text-sm font-medium text-[#50cd89]">+0.8%</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#f8f5ff] p-3">
                    <TrendingUp className="h-6 w-6 text-[#7239ea]" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="mb-6 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>
              <div>
                <CategoryChart />
              </div>
            </div>

            {/* Top Products */}
            <TopProducts />
          </div>
        </main>
      </div>
    </div>
  )
}
