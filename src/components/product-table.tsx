"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const products = [
  {
    id: 1,
    name: "Premium Widget Set",
    sku: "PWS-001",
    category: "Widgets",
    price: 299.0,
    stock: 45,
    status: "active",
    image: "/widget.jpg",
  },
  {
    id: 2,
    name: "Starter Package",
    sku: "SP-002",
    category: "Packages",
    price: 149.0,
    stock: 128,
    status: "active",
    image: "/wrapped-parcel.png",
  },
  {
    id: 3,
    name: "Enterprise Bundle",
    sku: "EB-003",
    category: "Bundles",
    price: 599.0,
    stock: 12,
    status: "active",
    image: "/tied-bundle.png",
  },
  {
    id: 4,
    name: "Basic Widget",
    sku: "BW-004",
    category: "Widgets",
    price: 79.0,
    stock: 0,
    status: "out_of_stock",
    image: "/basic-widget.jpg",
  },
  {
    id: 5,
    name: "Pro Package",
    sku: "PP-005",
    category: "Packages",
    price: 399.0,
    stock: 67,
    status: "active",
    image: "/pro-package.jpg",
  },
  {
    id: 6,
    name: "Deluxe Widget",
    sku: "DW-006",
    category: "Widgets",
    price: 199.0,
    stock: 8,
    status: "low_stock",
    image: "/deluxe-widget.jpg",
  },
]

const statusConfig = {
  active: { label: "Active", className: "bg-[#e8fff3] text-[#50cd89]" },
  out_of_stock: { label: "Out of Stock", className: "bg-[#fff5f8] text-[#f1416c]" },
  low_stock: { label: "Low Stock", className: "bg-[#fff8dd] text-[#ffc700]" },
}

export function ProductTable() {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts(products.map((p) => p.id))
                    } else {
                      setSelectedProducts([])
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts([...selectedProducts, product.id])
                      } else {
                        setSelectedProducts(selectedProducts.filter((id) => id !== product.id))
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                <td className="px-6 py-4">
                  <Badge
                    variant="secondary"
                    className={statusConfig[product.status as keyof typeof statusConfig].className}
                  >
                    {statusConfig[product.status as keyof typeof statusConfig].label}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[#f1416c]">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
