import { Sidebar } from "@/components/layouts/sidebar"
import { Header } from "@/components/layouts/header"
import { ProductTable } from "@/components/product-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Filter, Download } from "lucide-react"

export default function ProductsPage() {
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
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-sm text-gray-500">Manage your product catalog and inventory</p>
              </div>
              <Button className="bg-[#009ef7] hover:bg-[#0077b6]">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex-1">
                <Input type="search" placeholder="Search products..." className="max-w-md border-gray-300" />
              </div>
              <Button variant="outline" className="border-gray-300 bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="border-gray-300 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Product Table */}
            <ProductTable />
          </div>
        </main>
      </div>
    </div>
  )
}
