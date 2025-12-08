'use client';

import type { ProductClassDetail } from '@/types/ProductClassTypes';
import type { ProductAttribute } from '@/types/ProductTypes';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { normalizeAttributeValue, parseOptionValue } from '@/helpers/UrlHelper';
import { BooleanAttributeSelector } from './BooleanAttributeSelector';
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
  // Mapping entre valeurs parsées (affichage) et valeurs originales (envoi API)
  const [optionMappings, setOptionMappings] = useState<Record<string, Record<string, string>>>({});

  // Initialiser les valeurs des attributs
  useEffect(() => {
    if (value.length > 0 && productClass?.attributes) {
      const initialValues: Record<string, string> = {};
      value.forEach((attr) => {
        // Trouver le type d'attribut
        const attributeConfig = productClass.attributes.find(a => a.code === attr.code);

        let normalizedValue = attr.value;

        if (attributeConfig?.type === 'option') {
          // Pour les attributs option, parser la valeur si elle est au format API
          normalizedValue = parseOptionValue(attr.value);
        } else {
          // Pour les autres types, normaliser (extraire slug depuis URL si nécessaire)
          normalizedValue = normalizeAttributeValue(attr.value);
        }

        initialValues[attr.code] = normalizedValue;
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAttributeValues(initialValues);
    }
  }, [value, productClass]);

  // Créer le mapping entre valeurs parsées et originales pour chaque attribut option
  useEffect(() => {
    if (productClass?.attributes) {
      const mappings: Record<string, Record<string, string>> = {};

      productClass.attributes.forEach((attribute) => {
        if (attribute.type === 'option' && attribute.option_group) {
          const rawOptions = attribute.option_group.options || [];
          const attrCode = attribute.code;
          const attrMapping: Record<string, string> = {};

          rawOptions.forEach((rawOption) => {
            const parsedValue = parseOptionValue(rawOption);
            // Map: parsedValue → rawOption
            if (parsedValue) {
              attrMapping[parsedValue] = rawOption;
            }
          });

          mappings[attrCode] = attrMapping;
        }
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks-extra/no-direct-set-state-in-use-effect
      setOptionMappings(mappings);
    }
  }, [productClass]);

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

        // Pour les attributs de type option, utiliser la valeur originale de l'API
        let finalValue = val;
        if (attr?.type === 'option' && optionMappings[attrCode]) {
          finalValue = optionMappings[attrCode][val] || val;
        }

        return {
          code: attrCode,
          name: attr?.name || attrCode,
          value: finalValue, // Valeur originale de l'API
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

          // Type option (select)
          if (attribute.type === 'option' && attribute.option_group) {
            // Parser les options depuis le format API "{'option': 'HP'}" → "HP"
            const rawOptions = attribute.option_group.options || [];
            const parsedOptions = rawOptions.map(parseOptionValue);

            // Debug: vérifier si la valeur est dans les options
            if (currentValue && !parsedOptions.includes(currentValue)) {
              console.warn(`⚠️ Attribut "${attribute.name}" (${attribute.code}):`, {
                currentValue,
                parsedOptions,
                rawOptions,
                isInOptions: parsedOptions.includes(currentValue),
              });
            }

            return (
              <OptionAttributeSelector
                key={attribute.code}
                label={attribute.name}
                options={parsedOptions}
                value={currentValue}
                onChange={newValue => handleAttributeChange(attribute.code, attribute.name, newValue)}
                required={attribute.required}
                disabled={disabled}
              />
            );
          }

          // Type boolean (Oui/Non → True/False)
          if (attribute.type === 'boolean') {
            return (
              <BooleanAttributeSelector
                key={attribute.code}
                label={attribute.name}
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
