import { AlertCircle, Calendar, Package, RotateCcw } from 'lucide-react';
import { Header } from '@/components/layouts/header';
import { Sidebar } from '@/components/layouts/sidebar';
import { MainContent } from '@/components/layouts/main-content';
import { PageHeader } from '@/components/page-header';
import { ReturnsChart } from '@/components/returns-chart';
import { ReturnsTable } from '@/components/returns-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-6">
            <PageHeader
              title="Returns Report"
              breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Reports' }, { label: 'Returns' }]}
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
                      <p className="text-sm font-medium text-gray-600">Total Returns</p>
                      <p className="text-2xl font-bold text-gray-900">127</p>
                      <p className="text-sm text-[#f1416c]">+3.2% from last month</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff5f8]">
                      <RotateCcw className="h-6 w-6 text-[#f1416c]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Products Returned</p>
                      <p className="text-2xl font-bold text-gray-900">189</p>
                      <p className="text-sm text-gray-600">Across all orders</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e1f0ff]">
                      <Package className="h-6 w-6 text-[#009ef7]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Return Rate</p>
                      <p className="text-2xl font-bold text-gray-900">8.9%</p>
                      <p className="text-sm text-[#50cd89]">-1.2% from last month</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff8dd]">
                      <AlertCircle className="h-6 w-6 text-[#ffc700]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ReturnsTable />
              </div>
              <div>
                <ReturnsChart />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
