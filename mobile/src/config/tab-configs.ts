import {
  House,
  CircleUser,
  Search,
  ShoppingBag,
  ScrollText,
  BarChart3,
  Package,
  FolderOpen,
  Users,
  ClipboardList,
  LucideIcon,
} from 'lucide-react-native';

export interface TabConfig {
  label: string;
  icon: LucideIcon;
}

export const CLIENT_TABS: TabConfig[] = [
  { label: 'Accueil', icon: House },
  { label: 'Recherche', icon: Search },
  { label: 'Panier', icon: ShoppingBag },
  { label: 'Commande', icon: ScrollText },
  { label: 'Profil', icon: CircleUser },
];

export const ADMIN_TABS: TabConfig[] = [
  { label: 'Tableau de bord', icon: BarChart3 },
  { label: 'Produits', icon: Package },
  { label: 'Catégories', icon: FolderOpen },
  { label: 'Utilisateurs', icon: Users },
  { label: 'Commandes', icon: ClipboardList },
];

export const CLIENT_REMOVE_IN_TABS = [
  'cart/payement/index',
  'profile/login/index',
  'profile/register/index',
  'profile/forgot-password/index',
  'home/[id]',
];

export const CLIENT_HIDDEN_TABBAR_ROUTES = [
  'profile/login/index',
  'profile/index',
  'profile/register/index',
  'profile/forgot-password/index',
];

export const ADMIN_REMOVE_IN_TABS: string[] = [];

export const ADMIN_HIDDEN_TABBAR_ROUTES: string[] = [];
