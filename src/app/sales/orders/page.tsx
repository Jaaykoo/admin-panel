import { Sidebar } from "@/components/layouts/sidebar"
import { Header } from "@/components/layouts/header"
import { PageHeader } from "@/components/page-header"
import { OrderTable } from "@/components/order-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="pt-16">
          <div className="p-6">
            <PageHeader
              title="Commandes"
              breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Ventes" }, { label: "Commandes" }]}
              actions={
                <Link href="/sales/orders/add">
                  <Button className="bg-[#009ef7] hover:bg-[#0077b6]">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une commande
                  </Button>
                </Link>
              }
            />
            <OrderTable />
          </div>
        </main>
      </div>
    </div>
  )
}
