'use client';

import { useState } from 'react';
import { Header } from '@/components/layouts/header';
import { Sidebar } from '@/components/layouts/sidebar';
import { MainContent } from '@/components/layouts/main-content';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddOrderPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sameAddress, setSameAddress] = useState(true);

  const products = [
    { id: '1', name: 'Product 1', price: 83.0, sku: '03434004', stock: 34, image: '/diverse-products-still-life.png' },
    { id: '2', name: 'Product 2', price: 113.0, sku: '02365001', stock: 1, image: '/diverse-products-still-life.png' },
    { id: '3', name: 'Product 3', price: 104.0, sku: '02847004', stock: 40, image: '/diverse-products-still-life.png' },
    { id: '4', name: 'Product 4', price: 156.0, sku: '02537002', stock: 8, image: '/diverse-products-still-life.png' },
    { id: '5', name: 'Product 5', price: 97.0, sku: '01434001', stock: 18, image: '/diverse-products-still-life.png' },
  ];

  const totalCost = products.filter(p => selectedProducts.includes(p.id)).reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-6">
            <PageHeader
              title="Add Order"
              breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'eCommerce' }, { label: 'Sales' }]}
              actions={(
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
              )}
            />

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - Order Details */}
              <div className="space-y-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="mb-2 block text-sm font-medium text-gray-700">Order ID</Label>
                      <div className="text-lg font-bold text-gray-900">#14316</div>
                    </div>
                    <div>
                      <Label htmlFor="payment" className="mb-2 block text-sm font-medium text-gray-700">
                        Payment Method
                        {' '}
                        <span className="text-[#f1416c]">*</span>
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="cash">Cash on Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="mt-2 text-xs text-gray-500">Set the date of the order to process.</p>
                    </div>
                    <div>
                      <Label htmlFor="shipping" className="mb-2 block text-sm font-medium text-gray-700">
                        Shipping Method
                        {' '}
                        <span className="text-[#f1416c]">*</span>
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Shipping</SelectItem>
                          <SelectItem value="express">Express Shipping</SelectItem>
                          <SelectItem value="pickup">Store Pickup</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="mt-2 text-xs text-gray-500">Set the date of the order to process.</p>
                    </div>
                    <div>
                      <Label htmlFor="orderDate" className="mb-2 block text-sm font-medium text-gray-700">
                        Order Date
                        {' '}
                        <span className="text-[#f1416c]">*</span>
                      </Label>
                      <Input id="orderDate" type="date" />
                      <p className="mt-2 text-xs text-gray-500">Set the date of the order to process.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Select Products & Delivery */}
              <div className="space-y-6 lg:col-span-2">
                {/* Select Products */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Select Products</CardTitle>
                    <p className="mt-1 text-sm text-gray-500">Add products to this order</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="mb-4 text-base font-semibold text-gray-900">
                        Total Cost: $
                        {' '}
                        <span className="text-[#009ef7]">{totalCost.toFixed(2)}</span>
                      </div>
                      <p className="mb-4 text-sm text-gray-500">
                        Select one or more products from the list below by ticking the checkbox.
                      </p>
                      <div className="relative">
                        <svg
                          className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <Input
                          placeholder="Search Products"
                          className="pl-10"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                              Product
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                              QTY Remaining
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={selectedProducts.includes(product.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedProducts([...selectedProducts, product.id]);
                                      } else {
                                        setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                      }
                                    }}
                                  />
                                  <img
                                    src={product.image || '/placeholder.svg'}
                                    alt={product.name}
                                    className="h-12 w-12 rounded object-cover"
                                  />
                                  <div>
                                    <div className="font-medium text-gray-900">{product.name}</div>
                                    <div className="text-sm text-gray-500">
                                      Price: $
                                      {product.price.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      SKU:
                                      {product.sku}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-right">
                                {product.stock < 10
                                  ? (
                                      <div className="flex items-center justify-end gap-2">
                                        <span className="inline-flex items-center rounded bg-[#fff8dd] px-2.5 py-0.5 text-xs font-medium text-[#ffc700]">
                                          Low stock
                                        </span>
                                        <span className="font-medium text-gray-900">{product.stock}</span>
                                      </div>
                                    )
                                  : (
                                      <span className="font-medium text-gray-900">{product.stock}</span>
                                    )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Details */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Delivery Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="mb-4 text-base font-semibold text-gray-900">Billing Address</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="address1" className="mb-2 block text-sm font-medium text-gray-700">
                            Address Line 1
                            {' '}
                            <span className="text-[#f1416c]">*</span>
                          </Label>
                          <Input id="address1" placeholder="Address Line 1" />
                        </div>
                        <div>
                          <Label htmlFor="address2" className="mb-2 block text-sm font-medium text-gray-700">
                            Address Line 2
                          </Label>
                          <Input id="address2" placeholder="Address Line 2" />
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div>
                          <Label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-700">
                            City
                          </Label>
                          <Input id="city" />
                        </div>
                        <div>
                          <Label htmlFor="postcode" className="mb-2 block text-sm font-medium text-gray-700">
                            Postcode
                            {' '}
                            <span className="text-[#f1416c]">*</span>
                          </Label>
                          <Input id="postcode" />
                        </div>
                        <div>
                          <Label htmlFor="state" className="mb-2 block text-sm font-medium text-gray-700">
                            State
                            {' '}
                            <span className="text-[#f1416c]">*</span>
                          </Label>
                          <Input id="state" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="country" className="mb-2 block text-sm font-medium text-gray-700">
                          Country
                          {' '}
                          <span className="text-[#f1416c]">*</span>
                        </Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Checkbox
                          id="sameAddress"
                          checked={sameAddress}
                          onCheckedChange={checked => setSameAddress(checked as boolean)}
                        />
                        <Label htmlFor="sameAddress" className="cursor-pointer text-sm text-gray-700">
                          Shipping address is the same as billing address
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-[#009ef7] hover:bg-[#0077b6]">Save Changes</Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
