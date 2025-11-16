import { Tabs, useRouter } from "expo-router";
import CustomTabBar from "@/components/custom-tabbar";
import {
  SELLER_TABS,
  SELLER_REMOVE_IN_TABS,
  SELLER_HIDDEN_TABBAR_ROUTES,
} from "@/config/tab-configs";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { View, Text } from "react-native";

function SellerGuard({ children }: { children: React.ReactNode }) {
  const { user, sellerRequest, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Si l'utilisateur n'est pas connecté, rediriger vers login
    if (!user) {
      router.replace("/login");
      return;
    }

    // Si l'utilisateur a une demande vendeur en attente, rediriger vers pending-approval
    if (sellerRequest?.status === "PENDING") {
      router.replace("/(seller)/pending-approval");
      return;
    }

    // Si l'utilisateur n'est pas vendeur, rediriger vers login
    if (user.role !== "SELLER") {
      router.replace("/login");
      return;
    }
  }, [user, sellerRequest, isLoading, router]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-fbold">Chargement...</Text>
      </View>
    );
  }

  // Permettre l'accès à pending-approval même si le rôle n'est pas SELLER
  if (sellerRequest?.status === "PENDING") {
    return <>{children}</>;
  }

  if (user?.role !== "SELLER") {
    return null;
  }

  return <>{children}</>;
}

export default function SellerLayout() {
  return (
    <SellerGuard>
      <Tabs
        tabBar={(props) => (
          <CustomTabBar
            {...props}
            tabs={SELLER_TABS}
            removeInTabs={SELLER_REMOVE_IN_TABS}
            hiddenTabBarRoutes={[...SELLER_HIDDEN_TABBAR_ROUTES, "pending-approval"]}
          />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="pending-approval" />
        <Tabs.Screen name="dashboard/index" />
        <Tabs.Screen name="products/index" />
        <Tabs.Screen name="orders/index" />
        <Tabs.Screen name="profile/index" />
      </Tabs>
    </SellerGuard>
  );
}
