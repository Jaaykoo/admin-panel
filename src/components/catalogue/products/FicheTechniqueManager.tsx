'use client';

import type { FicheTechnique } from '@/types/ProductTypes';
import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FicheTechniqueManagerProps {
  value: FicheTechnique[];
  onChange: (fiches: FicheTechnique[]) => void;
  disabled?: boolean;
}

interface ContentItem {
  name: string;
  value: string;
}

export function FicheTechniqueManager({ value, onChange, disabled }: FicheTechniqueManagerProps) {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [titre, setTitre] = useState('');
  const [contentItems, setContentItems] = useState<ContentItem[]>([{ name: '', value: '' }]);

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined && value[index]) {
      setEditIndex(index);
      setTitre(value[index].titre);
      // Convertir l'objet content en array
      const contentArray = Array.isArray(value[index].content)
        ? value[index].content
        : Object.entries(value[index].content).map(([name, val]) => ({ name, value: val }));
      setContentItems(contentArray);
    } else {
      setEditIndex(null);
      setTitre('');
      setContentItems([{ name: '', value: '' }]);
    }
    setOpen(true);
  };

  const handleAddContentItem = () => {
    setContentItems([...contentItems, { name: '', value: '' }]);
  };

  const handleRemoveContentItem = (index: number) => {
    setContentItems(contentItems.filter((_, i) => i !== index));
  };

  const handleContentItemChange = (index: number, field: 'name' | 'value', newValue: string) => {
    const newItems = [...contentItems];
    newItems[index][field] = newValue;
    setContentItems(newItems);
  };

  const handleSave = () => {
    if (!titre.trim()) return;

    const validContentItems = contentItems.filter(item => item.name.trim() && item.value.trim());

    if (validContentItems.length === 0) return;

    const newFiche: FicheTechnique = {
      titre: titre.trim(),
      content: validContentItems as any,
    };

    if (editIndex !== null) {
      const newFiches = [...value];
      newFiches[editIndex] = newFiche;
      onChange(newFiches);
    } else {
      onChange([...value, newFiche]);
    }

    setOpen(false);
    setTitre('');
    setContentItems([{ name: '', value: '' }]);
    setEditIndex(null);
  };

  const handleRemoveFiche = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Fiches techniques</Label>
        <Button
          type="button"
          onClick={() => handleOpenDialog()}
          disabled={disabled}
          size="sm"
          className="bg-[#009ef7] hover:bg-[#0077b6]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une fiche
        </Button>
      </div>

      {value.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">
            Aucune fiche technique ajoutée. Cliquez sur "Ajouter une fiche" pour commencer.
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {value.map((fiche, index) => {
            const contentArray = Array.isArray(fiche.content)
              ? fiche.content
              : Object.entries(fiche.content).map(([name, val]) => ({ name, value: val }));

            return (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex w-full items-center justify-between pr-4">
                    <span className="text-sm font-medium">{fiche.titre}</span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(index);
                        }}
                        disabled={disabled}
                      >
                        Modifier
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFiche(index);
                        }}
                        disabled={disabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-4">
                    {contentArray.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{item.name}:</span>
                        <span className="text-gray-600">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? 'Modifier' : 'Ajouter'} une fiche technique
            </DialogTitle>
            <DialogDescription>
              Créez une fiche technique avec un titre et des caractéristiques
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titre">
                Titre de la fiche
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="titre"
                placeholder="Ex: Caractéristiques techniques"
                value={titre}
                onChange={e => setTitre(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Contenu</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddContentItem}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une ligne
                </Button>
              </div>

              <div className="max-h-[400px] space-y-2 overflow-y-auto">
                {contentItems.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Nom (ex: Processeur)"
                      value={item.name}
                      onChange={e => handleContentItemChange(index, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Valeur (ex: Intel Core i5)"
                      value={item.value}
                      onChange={e => handleContentItemChange(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => handleRemoveContentItem(index)}
                      disabled={contentItems.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setTitre('');
                setContentItems([{ name: '', value: '' }]);
                setEditIndex(null);
              }}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-[#009ef7] hover:bg-[#0077b6]"
              disabled={!titre.trim() || contentItems.every(item => !item.name.trim() || !item.value.trim())}
            >
              {editIndex !== null ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

