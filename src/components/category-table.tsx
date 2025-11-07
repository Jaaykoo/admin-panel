"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

const categories = [
  { id: 1, name: "Electronics", products: 245, status: "Active", description: "Electronic devices and accessories" },
  { id: 2, name: "Clothing", products: 189, status: "Active", description: "Fashion and apparel" },
  {
    id: 3,
    name: "Home & Garden",
    products: 156,
    status: "Active",
    description: "Home improvement and garden supplies",
  },
  { id: 4, name: "Sports", products: 98, status: "Active", description: "Sports equipment and gear" },
  { id: 5, name: "Books", products: 67, status: "Inactive", description: "Books and publications" },
]

export function CategoryTable() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search categories..." className="pl-10" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Category</th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Description
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Products</th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
              <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="py-4">
                  <div className="font-medium text-gray-900">{category.name}</div>
                </td>
                <td className="py-4">
                  <div className="text-sm text-gray-600">{category.description}</div>
                </td>
                <td className="py-4">
                  <div className="text-sm text-gray-900">{category.products}</div>
                </td>
                <td className="py-4">
                  <Badge
                    variant={category.status === "Active" ? "default" : "secondary"}
                    className={
                      category.status === "Active"
                        ? "bg-[#e8fff3] text-[#50cd89] hover:bg-[#e8fff3]"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                    }
                  >
                    {category.status}
                  </Badge>
                </td>
                <td className="py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/catalog/categories/${category.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
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
    </Card>
  )
}
