import type { TablePaginationProps } from './pagination';
import type { BaseEntity } from '@/types/api';

import { ArchiveX } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/cn';
import { TablePagination } from './pagination';

const TableElement = ({ ref, className, ...props }: React.HTMLAttributes<HTMLTableElement> & { ref?: React.RefObject<HTMLTableElement | null> }) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
);
TableElement.displayName = 'Table';

const TableHeader = ({ ref, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement> & { ref?: React.RefObject<HTMLTableSectionElement | null> }) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
);
TableHeader.displayName = 'TableHeader';

const TableBody = ({ ref, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement> & { ref?: React.RefObject<HTMLTableSectionElement | null> }) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
);
TableBody.displayName = 'TableBody';

const TableFooter = ({ ref, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement> & { ref?: React.RefObject<HTMLTableSectionElement | null> }) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
);
TableFooter.displayName = 'TableFooter';

const TableRow = ({ ref, className, ...props }: React.HTMLAttributes<HTMLTableRowElement> & { ref?: React.RefObject<HTMLTableRowElement | null> }) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className,
    )}
    {...props}
  />
);
TableRow.displayName = 'TableRow';

const TableHead = ({ ref, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement> & { ref?: React.RefObject<HTMLTableCellElement | null> }) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
);
TableHead.displayName = 'TableHead';

const TableCell = ({ ref, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement> & { ref?: React.RefObject<HTMLTableCellElement | null> }) => (
  <td
    ref={ref}
    className={cn(
      'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
);
TableCell.displayName = 'TableCell';

const TableCaption = ({ ref, className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement> & { ref?: React.RefObject<HTMLTableCaptionElement | null> }) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
);
TableCaption.displayName = 'TableCaption';

export {
  TableBody,
  TableCaption,
  TableCell,
  TableElement,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};

type TableColumn<Entry> = {
  title: string;
  field: keyof Entry;
  Cell?: ({ entry }: { entry: Entry }) => React.ReactElement;
};

export type TableProps<Entry> = {
  data: Entry[];
  columns: TableColumn<Entry>[];
  pagination?: TablePaginationProps;
};

export const Table = <Entry extends BaseEntity>({
  data,
  columns,
  pagination,
}: TableProps<Entry>) => {
  if (!data?.length) {
    return (
      <div className="flex h-80 flex-col items-center justify-center bg-white text-gray-500">
        <ArchiveX className="size-16" />
        <h4>No Entries Found</h4>
      </div>
    );
  }
  return (
    <>
      <TableElement>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={column.title + index}>{column.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, entryIndex) => (
            <TableRow key={entry?.id || entryIndex}>
              {columns.map(({ Cell, field, title }, columnIndex) => (
                <TableCell key={title + columnIndex}>
                  {Cell ? <Cell entry={entry} /> : `${entry[field]}`}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableElement>

      {pagination && <TablePagination {...pagination} />}
    </>
  );
};
