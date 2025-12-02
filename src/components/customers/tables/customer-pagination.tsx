'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChangeAction: (page: number) => void;
  onPageSizeChangeAction: (size: number) => void;
};

export function CustomerPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChangeAction,
  onPageSizeChangeAction,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(4, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push('...');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = Math.max(totalPages - 3, 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Affichage de
          {' '}
          <span className="font-medium">{startItem}</span>
          {' '}
          à
          {' '}
          <span className="font-medium">{endItem}</span>
          {' '}
          sur
          {' '}
          <span className="font-medium">{totalItems}</span>
          {' '}
          résultats
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Lignes par page:</span>
          <select
            value={pageSize}
            onChange={e => onPageSizeChangeAction(Number(e.target.value))}
            className="focus:ring-opacity-20 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-[#009ef7] focus:ring-2 focus:ring-[#009ef7] focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChangeAction(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-gray-300"
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${currentPage}-${index}`} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChangeAction(page as number)}
                className={
                  currentPage === page
                    ? 'bg-[#009ef7] hover:bg-[#0077b6]'
                    : 'border-gray-300'
                }
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChangeAction(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-gray-300"
        >
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
