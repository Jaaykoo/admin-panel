import { Sidebar } from "@/components/layouts/sidebar"
import { Header } from "@/components/layouts/header"
import { InvoiceTable } from "@/components/invoice-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Filter, Download } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function InvoicesPage() {
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
                <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                <p className="text-sm text-gray-500">Create and manage customer invoices</p>
              </div>
              <Button className="bg-[#009ef7] hover:bg-[#0077b6]">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <Card className="p-4">
                <p className="text-sm text-gray-600">Total Invoiced</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">$45,231</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Paid</p>
                <p className="mt-1 text-2xl font-bold text-[#50cd89]">$38,450</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="mt-1 text-2xl font-bold text-[#ffc700]">$4,892</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="mt-1 text-2xl font-bold text-[#f1416c]">$1,889</p>
              </Card>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex-1">
                <Input type="search" placeholder="Search invoices..." className="max-w-md border-gray-300" />
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

            {/* Invoice Table */}
            <InvoiceTable />
          </div>
        </main>
      </div>
    </div>
  )
}
