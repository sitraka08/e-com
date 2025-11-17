import React, { useEffect, useRef } from "react";
import { View, Text } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressDTO, CreateAddressDTO, CreateAddressSchema } from "@/types";
import { useAddressMutations } from "@/hooks/use-addresses";
import { COLORS } from "@/constants/colors";
import { Button } from "../../button";
import Input from "../../input";

interface AddressFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  address?: AddressDTO;
  onAddressCreated?: (address: AddressDTO) => void;
}

export default function AddressFormSheet({
  isOpen,
  onClose,
  address,
  onAddressCreated,
}: AddressFormSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { createAddress, updateAddress } = useAddressMutations();
  const isEditing = !!address;
  const isLoading = createAddress.isPending || updateAddress.isPending;

  const form = useForm({
    resolver: zodResolver(CreateAddressSchema),
    defaultValues: {
      label: "",
      fullName: "",
      phone: "",
      street: "",
      city: "",
      region: "",
      postalCode: "",
      isDefault: false,
    },
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      if (address) {
        reset({
          label: address.label,
          fullName: address.fullName,
          phone: address.phone,
          street: address.street,
          city: address.city,
          region: address.region,
          postalCode: address.postalCode || "",
          isDefault: address.isDefault,
        });
      } else {
        reset();
      }
    } else {
      bottomSheetRef.current?.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, address]);

  const onSubmit = async (data: CreateAddressDTO) => {
    try {
      if (isEditing && address) {
        await updateAddress.mutateAsync({ id: address.id, data });
      } else {
        const response = await createAddress.mutateAsync(data);
        if (onAddressCreated && response.data) {
          onAddressCreated(response.data);
        }
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
    }
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
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={true}
      >
        <Text className="text-xl font-fbold text-primary mb-4">
          {isEditing ? "Modifier l'adresse" : "Nouvelle adresse"}
        </Text>

        <Input
          form={form}
          name="label"
          label="Libellé *"
          placeholder="Ex: Maison, Bureau"
          variant="sheet"
        />

        <Input
          form={form}
          name="fullName"
          label="Nom complet *"
          placeholder="Nom du destinataire"
          variant="sheet"
        />

        <Input
          form={form}
          name="phone"
          label="Téléphone *"
          placeholder="034 00 000 00"
          keyboardType="phone-pad"
          variant="sheet"
        />

        <Input
          form={form}
          name="street"
          label="Rue *"
          placeholder="Adresse complète"
          variant="sheet"
        />

        <Input
          form={form}
          name="city"
          label="Ville *"
          placeholder="Ex: Antananarivo"
          variant="sheet"
        />

        <Input
          form={form}
          name="region"
          label="Région *"
          placeholder="Ex: Analamanga"
          variant="sheet"
        />

        <Input
          form={form}
          name="postalCode"
          label="Code postal"
          placeholder="101 (optionnel)"
          keyboardType="numeric"
          variant="sheet"
        />

        <View className="mt-2" />

        <View className="flex-row gap-3">
          <Button
            label="Annuler"
            onPress={onClose}
            variant="ghost"
            disabled={isLoading}
            className="flex-1"
          />

          <Button
            label={isEditing ? "Mettre à jour" : "Ajouter"}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            loading={isLoading}
            className="flex-1"
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
