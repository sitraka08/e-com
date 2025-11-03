import { Tabs, useRouter } from "expo-router";
import CustomTabBar from "@/components/custom-tabbar";
import {
  ADMIN_TABS,
  ADMIN_REMOVE_IN_TABS,
  ADMIN_HIDDEN_TABBAR_ROUTES,
} from "@/config/tab-configs";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { View, Text } from "react-native";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-fbold">Chargement...</Text>
      </View>
    );
  }

  if (user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}

export default function AdminLayout() {
  return (
    <AdminGuard>
      <Tabs
        tabBar={(props) => (
          <CustomTabBar
            {...props}
            tabs={ADMIN_TABS}
            removeInTabs={ADMIN_REMOVE_IN_TABS}
            hiddenTabBarRoutes={ADMIN_HIDDEN_TABBAR_ROUTES}
          />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="dashboard/index" />
        <Tabs.Screen name="products/index" />
        <Tabs.Screen name="categories/index" />
        <Tabs.Screen name="users/index" />
        <Tabs.Screen name="orders/index" />
      </Tabs>
    </AdminGuard>
  );
}
