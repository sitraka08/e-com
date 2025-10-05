import { SafeAreaView } from "react-native";
import React from "react";
import TopNavigation from "@/components/top-navigation";

export default function Payement() {
  return (
    <SafeAreaView className="">
      <TopNavigation
        title="Paiement"
        description="Sélectionne le mode de paiement pour finaliser ta commande."
      />
    </SafeAreaView>
  );
}
