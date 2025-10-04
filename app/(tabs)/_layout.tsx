import { Tabs } from "expo-router";
import CustomTabBar from "@/components/custom-tabbar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home/index" />
      <Tabs.Screen name="search/index" />
      <Tabs.Screen name="cart/index" />
      <Tabs.Screen name="command/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
}
