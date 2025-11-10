'use client';

import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  {
    name: 'Catalogue',
    icon: Package,
    children: [
      { name: 'Produits', href: '/catalog/products' },
      { name: 'Catégories', href: '/catalog/categories' },
    ],
  },
  {
    name: 'Ventes',
    icon: ShoppingCart,
    children: [{ name: 'Commandes', href: '/sales/orders' }],
  },
  { name: 'Clients', href: '/customers', icon: Users },
  { name: 'Devis', href: '/devis', icon: FileText },
  {
    name: 'Rapports',
    icon: BarChart3,
    children: [
      { name: 'Produits consultés', href: '/reports/products-viewed' },
      { name: 'Ventes', href: '/reports/sales' },
      { name: 'Retours', href: '/reports/returns' },
      { name: 'Commandes clients', href: '/reports/customer-orders' },
      { name: 'Expédition', href: '/reports/shipping' },
    ],
  },
  {
    name: 'Gestion des utilisateurs',
    icon: Users,
    children: [{ name: 'Liste des utilisateurs', href: '/users' }],
  },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Catalogue', 'Ventes', 'Rapports']);

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => (prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]));
  };

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-64 border-r border-gray-300 bg-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative h-20 w-40">
              <Image
                src="/Logo.svg"
                alt="Logo"
                fill
                className="object-contain"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(45%) sepia(97%) saturate(2439%) hue-rotate(178deg) brightness(98%) contrast(101%)',
                }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            if ('children' in item) {
              const isExpanded = expandedMenus.includes(item.name);
              const hasActiveChild = item.children?.some(child => pathname === child.href);

              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      hasActiveChild ? 'text-[#009ef7]' : 'text-gray-700 hover:bg-gray-100',
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1 text-left">{item.name}</span>
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  {isExpanded && (
                    <div className="mt-1 ml-8 space-y-1">
                      {item.children?.map((child) => {
                        const isActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'block rounded-lg px-3 py-2 text-sm transition-colors',
                              isActive ? 'bg-[#e1f0ff] font-medium text-[#009ef7]' : 'text-gray-600 hover:bg-gray-100',
                            )}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-[#e1f0ff] text-[#009ef7]' : 'text-gray-700 hover:bg-gray-100',
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
