"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const customers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    orders: 12,
    totalSpent: 3456.0,
    status: "active",
    joinDate: "2023-08-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 234-5678",
    orders: 8,
    totalSpent: 2189.0,
    status: "active",
    joinDate: "2023-09-22",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "+1 (555) 345-6789",
    orders: 25,
    totalSpent: 8923.0,
    status: "vip",
    joinDate: "2023-05-10",
  },
  {
    id: 4,
    name: "James Brown",
    email: "james.brown@example.com",
    phone: "+1 (555) 456-7890",
    orders: 3,
    totalSpent: 567.0,
    status: "active",
    joinDate: "2024-01-05",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    phone: "+1 (555) 567-8901",
    orders: 0,
    totalSpent: 0,
    status: "inactive",
    joinDate: "2023-11-30",
  },
  {
    id: 6,
    name: "David Martinez",
    email: "david.martinez@example.com",
    phone: "+1 (555) 678-9012",
    orders: 18,
    totalSpent: 5432.0,
    status: "vip",
    joinDate: "2023-06-18",
  },
]

const statusConfig = {
  active: { label: "Active", className: "bg-[#e8fff3] text-[#50cd89]" },
  inactive: { label: "Inactive", className: "bg-gray-100 text-gray-600" },
  vip: { label: "VIP", className: "bg-[#f8f5ff] text-[#7239ea]" },
}

export function CustomerTable() {
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])

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
                      setSelectedCustomers(customers.map((c) => c.id))
                    } else {
                      setSelectedCustomers([])
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Join Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCustomers([...selectedCustomers, customer.id])
                      } else {
                        setSelectedCustomers(selectedCustomers.filter((id) => id !== customer.id))
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#009ef7] text-white">
                      <span className="text-sm font-medium">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{customer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="text-gray-900">{customer.email}</div>
                    <div className="text-gray-500">{customer.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{customer.orders}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">${customer.totalSpent.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <Badge
                    variant="secondary"
                    className={statusConfig[customer.status as keyof typeof statusConfig].className}
                  >
                    {statusConfig[customer.status as keyof typeof statusConfig].label}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{customer.joinDate}</td>
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
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
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
