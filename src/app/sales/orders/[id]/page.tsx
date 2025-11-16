'use client';

import { ArrowLeft, Award, FileText, Package } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OrderDetailsPage() {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>-</span>
            <Link href="/sales" className="hover:text-primary">
              eCommerce
            </Link>
            <span>-</span>
            <span>Sales</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
          </Button>
          <Button className="bg-[#009ef7] hover:bg-[#0077b6]">Create</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="h-auto rounded-none border-b border-gray-200 bg-white p-0">
          <TabsTrigger
            value="summary"
            className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-[#009ef7] data-[state=active]:text-[#009ef7]"
          >
            Order Summary
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-[#009ef7] data-[state=active]:text-[#009ef7]"
          >
            Order History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-6">
          <div className="mb-6 flex justify-end gap-3">
            <Link href="/sales/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button size="sm" className="bg-[#50cd89] text-white hover:bg-[#47be7d]">
              Edit Order
            </Button>
            <Button size="sm" className="bg-[#009ef7] hover:bg-[#0077b6]">
              Add New Order
            </Button>
          </div>

          {/* Top Cards */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Order Details */}
            <Card className="bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Details (#14534)</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Date Added</div>
                    <div className="font-medium text-gray-900">29/10/2025</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Payment Method</div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Online</span>
                      <img src="/visa-logo-generic.png" alt="Visa" className="h-5" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Shipping Method</div>
                    <div className="font-medium text-gray-900">Flat Shipping Rate</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customer Details */}
            <Card className="bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Customer Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Customer</div>
                    <div className="flex items-center gap-2">
                      <img src="/diverse-avatars.png" alt="Dan Wilso" className="h-6 w-6 rounded-full" />
                      <span className="font-medium text-gray-900">Dan Wilso</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium text-gray-900">dam@consilting.cor</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium text-gray-900">+6141 234 56</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Documents */}
            <Card className="bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Documents</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Invoice</div>
                    <div className="font-medium text-[#009ef7]">#INV-00041</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Shipping</div>
                    <div className="font-medium text-gray-900">#SHP-002541</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Reward Points</div>
                    <div className="font-medium text-gray-900">60</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Addresses */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Billing Address</h3>
              <div className="leading-relaxed text-gray-700">
                Unit 1/23 Hastings Road,
                <br />
                Melbourne 3000,
                <br />
                Victoria,
                <br />
                Australia.
              </div>
            </Card>
            <Card className="bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Shipping Address</h3>
              <div className="leading-relaxed text-gray-700">
                Unit 1/23 Hastings Road,
                <br />
                Melbourne 3000,
                <br />
                Victoria,
                <br />
                Australia.
              </div>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Order #14534</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">SKU</th>
                    <th className="pb-3 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      QTY
                    </th>
                    <th className="pb-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Unit Price
                    </th>
                    <th className="pb-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-900">
                          <div className="h-6 w-6 rounded-full bg-white"></div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Product 1</div>
                          <div className="text-sm text-gray-500">Delivery Date: 29/10/2025</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-700">01439007</td>
                    <td className="py-4 text-center text-gray-700">2</td>
                    <td className="py-4 text-right text-gray-700">$120.00</td>
                    <td className="py-4 text-right font-medium text-gray-900">$240.00</td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="/assorted-footwear.png"
                          alt="Footwear"
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Footwear</div>
                          <div className="text-sm text-gray-500">Delivery Date: 29/10/2025</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-700">03418001</td>
                    <td className="py-4 text-center text-gray-700">1</td>
                    <td className="py-4 text-right text-gray-700">$24.00</td>
                    <td className="py-4 text-right font-medium text-gray-900">$24.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Order Totals */}
            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">$264.00</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>VAT (0%)</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping Rate</span>
                  <span className="font-medium">$5.00</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span>$269.00</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="mb-6 flex justify-end gap-3">
            <Link href="/sales/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button size="sm" className="bg-[#50cd89] text-white hover:bg-[#47be7d]">
              Edit Order
            </Button>
            <Button size="sm" className="bg-[#009ef7] hover:bg-[#0077b6]">
              Add New Order
            </Button>
          </div>

          {/* Top Cards - Same as Summary */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Order Details */}
            <Card className="bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Details (#14534)</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Date Added</div>
                    <div className="font-medium text-gray-900">29/10/2025</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Payment Method</div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Online</span>
                      <img src="/visa-logo-generic.png" alt="Visa" className="h-5" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Shipping Method</div>
                    <div className="font-medium text-gray-900">Flat Shipping Rate</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customer Details */}
            <Card className="bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Customer Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Customer</div>
                    <div className="flex items-center gap-2">
                      <img src="/diverse-avatars.png" alt="Dan Wilso" className="h-6 w-6 rounded-full" />
                      <span className="font-medium text-gray-900">Dan Wilso</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium text-gray-900">dam@consilting.cor</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium text-gray-900">+6141 234 56</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Documents */}
            <Card className="bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Documents</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Invoice</div>
                    <div className="font-medium text-[#009ef7]">#INV-00041</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Shipping</div>
                    <div className="font-medium text-gray-900">#SHP-002541</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Reward Points</div>
                    <div className="font-medium text-gray-900">60</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Order History Table */}
          <Card className="mb-6 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Order History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Date Added
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Comment
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Order Status
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Customer Notified
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 text-gray-700">29/10/2025</td>
                    <td className="py-4 text-gray-700">Order completed</td>
                    <td className="py-4">
                      <Badge className="bg-[#e8fff3] text-[#50cd89] hover:bg-[#e8fff3]">Completed</Badge>
                    </td>
                    <td className="py-4 text-gray-700">No</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-700">28/10/2025</td>
                    <td className="py-4 text-gray-700">Order received by customer</td>
                    <td className="py-4">
                      <Badge className="bg-[#e8fff3] text-[#50cd89] hover:bg-[#e8fff3]">Delivered</Badge>
                    </td>
                    <td className="py-4 text-gray-700">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-700">27/10/2025</td>
                    <td className="py-4 text-gray-700">Order shipped from warehouse</td>
                    <td className="py-4">
                      <Badge className="bg-[#e1f0ff] text-[#009ef7] hover:bg-[#e1f0ff]">Delivering</Badge>
                    </td>
                    <td className="py-4 text-gray-700">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-700">26/10/2025</td>
                    <td className="py-4 text-gray-700">Payment received</td>
                    <td className="py-4">
                      <Badge className="bg-[#e1f0ff] text-[#009ef7] hover:bg-[#e1f0ff]">Processing</Badge>
                    </td>
                    <td className="py-4 text-gray-700">No</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-700">25/10/2025</td>
                    <td className="py-4 text-gray-700">Pending payment</td>
                    <td className="py-4">
                      <Badge className="bg-[#fff8dd] text-[#ffc700] hover:bg-[#fff8dd]">Pending</Badge>
                    </td>
                    <td className="py-4 text-gray-700">No</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-700">23/10/2025</td>
                    <td className="py-4 text-gray-700">Payment method expired</td>
                    <td className="py-4">
                      <Badge className="bg-[#fff5f8] text-[#f1416c] hover:bg-[#fff5f8]">Failed</Badge>
                    </td>
                    <td className="py-4 text-gray-700">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-700">22/10/2025</td>
                    <td className="py-4 text-gray-700">Pending payment</td>
                    <td className="py-4">
                      <Badge className="bg-[#fff8dd] text-[#ffc700] hover:bg-[#fff8dd]">Pending</Badge>
                    </td>
                    <td className="py-4 text-gray-700">No</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-700">21/10/2025</td>
                    <td className="py-4 text-gray-700">Order received</td>
                    <td className="py-4">
                      <Badge className="bg-[#fff8dd] text-[#ffc700] hover:bg-[#fff8dd]">Pending</Badge>
                    </td>
                    <td className="py-4 text-gray-700">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Order Data */}
          <Card className="bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Order Data</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-100 py-3">
                <span className="text-gray-500">IP Address</span>
                <span className="font-medium text-gray-900">172.68.221.26</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-3">
                <span className="text-gray-500">Forwarded IP</span>
                <span className="font-medium text-gray-900">89.201.163.49</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-3">
                <span className="text-gray-500">User Agent</span>
                <span className="text-sm font-medium text-gray-900">
                  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110
                  Safari/537.36
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-500">Accept Language</span>
                <span className="font-medium text-gray-900">en-GB,en-US;q=0.9,en;q=0.8</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
