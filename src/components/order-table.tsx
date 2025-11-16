'use client';

import { Eye, MoreHorizontal, Printer, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const orders = [
  {
    id: '#ORD-2024-001',
    customer: 'Sarah Johnson',
    date: '2024-01-15',
    items: 3,
    total: 299.0,
    status: 'completed',
    payment: 'paid',
  },
  {
    id: '#ORD-2024-002',
    customer: 'Michael Chen',
    date: '2024-01-15',
    items: 2,
    total: 149.0,
    status: 'processing',
    payment: 'paid',
  },
  {
    id: '#ORD-2024-003',
    customer: 'Emma Wilson',
    date: '2024-01-14',
    items: 5,
    total: 599.0,
    status: 'completed',
    payment: 'paid',
  },
  {
    id: '#ORD-2024-004',
    customer: 'James Brown',
    date: '2024-01-14',
    items: 1,
    total: 79.0,
    status: 'pending',
    payment: 'pending',
  },
  {
    id: '#ORD-2024-005',
    customer: 'Lisa Anderson',
    date: '2024-01-13',
    items: 4,
    total: 399.0,
    status: 'completed',
    payment: 'paid',
  },
  {
    id: '#ORD-2024-006',
    customer: 'David Martinez',
    date: '2024-01-13',
    items: 2,
    total: 199.0,
    status: 'shipped',
    payment: 'paid',
  },
  {
    id: '#ORD-2024-007',
    customer: 'Jennifer Lee',
    date: '2024-01-12',
    items: 3,
    total: 449.0,
    status: 'processing',
    payment: 'paid',
  },
  {
    id: '#ORD-2024-008',
    customer: 'Robert Taylor',
    date: '2024-01-12',
    items: 1,
    total: 89.0,
    status: 'cancelled',
    payment: 'refunded',
  },
];

const statusConfig = {
  completed: { label: 'Completed', className: 'bg-[#e8fff3] text-[#50cd89]' },
  processing: { label: 'Processing', className: 'bg-[#e1f0ff] text-[#009ef7]' },
  pending: { label: 'Pending', className: 'bg-[#fff8dd] text-[#ffc700]' },
  shipped: { label: 'Shipped', className: 'bg-[#f8f5ff] text-[#7239ea]' },
  cancelled: { label: 'Cancelled', className: 'bg-[#fff5f8] text-[#f1416c]' },
};

const paymentConfig = {
  paid: { label: 'Paid', className: 'bg-[#e8fff3] text-[#50cd89]' },
  pending: { label: 'Pending', className: 'bg-[#fff8dd] text-[#ffc700]' },
  refunded: { label: 'Refunded', className: 'bg-gray-100 text-gray-600' },
};

export function OrderTable() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

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
                      setSelectedOrders(orders.map(o => o.id));
                    } else {
                      setSelectedOrders([]);
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Payment
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders([...selectedOrders, order.id]);
                      } else {
                        setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{order.id}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  $
                  {order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="secondary"
                    className={statusConfig[order.status as keyof typeof statusConfig].className}
                  >
                    {statusConfig[order.status as keyof typeof statusConfig].label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="secondary"
                    className={paymentConfig[order.payment as keyof typeof paymentConfig].className}
                  >
                    {paymentConfig[order.payment as keyof typeof paymentConfig].label}
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
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[#f1416c]">
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Order
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
  );
}
