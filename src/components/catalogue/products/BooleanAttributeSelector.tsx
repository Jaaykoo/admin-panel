'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type BooleanAttributeSelectorProps = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
};

export function BooleanAttributeSelector({
  label,
  value,
  onChange,
  required,
  disabled,
}: BooleanAttributeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={`Sélectionner ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="True">Oui</SelectItem>
          <SelectItem value="False">Non</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
