'use client';

import type * as LabelPrimitive from '@radix-ui/react-label';
import type {
  ControllerProps,
  FieldPath,
  FieldValues,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import type { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';

import { cn } from '@/utils/cn';

import { Label } from './label';

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext>
  );
};

const useFormField = () => {
  const fieldContext = React.use(FormFieldContext);
  const itemContext = React.use(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const id = React.useId();

  return (
    <FormItemContext value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext>
  );
};
FormItem.displayName = 'FormItem';

const FormLabel = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { ref?: React.RefObject<React.ElementRef<typeof LabelPrimitive.Root> | null> }) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
};
FormLabel.displayName = 'FormLabel';

const FormControl = ({ ref, ...props }: React.ComponentPropsWithoutRef<typeof Slot> & { ref?: React.RefObject<React.ElementRef<typeof Slot> | null> }) => {
  const { error, formItemId, formDescriptionId, formMessageId }
    = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
};
FormControl.displayName = 'FormControl';

const FormDescription = ({ ref, className, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.RefObject<HTMLParagraphElement | null> }) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-[0.8rem] text-muted-foreground', className)}
      {...props}
    />
  );
};
FormDescription.displayName = 'FormDescription';

const FormMessage = ({ ref, className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.RefObject<HTMLParagraphElement | null> }) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-[0.8rem] font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
};
FormMessage.displayName = 'FormMessage';

type FormProps<TFormValues extends FieldValues, Schema> = {
  onSubmit: SubmitHandler<TFormValues>;
  schema: Schema;
  className?: string;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
};

const Form = <
  Schema extends ZodType<any, any, any>,
  TFormValues extends FieldValues = z.infer<Schema>,
>({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
}: FormProps<TFormValues, Schema>) => {
  const form = useForm({ ...options, resolver: zodResolver(schema) });
  return (
    <FormProvider {...form}>
      <form
        className={cn('space-y-6', className)}
        onSubmit={form.handleSubmit(onSubmit)}
        id={id}
      >
        {children(form)}
      </form>
    </FormProvider>
  );
};

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider,
  useFormField,
};
