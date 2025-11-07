import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, TrendingUp, Calendar } from "lucide-react"
import { ProductViewsChart } from "@/components/product-views-chart"
import { ProductViewsTable } from "@/components/product-views-table"

export default function ProductsViewedPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="pt-16">
          <div className="p-6">
            <PageHeader
              title="Products Viewed"
              breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reports" }, { label: "Products Viewed" }]}
              actions={
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last 30 Days
                </Button>
              }
            />

            <div className="mb-6 grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">45,231</p>
                      <p className="text-sm text-[#50cd89]">+12.5% from last month</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e1f0ff]">
                      <Eye className="h-6 w-6 text-[#009ef7]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Most Viewed</p>
                      <p className="text-2xl font-bold text-gray-900">Widget Pro</p>
                      <p className="text-sm text-gray-600">8,432 views</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8fff3]">
                      <TrendingUp className="h-6 w-6 text-[#50cd89]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Conversion</p>
                      <p className="text-2xl font-bold text-gray-900">3.2%</p>
                      <p className="text-sm text-[#50cd89]">+0.8% from last month</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff8dd]">
                      <TrendingUp className="h-6 w-6 text-[#ffc700]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ProductViewsChart />
              </div>
              <div>
                <ProductViewsTable />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
