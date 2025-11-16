'use client';

import type { Category } from '@/types/CategoryTypes';
import { ChevronDown, ChevronRight, FolderOpen, FolderTree, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type CategoryNodeProps = {
  category: Category;
  level?: number;
  onSelect?: (category: Category) => void;
  selectedId?: number;
};

export function CategoryNode({
  category,
  level = 0,
  onSelect,
  selectedId,
}: CategoryNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedId === category.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleClick = () => {
    onSelect?.(category);
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 transition-colors cursor-pointer hover:bg-gray-100',
          isSelected && 'bg-blue-50 hover:bg-blue-100',
        )}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
        onClick={handleClick}
      >
        {/* Expand/Collapse button */}
        <button
          type="button"
          onClick={handleToggle}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded hover:bg-gray-200"
        >
          {hasChildren
            ? (
                isExpanded
                  ? (
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    )
                  : (
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    )
              )
            : (
                <span className="h-4 w-4" />
              )}
        </button>

        {/* Icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-gray-100 to-gray-200">
          {category.image && !imageError
            ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                  unoptimized={category.image.includes('localhost')}
                  onError={() => setImageError(true)}
                />
              )
            : category.image && imageError
              ? (
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                )
              : hasChildren
                ? (
                    <FolderOpen className="h-4 w-4 text-[#009ef7]" />
                  )
                : (
                    <FolderTree className="h-4 w-4 text-gray-500" />
                  )}
        </div>

        {/* Name */}
        <span
          className={cn(
            'flex-1 text-sm font-medium text-gray-900',
            isSelected && 'text-[#009ef7]',
          )}
        >
          {category.name}
        </span>

        {/* Breadcrumb badge */}
        {category.breadcrumbs && (
          <Badge variant="outline" className="text-xs font-normal">
            {category.breadcrumbs}
          </Badge>
        )}

        {/* Children count */}
        {hasChildren && (
          <Badge variant="secondary" className="bg-gray-100 text-xs">
            {category.children!.length}
          </Badge>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {category.children!.map(child => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
