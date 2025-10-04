import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import {
  House,
  CircleUser,
  Search,
  ShoppingBag,
  ScrollText,
} from "lucide-react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TABS = [
  { label: "Accueil", icon: House },
  { label: "Recherche", icon: Search },
  { label: "Panier", icon: ShoppingBag },
  { label: "Commande", icon: ScrollText },
  { label: "Profil", icon: CircleUser },
];

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View className="flex-row bg-[#fff] h-24 justify-around mx-3 items-center border p-4 border-[#fff] rounded-2xl mb-12">
      {state.routes.map((route, index) => {
        const label = TABS[index]?.label ?? route.name;
        const Icon = TABS[index]?.icon ?? House;
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => {
              if (!isFocused) {
                navigation.navigate(route.name);
              }
            }}
            className={`flex-1 items-center justify-center h-full ${isFocused ? "bg-primary rounded-xl" : ""}`}
          >
            <View className={`"flex items-center gap-2"`}>
              <Icon size={20} color={isFocused ? "#fff" : "#000"} />
              <Text
                className={`text-xs font-fsemibold ${isFocused && "text-[#fff]"}`}
              >
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
