'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type OptionAttributeSelectorProps = {
  label: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
};

export function OptionAttributeSelector({
  label,
  options,
  value,
  onChange,
  required,
  disabled,
}: OptionAttributeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Limiter à 5 options max pour le bouton "Autres..."
  const showOthersButton = options.length > 5;

  // Filtrer les options dans le dialog
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelectFromDialog = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={`Sélectionner ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showOthersButton && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(true)}
            disabled={disabled}
          >
            Autres...
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Sélectionner
              {label}
            </DialogTitle>
            <DialogDescription>
              Recherchez et sélectionnez une option
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            <div className="max-h-[400px] space-y-1 overflow-y-auto">
              {filteredOptions.length === 0
                ? (
                    <p className="py-6 text-center text-sm text-gray-500">
                      Aucune option trouvée
                    </p>
                  )
                : (
                    filteredOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSelectFromDialog(option)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100',
                          value === option && 'bg-[#009ef7]/10 hover:bg-[#009ef7]/20',
                        )}
                      >
                        <span>{option}</span>
                        {value === option && (
                          <Check className="h-4 w-4 text-[#009ef7]" />
                        )}
                      </button>
                    ))
                  )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
