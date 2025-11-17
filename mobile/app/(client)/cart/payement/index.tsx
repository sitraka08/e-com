import { ScrollView, Text, View, Alert, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import TopNavigation from "@/components/top-navigation";
import PayementMethodCard from "@/components/payement-method-card";
import DividerDashed from "@/components/divider-dashed";
import Button from "@/components/button/button";
import {
  BanknoteArrowUp,
  HandCoins,
  Landmark,
  MapPin,
  ChevronRight,
} from "lucide-react-native";
import { useAuthStore } from "@/stores/useAuthStore";
import useCartStore, { DELIVERY_FEE } from "@/stores/useCartStore";
import { useOrderMutations } from "@/hooks/use-orders";
import { useDefaultAddress } from "@/hooks/use-addresses";
import { CreateOrderDTO, AddressDTO } from "@/types";
import AddressSelectSheet from "@/components/client/bottom-sheets/address-select-sheet";
import AddressFormSheet from "@/components/client/bottom-sheets/address-form-sheet";
import { COLORS } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Payement() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const { cart, getTotal, getTotalPayd, clearCart } = useCartStore();
  const { createOrder } = useOrderMutations();
  const { data: defaultAddressData, isLoading: isLoadingAddress } =
    useDefaultAddress();

  const [payementMethod, setPayementMethod] = useState<
    "MOBILE" | "CARD" | "MONEY"
  >("MONEY");
  const [selectedAddress, setSelectedAddress] = useState<AddressDTO | null>(
    null
  );
  const [isAddressSelectOpen, setIsAddressSelectOpen] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);

  const subtotal = getTotal();
  const total = getTotalPayd();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirection vers login si non authentifié
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Auto-sélectionner l'adresse par défaut
  useEffect(() => {
    if (defaultAddressData?.data && !selectedAddress) {
      setSelectedAddress(defaultAddressData.data);
    }
  }, [defaultAddressData, selectedAddress]);

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      Alert.alert(
        "Panier vide",
        "Votre panier est vide. Ajoutez des produits avant de commander."
      );
      return;
    }

    if (!selectedAddress) {
      Alert.alert(
        "Adresse manquante",
        "Veuillez sélectionner une adresse de livraison avant de continuer.",
        [
          {
            text: "Ajouter une adresse",
            onPress: () => setIsAddressFormOpen(true),
          },
          { text: "Annuler", style: "cancel" },
        ]
      );
      return;
    }

    try {
      const orderData: CreateOrderDTO = {
        addressId: selectedAddress.id,
        deliveryFee: DELIVERY_FEE,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        paymentDetails:
          payementMethod === "MONEY"
            ? []
            : [
                {
                  paymentMethodId: 1,
                  amount: total,
                  transactionId: `TXN-${Date.now()}`,
                },
              ],
      };

      await createOrder.mutateAsync(orderData);

      clearCart();

      Alert.alert(
        "Commande confirmée",
        "Votre commande a été enregistrée avec succès !",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(client)/command"),
          },
        ]
      );
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création de votre commande.";
      Alert.alert("Erreur", errorMessage);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-fbold">Chargement...</Text>
      </SafeAreaView>
    );
  }

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
        {/* Section Adresse de livraison */}
        <Text className="text-base font-fsemibold mb-4">
          Adresse de livraison
        </Text>
        {isLoadingAddress ? (
          <View className="bg-white rounded-xl p-4 mb-5 border border-gray-200">
            <Text className="text-gray-500 font-fregular">Chargement...</Text>
          </View>
        ) : selectedAddress ? (
          <TouchableOpacity
            onPress={() => setIsAddressSelectOpen(true)}
            className="bg-white rounded-xl p-4 mb-5 border-2 border-primary"
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <MapPin size={20} color={COLORS.primary} />
                <Text className="text-base font-fbold text-gray-900">
                  {selectedAddress.label}
                </Text>
                {selectedAddress.isDefault && (
                  <View className="bg-primary/10 px-2 py-1 rounded">
                    <Text className="text-primary text-xs font-fmedium">
                      Par défaut
                    </Text>
                  </View>
                )}
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
            <Text className="text-sm font-fmedium text-gray-700">
              {selectedAddress.fullName}
            </Text>
            <Text className="text-sm font-fregular text-gray-600 mt-1">
              {selectedAddress.street}, {selectedAddress.city},{" "}
              {selectedAddress.region}
            </Text>
            <Text className="text-xs font-fmedium text-primary mt-2">
              Appuyez pour modifier
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setIsAddressFormOpen(true)}
            className="bg-gray-50 rounded-xl p-4 mb-5 border-2 border-dashed border-gray-300"
          >
            <View className="flex-row items-center gap-2">
              <MapPin size={20} color="#9CA3AF" />
              <Text className="text-base font-fmedium text-gray-700">
                Ajouter une adresse de livraison
              </Text>
            </View>
            <Text className="text-xs font-fregular text-gray-500 mt-2">
              Aucune adresse sélectionnée. Ajoutez-en une pour continuer.
            </Text>
          </TouchableOpacity>
        )}

        <Text className="text-base font-fsemibold mb-4">Mode de paiement</Text>
        <ScrollView
          className="h-full"
          contentContainerStyle={{
            paddingBottom: 600,
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
              <Text className="font-fbold ">
                {subtotal.toLocaleString()} Ar
              </Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="font-fmedium ">Livraison</Text>
              <Text className="font-fbold ">
                {DELIVERY_FEE.toLocaleString()} Ar
              </Text>
            </View>
            <DividerDashed className="!border-[#000]" />
            <View className="flex flex-row justify-between">
              <Text className="font-fbold  text-xl">Total</Text>
              <Text className="font-fbold  text-xl">
                {total.toLocaleString()} Ar
              </Text>
            </View>
            <Button
              className="mt-8"
              label="Confirmer la commande"
              loading={createOrder.isPending}
              onPress={handleConfirmOrder}
            />
          </View>
        </ScrollView>
      </View>

      {/* Bottom sheets */}
      <AddressSelectSheet
        isOpen={isAddressSelectOpen}
        onClose={() => setIsAddressSelectOpen(false)}
        onSelectAddress={(address) => setSelectedAddress(address)}
        selectedAddressId={selectedAddress?.id}
        onAddNew={() => {
          setIsAddressSelectOpen(false);
          setIsAddressFormOpen(true);
        }}
      />

      <AddressFormSheet
        isOpen={isAddressFormOpen}
        onClose={() => setIsAddressFormOpen(false)}
        onAddressCreated={(newAddress) => {
          setSelectedAddress(newAddress);
        }}
      />
    </SafeAreaView>
  );
}
