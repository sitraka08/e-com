import { SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import TopNavigation from "@/components/top-navigation";
import PayementMethodCard from "@/components/payement-method-card";
import DividerDashed from "@/components/divider-dashed";
import Button from "@/components/button/button";
import { BanknoteArrowUp, HandCoins, Landmark } from "lucide-react-native";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Payement() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [payementMethod, setPayementMethod] = useState<
    "MOBILE" | "CARD" | "MONEY"
  >("MONEY");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirection vers login si non authentifié
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-fbold">Chargement...</Text>
      </SafeAreaView>
    );
  }

  // Ne rien afficher si non authentifié (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView className="">
      <TopNavigation
        title="Paiement"
        description="Sélectionne le mode de paiement pour finaliser ta commande."
      />
      <View className="mt-28 px-5">
        <Text className="text-base font-fsemibold mb-4">Mode de paiement</Text>
        <ScrollView
          className="h-full"
          contentContainerStyle={{
            paddingBottom: 180,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex gap-3">
            <PayementMethodCard
              label="Espèces"
              description="Paiement à la livraison"
              checked={payementMethod === "MONEY"}
              onPress={() => setPayementMethod("MONEY")}
              noInput
              icon={HandCoins}
            />
            <PayementMethodCard
              label="Mobile Money"
              description="MVola"
              checked={payementMethod === "MOBILE"}
              onPress={() => setPayementMethod("MOBILE")}
              icon={BanknoteArrowUp}
            />
            <PayementMethodCard
              label="Carte bancaire"
              description="Visa, Mastercard"
              checked={payementMethod === "CARD"}
              onPress={() => setPayementMethod("CARD")}
              icon={Landmark}
            />
          </View>
          <View className="bg-[#fff] w-full  p-5 rounded-xl border-2 border-primary mt-5">
            <View className="flex flex-row justify-between">
              <Text className="font-fmedium ">Sous-total</Text>
              <Text className="font-fbold ">2000 Ar</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="font-fmedium ">Livraison</Text>
              <Text className="font-fbold ">3000 Ar</Text>
            </View>
            <DividerDashed className="!border-[#000]" />
            <View className="flex flex-row justify-between">
              <Text className="font-fbold  text-xl">Total</Text>
              <Text className="font-fbold  text-xl">2000 Ar</Text>
            </View>
            <Button
              className="mt-8"
              label="Confirmer la commande"
              // loading
              // onPress={() => router.push("/(tabs)/cart/payement")}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
