import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavigation from "@/components/top-navigation";

export default function Command() {
  return (
    <SafeAreaView className="">
      <TopNavigation
        title="Mes Commandes"
        description="Retrouve la liste de tes commandes"
      />
    </SafeAreaView>
  );
}
