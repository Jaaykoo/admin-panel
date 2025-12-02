'use client';

import type { Category } from '@/types/CategoryTypes';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

type CategoryBreadcrumbProps = {
  category: Category;
  baseUrl?: string;
};

export function CategoryBreadcrumb({
  category,
  baseUrl = '/catalog/categories',
}: CategoryBreadcrumbProps) {
  const breadcrumbParts = category.breadcrumbs
    ? category.breadcrumbs.split('/')
    : [category.name];

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600">
      <Link
        href={baseUrl}
        className="flex items-center transition-colors hover:text-[#009ef7]"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbParts.map((part, index) => {
        const isLast = index === breadcrumbParts.length - 1;
        const href = `${baseUrl}/${breadcrumbParts.slice(0, index + 1).join('/')}`;

        return (
          <Fragment key={`${part}-${index}`}>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {isLast
              ? (
                  <span className="font-medium text-gray-900">{part}</span>
                )
              : (
                  <Link
                    href={href}
                    className="transition-colors hover:text-[#009ef7]"
                  >
                    {part}
                  </Link>
                )}
          </Fragment>
        );
      })}
    </nav>
  );
}
