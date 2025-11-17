import { Tabs } from "expo-router";
import CustomTabBar from "@/components/custom-tabbar";
import {
  CLIENT_TABS,
  CLIENT_REMOVE_IN_TABS,
  CLIENT_HIDDEN_TABBAR_ROUTES,
} from "@/config/tab-configs";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          tabs={CLIENT_TABS}
          removeInTabs={CLIENT_REMOVE_IN_TABS}
          hiddenTabBarRoutes={CLIENT_HIDDEN_TABBAR_ROUTES}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home/index" />
      <Tabs.Screen name="search/index" />
      <Tabs.Screen name="cart/index" />
      <Tabs.Screen name="command/index" />
      <Tabs.Screen name="favorites/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
}
