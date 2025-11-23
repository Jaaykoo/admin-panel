'use client';

import type { ProductClass, ProductClassCreate, ProductClassUpdate } from '@/types/ProductClassTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {get400ErrorMessage} from "@/helpers/ErrorMessageHelper";
import { extractProductClassSlugFromUrl } from '@/helpers/UrlHelper';
import { ProductClassCreateSchema, ProductClassUpdateSchema } from '@/schemas/ProductClassSchemas';
import { createProductClass, updateProductClass } from '@/services/ProductTypeService';

type ProductClassFormProps = {
  initialData?: ProductClass;
  isEditing?: boolean;
};

type FormData = ProductClassCreate | ProductClassUpdate;

export function ProductClassForm({ initialData, isEditing = false }: ProductClassFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = isEditing ? ProductClassUpdateSchema : ProductClassCreateSchema;

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: '',
      code: '',
      requires_shipping: true,
      track_stock: true,
      attributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'attributes',
  });

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        name: initialData.name,
        code: initialData.code,
        requires_shipping: initialData.requires_shipping,
        track_stock: initialData.track_stock,
        attributes: initialData.attributes || [],
      });
    }
  }, [initialData, isEditing, form]);

  // Générer le code automatiquement à partir du nom
  const handleNameChange = (name: string) => {
    if (!isEditing && !form.getValues('code')) {
      const code = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      form.setValue('code', code);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      if (isEditing && initialData) {
        await updateProductClass(extractProductClassSlugFromUrl(initialData.url), data as ProductClassUpdate);
        toast.success('Type de produit modifié avec succès');
      } else {
        await createProductClass(data as ProductClassCreate);
        toast.success('Type de produit créé avec succès');
      }

      router.push('/catalog/product-classes');
      router.refresh();
    } catch (error) {
      get400ErrorMessage(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAttribute = () => {
    append({
      url: '',
      name: '',
      code: '',
      product_class: '',
      type: 'text',
      required: false,
      option_group: {
        url: '',
        name: '',
        code: '',
        options: [],
      },
    });
  };

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Définissez les informations de base du type de produit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Livre électronique"
                          onChange={(e) => {
                            field.onChange(e);
                            handleNameChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Nom du type de produit affiché dans l'interface
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: ebook"
                          disabled={isEditing}
                        />
                      </FormControl>
                      <FormDescription>
                        Code unique pour identifier le type de produit
                        {isEditing && ' (non modifiable)'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configuration</h3>

                <FormField
                  control={form.control}
                  name="requires_shipping"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Nécessite une expédition
                        </FormLabel>
                        <FormDescription>
                          Cochez si ce type de produit nécessite une expédition physique
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="track_stock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Suivi du stock
                        </FormLabel>
                        <FormDescription>
                          Cochez pour activer le suivi du stock pour ce type de produit
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Attributs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attributs</CardTitle>
                  <CardDescription>
                    Définissez les attributs spécifiques à ce type de produit
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addAttribute}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un attribut
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {fields.length === 0
                ? (
                    <div className="py-8 text-center text-muted-foreground">
                      Aucun attribut défini. Cliquez sur "Ajouter un attribut" pour commencer.
                    </div>
                  )
                : (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="rounded-lg border p-4">
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-medium">
                              Attribut
                              {index + 1}
                            </h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`attributes.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nom de l'attribut</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Couleur" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`attributes.${index}.code`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Code de l'attribut</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: color" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`attributes.${index}.type`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Type</FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      // Initialiser option_group si type = option
                                      if (value === 'option') {
                                        const currentValue = form.getValues(`attributes.${index}.option_group`);
                                        if (!currentValue?.name) {
                                          const attributeName = form.getValues(`attributes.${index}.name`) || '';
                                          const attributeCode = form.getValues(`attributes.${index}.code`) || '';
                                          form.setValue(`attributes.${index}.option_group`, {
                                            url: '',
                                            name: attributeName,
                                            code: attributeCode,
                                            options: [],
                                          });
                                        }
                                      }
                                    }}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="text">Texte</SelectItem>
                                      <SelectItem value="integer">Entier</SelectItem>
                                      <SelectItem value="float">Décimal</SelectItem>
                                      <SelectItem value="boolean">Booléen</SelectItem>
                                      <SelectItem value="date">Date</SelectItem>
                                      <SelectItem value="option">Option</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex items-center space-x-2">
                              <FormField
                                control={form.control}
                                name={`attributes.${index}.required`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormLabel>Obligatoire</FormLabel>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          {/* Section des options si type = option */}
                          {form.watch(`attributes.${index}.type`) === 'option' && (
                            <div className="mt-4 border-t pt-4">
                              <div className="mb-3 flex items-center justify-between">
                                <h5 className="text-sm font-medium text-gray-700">Options disponibles</h5>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const currentOptions = form.getValues(`attributes.${index}.option_group.options`) || [];
                                    form.setValue(`attributes.${index}.option_group.options`, [...currentOptions, '']);
                                  }}
                                >
                                  <Plus className="mr-1 h-3 w-3" />
                                  Ajouter option
                                </Button>
                              </div>

                              <FormField
                                control={form.control}
                                name={`attributes.${index}.option_group.name`}
                                render={({ field }) => (
                                  <FormItem className="mb-3">
                                    <FormLabel>Nom du groupe d'options</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="Ex: Mémoire RAM" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`attributes.${index}.option_group.code`}
                                render={({ field }) => (
                                  <FormItem className="mb-3">
                                    <FormLabel>Code du groupe</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="Ex: ram" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="space-y-2">
                                {(form.watch(`attributes.${index}.option_group.options`) || []).map((_, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center space-x-2">
                                    <FormField
                                      control={form.control}
                                      name={`attributes.${index}.option_group.options.${optionIndex}`}
                                      render={({ field }) => (
                                        <FormItem className="flex-1">
                                          <FormControl>
                                            <Input
                                              {...field}
                                              placeholder={`Option ${optionIndex + 1}`}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const currentOptions = form.getValues(`attributes.${index}.option_group.options`) || [];
                                        const newOptions = currentOptions.filter((_, i) => i !== optionIndex);
                                        form.setValue(`attributes.${index}.option_group.options`, newOptions);
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}

                                {(!form.watch(`attributes.${index}.option_group.options`) || form.watch(`attributes.${index}.option_group.options`)?.length === 0) && (
                                  <div className="py-4 text-center text-sm text-muted-foreground">
                                    Aucune option définie. Cliquez sur "Ajouter option" pour commencer.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#009ef7] hover:bg-[#0077b6]"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
