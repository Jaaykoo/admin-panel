import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { Header } from '@/components/layouts/header';
import { RecentOrders } from '@/components/recent-orders';
import { SalesChart } from '@/components/sales-chart';
import { Sidebar } from '@/components/layouts/sidebar';
import { StatCard } from '@/components/stat-card';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="pt-16">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-sm text-gray-500">
                Bienvenue ! Voici ce qui se passe avec votre entreprise aujourd'hui.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Revenu total"
                value="$45,231"
                change="+12.5%"
                changeType="positive"
                icon={DollarSign}
                iconColor="text-[#50cd89]"
                iconBg="bg-[#e8fff3]"
              />
              <StatCard
                title="Commandes totales"
                value="1,429"
                change="+8.2%"
                changeType="positive"
                icon={ShoppingCart}
                iconColor="text-[#009ef7]"
                iconBg="bg-[#e1f0ff]"
              />
              <StatCard
                title="Clients totaux"
                value="892"
                change="+15.3%"
                changeType="positive"
                icon={Users}
                iconColor="text-[#7239ea]"
                iconBg="bg-[#f8f5ff]"
              />
              <StatCard
                title="Taux de croissance"
                value="23.5%"
                change="-2.1%"
                changeType="negative"
                icon={TrendingUp}
                iconColor="text-[#ffc700]"
                iconBg="bg-[#fff8dd]"
              />
            </div>

            {/* Charts and Tables */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SalesChart />
              </div>
              <div>
                <RecentOrders />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
