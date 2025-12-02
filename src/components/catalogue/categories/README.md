# 📁 Composants de Gestion des Catégories

Ce dossier contient tous les composants nécessaires pour la gestion complète des catégories dans l'application admin.

## 🎯 Composants Disponibles

### 1. **CategoryNode** (`CategoryNode.tsx`)
Composant pour afficher un élément individuel de l'arbre de catégories.

**Props:**
- `category: Category` - La catégorie à afficher
- `level?: number` - Le niveau de profondeur dans l'arbre (default: 0)
- `onSelect?: (category: Category) => void` - Callback lors de la sélection
- `selectedId?: number` - ID de la catégorie sélectionnée

**Features:**
- ✅ Affichage hiérarchique avec indentation
- ✅ Expand/Collapse pour les catégories avec enfants
- ✅ Affichage de l'image ou icône
- ✅ Badge pour le breadcrumb
- ✅ Compteur d'enfants
- ✅ Clickable pour sélection

---

### 2. **CategoryTree** (`CategoryTree.tsx`)
Composant pour afficher l'arborescence complète des catégories.

**Props:**
- `categories: Category[]` - Liste des catégories racines
- `onSelect?: (category: Category) => void` - Callback lors de la sélection
- `selectedId?: number` - ID de la catégorie sélectionnée
- `showSearch?: boolean` - Afficher la barre de recherche (default: true)

**Features:**
- ✅ Recherche en temps réel (nom, breadcrumb, description)
- ✅ Filtrage récursif dans l'arborescence
- ✅ Affichage "Aucune catégorie trouvée" si vide
- ✅ Scroll vertical pour grandes listes
- ✅ Rendu récursif illimité

---

### 3. **CategorySelector** (`CategorySelector.tsx`)
Composant de sélection de catégorie parent avec Command Dialog.

**Props:**
- `categories: Category[]` - Liste des catégories disponibles
- `selectedCategory?: Category | null` - Catégorie actuellement sélectionnée
- `onSelect: (category: Category | null) => void` - Callback de sélection
- `placeholder?: string` - Placeholder du bouton
- `emptyText?: string` - Texte si aucune catégorie

**Features:**
- ✅ Dialog avec Command de Shadcn UI
- ✅ Recherche instantanée dans toutes les catégories
- ✅ Affichage du breadcrumb complet
- ✅ Preview de la catégorie sélectionnée avec image
- ✅ Bouton "Retirer" pour désélectionner
- ✅ Liste aplatie des catégories pour faciliter la recherche

**Usage:**
```tsx
<CategorySelector
  categories={allCategories}
  selectedCategory={parentCategory}
  onSelect={setParentCategory}
  placeholder="Sélectionner une catégorie parent..."
/>
```

---

### 4. **CategoryBreadcrumb** (`CategoryBreadcrumb.tsx`)
Composant pour afficher le fil d'Ariane d'une catégorie.

**Props:**
- `category: Category` - La catégorie dont afficher le breadcrumb
- `baseUrl?: string` - URL de base (default: '/catalog/categories')

**Features:**
- ✅ Parse automatiquement le breadcrumb
- ✅ Liens cliquables pour chaque niveau
- ✅ Icône Home pour la racine
- ✅ Style actif pour le dernier élément

---

### 5. **CategoryDeleteDialog** (`CategoryDeleteDialog.tsx`)
Dialog de confirmation de suppression avec warnings.

**Props:**
- `category: Category | null` - La catégorie à supprimer
- `open: boolean` - État d'ouverture du dialog
- `onOpenChange: (open: boolean) => void` - Callback de changement d'état
- `onSuccess?: () => void` - Callback après suppression réussie

**Features:**
- ✅ Confirmation avant suppression
- ✅ Warning si la catégorie a des sous-catégories
- ✅ Compteur d'enfants affiché
- ✅ Toast de succès/erreur
- ✅ État de chargement pendant la suppression
- ✅ Appel API automatique

---

### 6. **CategoryForm** (`CategoryForm.tsx`)
Formulaire complet de création/édition de catégories.

**Props:**
- `open: boolean` - État d'ouverture du dialog
- `onOpenChange: (open: boolean) => void` - Callback de changement d'état
- `onSuccess?: () => void` - Callback après succès
- `category?: Category | null` - Catégorie à éditer (si mode edit)
- `allCategories: Category[]` - Liste de toutes les catégories
- `mode?: 'create' | 'edit'` - Mode du formulaire (default: 'create')

**Features:**
- ✅ Validation avec React Hook Form + Zod
- ✅ Sélection du parent avec CategorySelector (mode création)
- ✅ Upload d'image avec preview
- ✅ Auto-génération du slug et code à partir du nom
- ✅ Champs SEO (meta_title, meta_description)
- ✅ Toggle visibilité (is_public)
- ✅ Gestion des sous-catégories via breadcrumbs
- ✅ Toast de succès/erreur
- ✅ États de chargement

**Champs du formulaire:**
- `name` (requis) - Nom de la catégorie
- `code` (auto) - Code généré automatiquement
- `slug` (auto) - Slug généré automatiquement
- `description` - Description de la catégorie
- `meta_title` - Titre SEO
- `meta_description` - Description SEO
- `image` - Image de la catégorie
- `is_public` - Visibilité publique
- `ancestors_are_public` - Parents publics

**API Calls:**
- Création racine: `createCategory(data)`
- Création sous-catégorie: `createSubCategory(breadcrumbs, data)`
- Édition: `updateCategory(id, data)`

---

## 🔗 Intégration dans la Page

### Layout avec Providers
```tsx
// src/app/catalog/categories/layout.tsx
<QueryRequestProvider>
  <CategoryQueryResponseProvider>
    {children}
  </CategoryQueryResponseProvider>
</QueryRequestProvider>
```

### Page Principale
```tsx
// src/app/catalog/categories/page.tsx
const categories = useQueryResponseData();

<CategoryForm
  open={isFormOpen}
  onOpenChange={setIsFormOpen}
  allCategories={categories}
  mode="create"
/>
```

### Table avec Actions
```tsx
// components/category-table.tsx
- Vue Table avec données aplatties
- Vue Tree avec hiérarchie complète
- Actions: Modifier, Supprimer
- Recherche en temps réel
- Toggle entre vue Table et Tree
```

---

## 📦 Services API Utilisés

### `CategoryServices.ts`
- `getCategories(query)` - Liste paginée
- `getCategoryById(id)` - Détails d'une catégorie
- `createCategory(payload)` - Créer catégorie racine
- `createSubCategory(breadcrumbs, payload)` - Créer sous-catégorie
- `updateCategory(id, payload)` - Mettre à jour
- `deleteCategory(id)` - Supprimer

---

## 🎨 Composants UI Utilisés

- `Button`, `Card`, `Input`, `Badge` - Composants de base
- `Dialog`, `AlertDialog` - Modals
- `Command` - Recherche et sélection
- `Form`, `FormField` - Formulaires
- `Select`, `Textarea` - Champs de formulaire
- `Tabs` - Onglets pour vues multiples
- `DropdownMenu` - Menu d'actions

---

## 🚀 Utilisation

### Créer une catégorie racine
1. Cliquer sur "Add Category"
2. Laisser le parent vide
3. Remplir le formulaire
4. Soumettre

### Créer une sous-catégorie
1. Cliquer sur "Add Category"
2. Sélectionner un parent avec CategorySelector
3. Remplir le formulaire
4. L'API créera automatiquement le breadcrumb

### Éditer une catégorie
1. Cliquer sur "..." > "Modifier" dans la table
2. Modifier les champs souhaités
3. Soumettre

### Supprimer une catégorie
1. Cliquer sur "..." > "Supprimer"
2. Lire le warning si sous-catégories
3. Confirmer

---

## 🔥 Features Implémentées

✅ Arborescence hiérarchique illimitée
✅ Recherche en temps réel
✅ Création/Édition/Suppression
✅ Gestion des sous-catégories via breadcrumbs
✅ Validation Zod côté client
✅ Upload d'images
✅ Auto-génération slug/code
✅ SEO (meta tags)
✅ Toast notifications
✅ États de chargement
✅ Skeleton loaders
✅ Vue Table + Vue Tree
✅ Filtrage et recherche
✅ Warnings avant suppression
✅ Intégration React Query

---

## 📚 Types TypeScript

```typescript
type Category = {
  id: number;
  name: string;
  code: string;
  breadcrumbs?: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  image?: string;
  slug?: string;
  is_public?: boolean;
  ancestors_are_public?: boolean;
  children?: Category[];
};

type CreateCategory = {
  name: string;
  code?: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  image?: string;
  slug?: string;
  is_public?: boolean;
  ancestors_are_public?: boolean;
};
```

---

## 🎯 Prochaines Étapes (Optionnel)

- [ ] Drag & Drop pour réorganiser
- [ ] Édition inline dans la table
- [ ] Export/Import CSV
- [ ] Statistiques par catégorie
- [ ] Gestion des images via un service dédié
- [ ] Traductions i18n
- [ ] Historique des modifications

---

**✨ Tous les composants sont maintenant implémentés et prêts à l'emploi !**

