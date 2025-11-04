import { CategoryDTO } from "@/types";

/**
 * Catégories statiques de produits
 * Ces catégories sont fixes et ne peuvent pas être modifiées via l'interface admin
 */
export const STATIC_CATEGORIES: CategoryDTO[] = [
  {
    id: 1,
    name: "Électronique",
    slug: "electronique",
    description: "Smartphones, ordinateurs, tablettes et accessoires électroniques",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Mode",
    slug: "mode",
    description: "Vêtements, chaussures et accessoires de mode",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Maison & Jardin",
    slug: "maison-jardin",
    description: "Meubles, décoration et équipements pour la maison",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Sports & Loisirs",
    slug: "sports-loisirs",
    description: "Équipements sportifs, jeux et loisirs",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Beauté & Santé",
    slug: "beaute-sante",
    description: "Produits de beauté, cosmétiques et bien-être",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Alimentation",
    slug: "alimentation",
    description: "Produits alimentaires et boissons",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    name: "Livres & Média",
    slug: "livres-media",
    description: "Livres, films, musique et jeux vidéo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 8,
    name: "Jouets & Enfants",
    slug: "jouets-enfants",
    description: "Jouets, jeux et articles pour enfants",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Obtenir toutes les catégories
 */
export const getCategories = (): CategoryDTO[] => {
  return STATIC_CATEGORIES;
};

/**
 * Obtenir une catégorie par ID
 */
export const getCategoryById = (id: number): CategoryDTO | undefined => {
  return STATIC_CATEGORIES.find((cat) => cat.id === id);
};

/**
 * Obtenir une catégorie par slug
 */
export const getCategoryBySlug = (slug: string): CategoryDTO | undefined => {
  return STATIC_CATEGORIES.find((cat) => cat.slug === slug);
};

/**
 * Options pour les sélecteurs de catégories
 */
export const getCategoryOptions = () => {
  return STATIC_CATEGORIES.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));
};
