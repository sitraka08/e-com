import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { AddressDTO } from "@/types";
import { useAddresses } from "@/hooks/use-addresses";
import { MapPin, Plus } from "lucide-react-native";
import { COLORS } from "@/constants/colors";
import RadioButton from "../../button/radio-button";
import { Button } from "../../button";

interface AddressSelectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: AddressDTO) => void;
  selectedAddressId?: number;
  onAddNew: () => void;
}

export default function AddressSelectSheet({
  isOpen,
  onClose,
  onSelectAddress,
  selectedAddressId,
  onAddNew,
}: AddressSelectSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { data, isLoading } = useAddresses();

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const addresses = data?.data || [];

  // Trier pour avoir l'adresse par défaut en premier
  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return 0;
  });

  const handleSelectAddress = (address: AddressDTO) => {
    onSelectAddress(address);
    onClose();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["70%"]}
      enablePanDownToClose
      onClose={onClose}
      index={-1}
      backgroundStyle={{
        backgroundColor: "#edf4fc",
        borderWidth: 1,
        borderColor: COLORS.primary,
      }}
    >
      <BottomSheetScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={true}
      >
        <Text className="text-2xl font-fbold text-gray-900 mb-1">
          Sélectionner une adresse
        </Text>
        <Text className="text-sm font-fregular text-gray-600 mb-5">
          Choisissez l'adresse de livraison pour votre commande
        </Text>

        {isLoading ? (
          <View className="py-10 items-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : addresses.length === 0 ? (
          <View className="py-10 items-center">
            <MapPin size={48} color="#9CA3AF" />
            <Text className="text-center text-gray-600 font-fmedium mt-4">
              Aucune adresse enregistrée
            </Text>
            <Text className="text-center text-gray-500 font-fregular text-sm mt-2">
              Ajoutez une adresse de livraison pour continuer
            </Text>
          </View>
        ) : (
          sortedAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              onPress={() => handleSelectAddress(address)}
              className={`bg-white rounded-xl p-4 mb-3 border-2 ${
                selectedAddressId === address.id
                  ? "border-primary"
                  : "border-gray-200"
              }`}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Text className="text-base font-fbold text-gray-900">
                      {address.label}
                    </Text>
                    {address.isDefault && (
                      <View className="bg-primary/10 px-2 py-1 rounded">
                        <Text className="text-primary text-xs font-fmedium">
                          Par défaut
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text className="text-sm font-fmedium text-gray-700">
                    {address.fullName}
                  </Text>
                  <Text className="text-sm font-fregular text-gray-600 mt-1">
                    {address.phone}
                  </Text>

                  <View className="flex-row items-start gap-2 mt-2">
                    <MapPin size={14} color="#9CA3AF" className="mt-1" />
                    <Text className="flex-1 text-sm font-fregular text-gray-600">
                      {address.street}, {address.city}, {address.region}
                      {address.postalCode && ` ${address.postalCode}`}
                    </Text>
                  </View>
                </View>

                <RadioButton
                  selected={selectedAddressId === address.id}
                  onPress={() => handleSelectAddress(address)}
                />
              </View>
            </TouchableOpacity>
          ))
        )}

        <Button
          label="Ajouter une nouvelle adresse"
          variant="outline"
          iconLeft={<Plus size={20} color={COLORS.primary} />}
          onPress={onAddNew}
          fullWidth
          className="mt-2"
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
