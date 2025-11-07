"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
  {
    name: "Catalogue",
    icon: Package,
    children: [
      { name: "Produits", href: "/catalog/products" },
      { name: "Catégories", href: "/catalog/categories" },
    ],
  },
  {
    name: "Ventes",
    icon: ShoppingCart,
    children: [{ name: "Commandes", href: "/sales/orders" }],
  },
  { name: "Clients", href: "/customers", icon: Users },
  { name: "Devis", href: "/devis", icon: FileText },
  {
    name: "Rapports",
    icon: BarChart3,
    children: [
      { name: "Produits consultés", href: "/reports/products-viewed" },
      { name: "Ventes", href: "/reports/sales" },
      { name: "Retours", href: "/reports/returns" },
      { name: "Commandes clients", href: "/reports/customer-orders" },
      { name: "Expédition", href: "/reports/shipping" },
    ],
  },
  {
    name: "Gestion des utilisateurs",
    icon: Users,
    children: [{ name: "Liste des utilisateurs", href: "/users" }],
  },
  { name: "Paramètres", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Catalogue", "Ventes", "Rapports"])

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-300 bg-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-300 px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#009ef7]">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Metronic</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            if ("children" in item) {
              const isExpanded = expandedMenus.includes(item.name)
              const hasActiveChild = item.children?.some((child) => pathname === child.href)

              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      hasActiveChild ? "text-[#009ef7]" : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1 text-left">{item.name}</span>
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children?.map((child) => {
                        const isActive = pathname === child.href
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm transition-colors",
                              isActive ? "bg-[#e1f0ff] font-medium text-[#009ef7]" : "text-gray-600 hover:bg-gray-100",
                            )}
                          >
                            {child.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-[#e1f0ff] text-[#009ef7]" : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-300 p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#009ef7] text-white">
              <span className="text-sm font-medium">JD</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    </aside>
  )
}
