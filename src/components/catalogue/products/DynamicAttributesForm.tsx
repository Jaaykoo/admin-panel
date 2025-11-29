'use client';

import type { ProductClassDetail } from '@/types/ProductClassTypes';
import type { ProductAttribute } from '@/types/ProductTypes';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OptionAttributeSelector } from './OptionAttributeSelector';

type DynamicAttributesFormProps = {
  productClass: ProductClassDetail | null;
  value: ProductAttribute[];
  onChange: (attributes: ProductAttribute[]) => void;
  disabled?: boolean;
};

export function DynamicAttributesForm({
  productClass,
  value,
  onChange,
  disabled,
}: DynamicAttributesFormProps) {
  const [attributeValues, setAttributeValues] = useState<Record<string, string>>({});

  // Initialiser les valeurs des attributs
  useEffect(() => {
    if (value.length > 0) {
      const initialValues: Record<string, string> = {};
      value.forEach((attr) => {
        initialValues[attr.code] = attr.value;
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAttributeValues(initialValues);
    }
  }, [value]);

  const handleAttributeChange = (code: string, _name: string, newValue: string) => {
    const newAttributeValues = {
      ...attributeValues,
      [code]: newValue,
    };
    setAttributeValues(newAttributeValues);

    // Mettre à jour le tableau d'attributs
    const updatedAttributes = Object.entries(newAttributeValues)
      .filter(([, val]) => val) // Exclure les valeurs vides
      .map(([attrCode, val]) => {
        const attr = productClass?.attributes.find(a => a.code === attrCode);
        return {
          code: attrCode,
          name: attr?.name || attrCode,
          value: val,
        };
      });

    onChange(updatedAttributes);
  };

  if (!productClass || !productClass.attributes || productClass.attributes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">
        Attributs spécifiques (
        {productClass.name}
        )
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {productClass.attributes.map((attribute) => {
          const currentValue = attributeValues[attribute.code] || '';

          if (attribute.type === 'option' && attribute.option_group) {
            return (
              <OptionAttributeSelector
                key={attribute.code}
                label={attribute.name}
                options={attribute.option_group.options || []}
                value={currentValue}
                onChange={newValue => handleAttributeChange(attribute.code, attribute.name, newValue)}
                required={attribute.required}
                disabled={disabled}
              />
            );
          }

          // Type text
          return (
            <div key={attribute.code} className="space-y-2">
              <Label htmlFor={attribute.code}>
                {attribute.name}
                {attribute.required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id={attribute.code}
                value={currentValue}
                onChange={e => handleAttributeChange(attribute.code, attribute.name, e.target.value)}
                placeholder={`Saisir ${attribute.name.toLowerCase()}`}
                disabled={disabled}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
