import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { AddressDTO } from "@/types";
import { useAddressMutations } from "@/hooks/use-addresses";
import { COLORS } from "@/constants/colors";

interface AddressFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  address?: AddressDTO;
}

export default function AddressFormSheet({
  isOpen,
  onClose,
  address,
}: AddressFormSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [label, setLabel] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createAddress, updateAddress } = useAddressMutations();
  const isEditing = !!address;
  const isLoading = createAddress.isPending || updateAddress.isPending;

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      if (address) {
        setLabel(address.label);
        setFullName(address.fullName);
        setPhone(address.phone);
        setStreet(address.street);
        setCity(address.city);
        setRegion(address.region);
        setPostalCode(address.postalCode || "");
      } else {
        resetForm();
      }
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen, address]);

  const resetForm = () => {
    setLabel("");
    setFullName("");
    setPhone("");
    setStreet("");
    setCity("");
    setRegion("");
    setPostalCode("");
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!label.trim()) newErrors.label = "Le libellé est requis";
    if (!fullName.trim()) newErrors.fullName = "Le nom complet est requis";
    if (!phone.trim()) newErrors.phone = "Le téléphone est requis";
    if (!street.trim()) newErrors.street = "La rue est requise";
    if (!city.trim()) newErrors.city = "La ville est requise";
    if (!region.trim()) newErrors.region = "La région est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const data = {
        label: label.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        region: region.trim(),
        postalCode: postalCode.trim() || null,
      };

      if (isEditing && address) {
        await updateAddress.mutateAsync({ id: address.id, data });
      } else {
        await createAddress.mutateAsync(data as any);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["90%"]}
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
      >
        <Text className="text-xl font-fbold text-primary mb-4">
          {isEditing ? "Modifier l'adresse" : "Nouvelle adresse"}
        </Text>

        <View className="mb-4">
          <Text className="text-sm font-fmedium text-gray-700 mb-2">Libellé *</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="Ex: Maison, Bureau"
            className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
          />
          {errors.label && (
            <Text className="text-red-500 text-xs mt-1">{errors.label}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-fmedium text-gray-700 mb-2">Nom complet *</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nom du destinataire"
            className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
          />
          {errors.fullName && (
            <Text className="text-red-500 text-xs mt-1">{errors.fullName}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-fmedium text-gray-700 mb-2">Téléphone *</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="034 00 000 00"
            keyboardType="phone-pad"
            className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
          />
          {errors.phone && (
            <Text className="text-red-500 text-xs mt-1">{errors.phone}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-fmedium text-gray-700 mb-2">Rue *</Text>
          <TextInput
            value={street}
            onChangeText={setStreet}
            placeholder="Adresse complète"
            className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
          />
          {errors.street && (
            <Text className="text-red-500 text-xs mt-1">{errors.street}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-fmedium text-gray-700 mb-2">Ville *</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Ex: Antananarivo"
            className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
          />
          {errors.city && (
            <Text className="text-red-500 text-xs mt-1">{errors.city}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-fmedium text-gray-700 mb-2">Région *</Text>
          <TextInput
            value={region}
            onChangeText={setRegion}
            placeholder="Ex: Analamanga"
            className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
          />
          {errors.region && (
            <Text className="text-red-500 text-xs mt-1">{errors.region}</Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="text-sm font-fmedium text-gray-700 mb-2">Code postal</Text>
          <TextInput
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="101 (optionnel)"
            keyboardType="numeric"
            className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
          />
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 bg-gray-100 rounded-lg p-4"
            disabled={isLoading}
          >
            <Text className="text-gray-700 font-fbold text-center">Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 bg-primary rounded-lg p-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-fbold text-center">
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
