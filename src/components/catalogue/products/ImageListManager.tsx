'use client';

import type { ProductImage } from '@/types/ProductTypes';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
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

type ImageListManagerProps = {
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  disabled?: boolean;
};

export function ImageListManager({ value, onChange, disabled }: ImageListManagerProps) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [urlError, setUrlError] = useState('');

  const urlRegex = /^https?:\/\/.+\.(?:jpg|jpeg|png|gif|webp)(?:\?.*)?$/i;

  const handleAddImage = () => {
    if (!imageUrl) {
      setUrlError('L\'URL est requise');
      return;
    }

    if (!urlRegex.test(imageUrl)) {
      setUrlError('URL d\'image invalide. Format accepté: .jpg, .jpeg, .png, .gif, .webp');
      return;
    }

    const newImage: ProductImage = {
      original: imageUrl,
      caption: caption || undefined,
      display_order: value.length + 1,
    };

    onChange([...value, newImage]);
    setImageUrl('');
    setCaption('');
    setUrlError('');
    setOpen(false);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    // Réorganiser les display_order
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      display_order: i + 1,
    }));
    onChange(reorderedImages);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || !value[index] || !value[index - 1]) {
      return;
    }
    const newImages = [...value];
    const temp = newImages[index - 1];
    newImages[index - 1] = newImages[index]!;
    newImages[index] = temp!;
    // Réorganiser les display_order
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      display_order: i + 1,
    }));
    onChange(reorderedImages);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Images du produit</Label>
        <Button
          type="button"
          onClick={() => setOpen(true)}
          disabled={disabled}
          size="sm"
          className="bg-[#009ef7] hover:bg-[#0077b6]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une image
        </Button>
      </div>

      {value.length === 0
        ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <p className="text-sm text-gray-500">
                Aucune image ajoutée. Cliquez sur "Ajouter une image" pour commencer.
              </p>
            </div>
          )
        : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {value.map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border bg-white p-2"
                >
                  <div className="relative aspect-square overflow-hidden rounded">
                    <Image
                      src={image.original}
                      alt={image.caption || `Image ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {image.caption && (
                    <p className="mt-2 truncate text-xs text-gray-600">{image.caption}</p>
                  )}

                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0 || disabled}
                    >
                      <GripVertical className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => handleRemoveImage(index)}
                      disabled={disabled}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute top-2 left-2">
                    <span className="rounded bg-black/50 px-2 py-1 text-xs text-white">
                      {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une image</DialogTitle>
            <DialogDescription>
              Entrez l'URL de l'image. Le système téléchargera automatiquement l'image.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">
                URL de l'image
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setUrlError('');
                }}
              />
              {urlError && <p className="text-sm text-red-500">{urlError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Légende (optionnel)</Label>
              <Input
                id="caption"
                placeholder="Description de l'image"
                value={caption}
                onChange={e => setCaption(e.target.value)}
              />
            </div>

            {imageUrl && urlRegex.test(imageUrl) && (
              <div className="relative aspect-video overflow-hidden rounded border">
                <Image
                  src={imageUrl}
                  alt="Prévisualisation"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setImageUrl('');
                setCaption('');
                setUrlError('');
              }}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleAddImage}
              className="bg-[#009ef7] hover:bg-[#0077b6]"
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
