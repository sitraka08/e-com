import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#bfb9b9",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabelStyle: {
            fontFamily: "SpaceMono",
            color: "#bfb9b9",
            fontSize: 12,
          },
        }}
      />
    </Tabs>
  );
}
