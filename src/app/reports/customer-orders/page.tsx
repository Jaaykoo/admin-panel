import { Calendar, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { CustomerOrdersChart } from '@/components/customer-orders-chart';
import { Header } from '@/components/layouts/header';
import { Sidebar } from '@/components/layouts/sidebar';
import { MainContent } from '@/components/layouts/main-content';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CustomerOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-6">
            <PageHeader
              title="Customer Orders"
              breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Reports' }, { label: 'Customer Orders' }]}
              actions={(
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last 30 Days
                </Button>
              )}
            />

            <div className="mb-6 grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Customers</p>
                      <p className="text-2xl font-bold text-gray-900">892</p>
                      <p className="text-sm text-[#50cd89]">+15.3% from last month</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f8f5ff]">
                      <Users className="h-6 w-6 text-[#7239ea]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Orders per Customer</p>
                      <p className="text-2xl font-bold text-gray-900">3.2</p>
                      <p className="text-sm text-[#50cd89]">+0.4 from last month</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e1f0ff]">
                      <ShoppingCart className="h-6 w-6 text-[#009ef7]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Customer Value</p>
                      <p className="text-2xl font-bold text-gray-900">$278.90</p>
                      <p className="text-sm text-[#50cd89]">+12.1% from last month</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8fff3]">
                      <DollarSign className="h-6 w-6 text-[#50cd89]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <CustomerOrdersChart />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                          Customer
                        </th>
                        <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                          Orders
                        </th>
                        <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                          Total Spent
                        </th>
                        <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                          Avg. Order Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { name: 'John Doe', orders: 24, spent: 2456.8, avg: 102.37 },
                        { name: 'Jane Smith', orders: 18, spent: 1890.5, avg: 105.03 },
                        { name: 'Bob Johnson', orders: 15, spent: 1567.25, avg: 104.48 },
                        { name: 'Alice Brown', orders: 12, spent: 1234.9, avg: 102.91 },
                        { name: 'Charlie Wilson', orders: 10, spent: 987.6, avg: 98.76 },
                      ].map((customer, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                          <td className="py-4 text-sm text-gray-900">{customer.orders}</td>
                          <td className="py-4 text-sm font-medium text-gray-900">
                            $
                            {customer.spent.toFixed(2)}
                          </td>
                          <td className="py-4 text-sm text-gray-900">
                            $
                            {customer.avg.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
