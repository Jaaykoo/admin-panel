import type React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
};

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {item.href
                  ? (
                      <Link href={item.href} className="hover:text-[#009ef7]">
                        {item.label}
                      </Link>
                    )
                  : (
                      <span>{item.label}</span>
                    )}
                {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4" />}
              </div>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
