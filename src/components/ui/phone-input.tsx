'use client';

import type { ComponentProps } from 'react';
import PhoneInput from 'react-phone-number-input';
import { cn } from '@/lib/utils';
import 'react-phone-number-input/style.css';

type PhoneInputComponentProps = ComponentProps<typeof PhoneInput>;

export function PhoneInputComponent({
  className,
  ...props
}: PhoneInputComponentProps) {
  return (
    <PhoneInput
      {...props}
      defaultCountry="FR"
      international
      countryCallingCodeEditable={false}
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background',
        'placeholder:text-muted-foreground',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      numberInputProps={{
        className: 'flex-1 border-none outline-none bg-transparent',
      }}
    />
  );
}
