import type { UseFormRegisterReturn } from 'react-hook-form';
import type { FieldWrapperPassThroughProps } from './field-wrapper';

import * as React from 'react';

import { cn } from '@/utils/cn';
import { FieldWrapper } from './field-wrapper';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>
  & FieldWrapperPassThroughProps & {
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
  };

const Input = ({ ref, className, type, label, error, registration, ...props }: InputProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
  return (
    <FieldWrapper label={label} error={error}>
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...registration}
        {...props}
      />
    </FieldWrapper>
  );
};
Input.displayName = 'Input';

export { Input };
