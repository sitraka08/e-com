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
  Heart,
} from "lucide-react-native";

export interface TabConfig {
  label: string;
  icon: LucideIcon;
}

export const CLIENT_TABS: TabConfig[] = [
  { label: "Accueil", icon: House },
  { label: "Recherche", icon: Search },
  { label: "Panier", icon: ShoppingBag },
  { label: "Commande", icon: ScrollText },
  { label: "Favoris", icon: Heart },
  { label: "Profil", icon: CircleUser },
];

export const SELLER_TABS: TabConfig[] = [
  { label: "Dashboard", icon: BarChart3 },
  { label: "Produits", icon: Package },
  { label: "Commandes", icon: ClipboardList },
  { label: "Profil", icon: CircleUser },
];

export const ADMIN_TABS: TabConfig[] = [
  { label: "Dashboard", icon: BarChart3 },
  { label: "Catégories", icon: FolderOpen },
  { label: "Produits", icon: Package },
  { label: "Utilisateurs", icon: Users },
  { label: "Commandes", icon: ClipboardList },
  { label: "Profil", icon: CircleUser },
];

export const CLIENT_REMOVE_IN_TABS = [
  "cart/payement/index",
  "profile/login/index",
  "profile/register/index",
  "profile/forgot-password/index",
  "profile/addresses/index",
  "profile/payment-methods/index",
  "profile/change-password/index",
  "home/[id]",
  "cart/saved/index",
];

export const CLIENT_HIDDEN_TABBAR_ROUTES = [
  "profile/login/index",
  "profile/register/index",
  "profile/forgot-password/index",
];

export const SELLER_REMOVE_IN_TABS: string[] = [];
export const SELLER_HIDDEN_TABBAR_ROUTES: string[] = [];

export const ADMIN_REMOVE_IN_TABS: string[] = [];
export const ADMIN_HIDDEN_TABBAR_ROUTES: string[] = [];
