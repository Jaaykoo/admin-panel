import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CustomerTable } from "@/components/customer-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Filter, Download } from "lucide-react"

export default function CustomersPage() {
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
                <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                <p className="text-sm text-gray-500">Gérez vos relations clients et vos données</p>
              </div>
              <Button className="bg-[#009ef7] hover:bg-[#0077b6]">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un client
              </Button>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex-1">
                <Input type="search" placeholder="Rechercher des clients..." className="max-w-md border-gray-300" />
              </div>
              <Button variant="outline" className="border-gray-300 bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
              <Button variant="outline" className="border-gray-300 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>

            {/* Customer Table */}
            <CustomerTable />
          </div>
        </main>
      </div>
    </div>
  )
}
