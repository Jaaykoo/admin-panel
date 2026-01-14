'use client';

import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import { cn } from '@/lib/utils';

// Import dynamique pour éviter les erreurs SSR
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false },
);

export interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  minHeight?: number;
}

/**
 * Composant éditeur Markdown basé sur @uiw/react-md-editor
 * Optimisé pour les descriptions de produits e-commerce
 */
export const MarkdownEditor = forwardRef<HTMLDivElement, MarkdownEditorProps>(
  (
    {
      value = '',
      onChange,
      error,
      label,
      description,
      required,
      disabled,
      className,
      minHeight = 200,
    },
    ref,
  ) => {
    const handleChange = (val?: string) => {
      onChange?.(val ?? '');
    };

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div
          data-color-mode="light"
          className={cn(
            'rounded-md border',
            error ? 'border-red-500' : 'border-input',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <MDEditor
            value={value}
            onChange={handleChange}
            height={minHeight}
            preview="edit"
          />
        </div>

        {description && !error && (
          <p className="text-[0.8rem] text-muted-foreground">{description}</p>
        )}

        {error && (
          <p className="text-sm font-medium text-red-500">{error}</p>
        )}
      </div>
    );
  },
);

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;

