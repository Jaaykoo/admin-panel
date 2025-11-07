"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Download, Send, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const invoices = [
  {
    id: "INV-2024-001",
    customer: "Sarah Johnson",
    date: "2024-01-15",
    dueDate: "2024-02-14",
    amount: 299.0,
    status: "paid",
  },
  {
    id: "INV-2024-002",
    customer: "Michael Chen",
    date: "2024-01-15",
    dueDate: "2024-02-14",
    amount: 149.0,
    status: "paid",
  },
  {
    id: "INV-2024-003",
    customer: "Emma Wilson",
    date: "2024-01-14",
    dueDate: "2024-02-13",
    amount: 599.0,
    status: "paid",
  },
  {
    id: "INV-2024-004",
    customer: "James Brown",
    date: "2024-01-14",
    dueDate: "2024-02-13",
    amount: 79.0,
    status: "pending",
  },
  {
    id: "INV-2024-005",
    customer: "Lisa Anderson",
    date: "2024-01-13",
    dueDate: "2024-02-12",
    amount: 399.0,
    status: "paid",
  },
  {
    id: "INV-2024-006",
    customer: "David Martinez",
    date: "2024-01-13",
    dueDate: "2024-02-12",
    amount: 199.0,
    status: "sent",
  },
  {
    id: "INV-2024-007",
    customer: "Jennifer Lee",
    date: "2024-01-10",
    dueDate: "2024-02-09",
    amount: 449.0,
    status: "overdue",
  },
  {
    id: "INV-2024-008",
    customer: "Robert Taylor",
    date: "2024-01-12",
    dueDate: "2024-02-11",
    amount: 89.0,
    status: "draft",
  },
]

const statusConfig = {
  paid: { label: "Paid", className: "bg-[#e8fff3] text-[#50cd89]" },
  pending: { label: "Pending", className: "bg-[#fff8dd] text-[#ffc700]" },
  sent: { label: "Sent", className: "bg-[#e1f0ff] text-[#009ef7]" },
  overdue: { label: "Overdue", className: "bg-[#fff5f8] text-[#f1416c]" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600" },
}

export function InvoiceTable() {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])

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
                      setSelectedInvoices(invoices.map((i) => i.id))
                    } else {
                      setSelectedInvoices([])
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Invoice ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Issue Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Amount
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
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedInvoices.includes(invoice.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedInvoices([...selectedInvoices, invoice.id])
                      } else {
                        setSelectedInvoices(selectedInvoices.filter((id) => id !== invoice.id))
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{invoice.id}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{invoice.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.dueDate}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">${invoice.amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <Badge
                    variant="secondary"
                    className={statusConfig[invoice.status as keyof typeof statusConfig].className}
                  >
                    {statusConfig[invoice.status as keyof typeof statusConfig].label}
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
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="mr-2 h-4 w-4" />
                        Send to Customer
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
