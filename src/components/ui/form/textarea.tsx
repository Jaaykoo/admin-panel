import type { UseFormRegisterReturn } from 'react-hook-form';
import type { FieldWrapperPassThroughProps } from './field-wrapper';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { FieldWrapper } from './field-wrapper';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>
  & FieldWrapperPassThroughProps & {
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
  };

const Textarea = ({ ref, className, label, error, registration, ...props }: TextareaProps & { ref?: React.RefObject<HTMLTextAreaElement | null> }) => {
  return (
    <FieldWrapper label={label} error={error}>
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...registration}
        {...props}
      />
    </FieldWrapper>
  );
};
Textarea.displayName = 'Textarea';

export { Textarea };
