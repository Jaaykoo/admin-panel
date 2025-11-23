'use client';

import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
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
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

type NavigationItem = {
  name: string;
  href: string;
  icon: any;
  children?: Array<{ name: string; href: string }>;
};

const navigation: NavigationItem[] = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  {
    name: 'Catalogue',
    href: '#',
    icon: Package,
    children: [
      { name: 'Types de produit', href: '/catalog/product-classes' },
      { name: 'Catégories', href: '/catalog/categories' },
      { name: 'Produits', href: '/catalog/products' },
    ],
  },
  {
    name: 'Ventes',
    href: '#',
    icon: ShoppingCart,
    children: [{ name: 'Commandes', href: '/sales/orders' }],
  },
  {
    name: 'Clients',
    href: '#',
    icon: Users,
    children: [
      { name: 'Particuliers', href: '/customers/particuliers' },
      { name: 'Entreprises', href: '/customers/entreprises' },
    ],
  },
  {
    name: 'Rapports',
    href: '/reports',
    icon: BarChart3,
    children: [
      { name: 'Ventes', href: '/reports/sales' },
      { name: 'Commandes Clients', href: '/reports/customer-orders' },
      { name: 'Produits Consultés', href: '/reports/products-viewed' },
      { name: 'Retours', href: '/reports/returns' },
      { name: 'Expéditions', href: '/reports/shipping' },
    ],
  },
  { name: 'Utilisateurs', href: '/users', icon: Users },
  { name: 'Devis', href: '/devis', icon: FileText },
  { name: 'Factures', href: '/invoices', icon: FileText },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Catalogue', 'Ventes', 'Rapports']);
  const { isCollapsed, toggleSidebar } = useSidebar();

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => (prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]));
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {!isCollapsed && (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen border-r border-gray-300 bg-white transition-all duration-300',
          isCollapsed ? '-translate-x-full lg:w-20 lg:translate-x-0' : 'w-64 translate-x-0',
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Logo et toggle */}
          <div className="w-full shrink-0">
            <div className="flex items-center justify-between px-4 py-5">
              {!isCollapsed && (
                <div className="relative h-12 w-32">
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
              )}
              <button
                onClick={toggleSidebar}
                className={cn(
                  'rounded-lg p-2 transition-colors hover:bg-gray-100',
                  isCollapsed && 'mx-auto',
                )}
                aria-label={isCollapsed ? 'Ouvrir le menu' : 'Fermer le menu'}
              >
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => {
              if ('children' in item && item.children) {
                const isExpanded = expandedMenus.includes(item.name);
                const hasActiveChild = item.children?.some(child => pathname === child.href);

                if (isCollapsed) {
                  return (
                    <div key={item.name} className="group relative">
                      <button
                        className={cn(
                          'flex w-full items-center justify-center rounded-lg p-3 transition-colors',
                          hasActiveChild ? 'bg-[#e1f0ff] text-[#009ef7]' : 'text-gray-700 hover:bg-gray-100',
                        )}
                        title={item.name}
                      >
                        <item.icon className="h-5 w-5" />
                      </button>
                      <div className="pointer-events-none absolute top-0 left-full z-50 ml-2 hidden rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg group-hover:block">
                        <div className="font-medium">{item.name}</div>
                        <div className="mt-1 space-y-1">
                          {item.children?.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="pointer-events-auto block py-1 hover:text-[#009ef7]"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

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

              if (isCollapsed) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group relative flex items-center justify-center rounded-lg p-3 transition-colors',
                      isActive ? 'bg-[#e1f0ff] text-[#009ef7]' : 'text-gray-700 hover:bg-gray-100',
                    )}
                    title={item.name}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="pointer-events-none absolute top-1/2 left-full z-50 ml-2 hidden -translate-y-1/2 rounded-lg bg-gray-900 px-3 py-2 text-sm whitespace-nowrap text-white shadow-lg group-hover:block">
                      {item.name}
                    </span>
                  </Link>
                );
              }

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
    </>
  );
}
