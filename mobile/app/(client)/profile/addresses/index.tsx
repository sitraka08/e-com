import React, { useState } from "react";
import { Text, FlatList, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddressDTO } from "@/types";
import AddressListItem from "@/components/client/list-items/address-list-item";
import AddressFormSheet from "@/components/client/bottom-sheets/address-form-sheet";
import ConfirmSheet from "@/components/admin/confirm-sheet";
import FAB from "@/components/admin/fab";
import TopNavigation from "@/components/top-navigation";
import { useAddresses, useAddressMutations } from "@/hooks/use-addresses";

export default function Addresses() {
  const [selectedAddress, setSelectedAddress] = useState<AddressDTO | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: addressesResponse, isLoading, refetch } = useAddresses();
  const { deleteAddress, setDefaultAddress } = useAddressMutations();

  const addresses = addressesResponse?.data || [];

  const handleCreate = () => {
    setSelectedAddress(null);
    setIsFormOpen(true);
  };

  const handleEdit = (address: AddressDTO) => {
    setSelectedAddress(address);
    setIsFormOpen(true);
  };

  const handleSetDefault = async (address: AddressDTO) => {
    try {
      await setDefaultAddress.mutateAsync(address.id);
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  const handleDeletePrompt = (address: AddressDTO) => {
    setSelectedAddress(address);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAddress) return;
    try {
      await deleteAddress.mutateAsync(selectedAddress.id);
      setIsDeleteOpen(false);
      setSelectedAddress(null);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <TopNavigation
        title="Mes adresses"
        description={
          <Text>
            {addresses.length} adresse{addresses.length !== 1 ? "s" : ""}
          </Text>
        }
        noButton={true}
      />

      {addresses.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg font-fbold text-gray-900 mb-2">Aucune adresse</Text>
          <Text className="text-sm font-fregular text-gray-600 text-center">
            Ajoutez une adresse de livraison
          </Text>
        </View>
      ) : (
        <FlatList
          className="mt-12"
          data={addresses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AddressListItem
              address={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDeletePrompt(item)}
              onSetDefault={() => handleSetDefault(item)}
            />
          )}
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        />
      )}

      <FAB onPress={handleCreate} />

      <AddressFormSheet
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedAddress(null);
        }}
        address={selectedAddress || undefined}
      />

      <ConfirmSheet
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedAddress(null);
        }}
        onConfirm={confirmDelete}
        title="Supprimer l'adresse"
        message={`Êtes-vous sûr de vouloir supprimer cette adresse ?`}
        confirmText="Supprimer"
        confirmVariant="danger"
        isLoading={deleteAddress.isPending}
      />
    </SafeAreaView>
  );
}
