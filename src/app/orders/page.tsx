import { Download, Filter, Plus } from 'lucide-react';
import { Header } from '@/components/layouts/header';
import { Sidebar } from '@/components/layouts/sidebar';
import { MainContent } from '@/components/layouts/main-content';
import { OrderTable } from '@/components/order-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-500">Track and manage all customer orders</p>
              </div>
              <Button className="bg-[#009ef7] hover:bg-[#0077b6]">
                <Plus className="mr-2 h-4 w-4" />
                Create Order
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <Card className="p-4">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">1,429</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="mt-1 text-2xl font-bold text-[#ffc700]">23</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Processing</p>
                <p className="mt-1 text-2xl font-bold text-[#009ef7]">45</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="mt-1 text-2xl font-bold text-[#50cd89]">1,361</p>
              </Card>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex-1">
                <Input type="search" placeholder="Search orders..." className="max-w-md border-gray-300" />
              </div>
              <Button variant="outline" className="border-gray-300 bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="border-gray-300 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Order Table */}
            <OrderTable />
          </div>
        </main>
      </MainContent>
    </div>
  );
}
