'use client';

import type { User } from '@/types/UserTypes';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useQueryRequest } from '@/hooks/_QueryRequestProvider';
import {
  useQueryResponseData,
  useQueryResponseLoading,
  UserQueryResponseProvider,
} from '@/hooks/user/UserQueryResponseProvider';
import { cn } from '@/lib/utils';

type CustomerSelectorProps = {
  value?: number;
  onValueChange: (customerId: number) => void;
  error?: string;
};

function CustomerSelectorContent({ value, onValueChange, error }: CustomerSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { updateState } = useQueryRequest();

  const isLoading = useQueryResponseLoading();
  const users = useQueryResponseData();

  // Filtrer uniquement les entreprises
  let customers = users.filter(user => user.role === 'ENTREPRISE');

  // S'assurer que le client sélectionné est dans la liste
  const selectedCustomer = users.find(c => c.id === value);
  if (selectedCustomer && !customers.some(c => c.id === value)) {
    customers = [selectedCustomer, ...customers];
  }

  // Update search with debounce to avoid infinite loop
  useEffect(() => {
    if (!open) {
      return;
    }

    const timeoutId = setTimeout(() => {
      updateState({
        search,
        limit: 10,
        filter: { role: 'ENTREPRISE' },
      });
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, open]);


  const getCustomerLabel = (customer: User) => {
    const { company_name, first_name, last_name } = customer.user_profile;
    return company_name || `${first_name} ${last_name}`.trim() || customer.email;
  };

  const handleSelect = (customer: User) => {
    onValueChange(customer.id);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              error && 'border-red-500',
            )}
          >
            {selectedCustomer
              ? getCustomerLabel(selectedCustomer)
              : 'Sélectionner un client...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Rechercher un client..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {!isLoading && search && customers.length === 0 && (
                <CommandEmpty>Aucun client trouvé.</CommandEmpty>
              )}
              {!isLoading && customers.length > 0 && (
                <CommandGroup>
                  {customers.map(customer => (
                    <CommandItem
                      key={customer.id}
                      value={customer.id.toString()}
                      onSelect={() => handleSelect(customer)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === customer.id ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {getCustomerLabel(customer)}
                        </span>
                        <span className="text-xs text-gray-500">{customer.email}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function CustomerSelector({ value, onValueChange, error }: CustomerSelectorProps) {
  return (
    <UserQueryResponseProvider>
      <CustomerSelectorContent
        value={value}
        onValueChange={onValueChange}
        error={error}
      />
    </UserQueryResponseProvider>
  );
}
