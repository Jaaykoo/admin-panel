'use client';

import type { ReactNode } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

type MainContentProps = {
  children: ReactNode;
  className?: string;
};

export function MainContent({ children, className }: MainContentProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        'min-h-screen transition-all duration-300 ease-in-out',
        isCollapsed ? 'pl-0 lg:pl-20' : 'pl-0 lg:pl-64',
        className,
      )}
    >
      {children}
    </div>
  );
}

