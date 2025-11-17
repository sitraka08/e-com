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
import PendingApprovalComponent from "@/components/seller/pending-approval-component";

function SellerGuard({ children }: { children: React.ReactNode }) {
  const { user, seller, isLoading } = useAuthStore();
  const router = useRouter();

  console.log(seller, "seller");

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "SELLER") {
      router.replace("/login");
      return;
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-fbold">Chargement...</Text>
      </View>
    );
  }

  if (user?.role !== "SELLER") {
    return null;
  }

  if (seller && !seller.isApproved) {
    return <PendingApprovalComponent />;
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
            hiddenTabBarRoutes={SELLER_HIDDEN_TABBAR_ROUTES}
          />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="dashboard/index" />
        <Tabs.Screen name="products/index" />
        <Tabs.Screen name="orders/index" />
        <Tabs.Screen name="profile/index" />
      </Tabs>
    </SellerGuard>
  );
}
