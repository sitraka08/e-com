import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  House,
  CircleUser,
  Search,
  ShoppingBag,
  ScrollText,
} from "lucide-react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { removeTabsByNames } from "utils/utils";

const TABS = [
  { label: "Accueil", icon: House },
  { label: "Recherche", icon: Search },
  { label: "Panier", icon: ShoppingBag },
  { label: "Commande", icon: ScrollText },
  { label: "Profil", icon: CircleUser },
];

const removeInTabs = ["cart/payement/index", "home/[id]"];

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const STATE = removeTabsByNames(state.routes, removeInTabs);

  return (
    <View
      className="flex-row bg-[#fff] h-20 justify-around mx-3 items-center  border p-4 border-[#0000000e] rounded-2xl mb-12 "
      style={styles.shadow}
    >
      {STATE.map((route, index) => {
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
                className={`text-xs font-fregular ${isFocused && "text-[#fff]"}`}
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

const styles = StyleSheet.create({
  shadow: {
    // shadowColor: "#677DE8",
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.36,
    // shadowRadius: 6.68,
    // elevation: 11,
  },
});
