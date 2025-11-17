import React, { useState } from "react";
import { Text, FlatList, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaymentMethodDTO } from "@/types";
import PaymentMethodListItem from "@/components/client/list-items/payment-method-list-item";
import PaymentMethodFormSheet from "@/components/client/bottom-sheets/payment-method-form-sheet";
import ConfirmSheet from "@/components/admin/confirm-sheet";
import FAB from "@/components/admin/fab";
import TopNavigation from "@/components/top-navigation";
import { usePaymentMethods, usePaymentMethodMutations } from "@/hooks/use-payment-methods";

export default function PaymentMethods() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodDTO | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: paymentMethodsResponse, isLoading, refetch } = usePaymentMethods();
  const { deletePaymentMethod, setDefaultPaymentMethod } = usePaymentMethodMutations();

  const paymentMethods = paymentMethodsResponse?.data || [];

  const handleCreate = () => {
    setSelectedPaymentMethod(null);
    setIsFormOpen(true);
  };

  const handleEdit = (paymentMethod: PaymentMethodDTO) => {
    setSelectedPaymentMethod(paymentMethod);
    setIsFormOpen(true);
  };

  const handleSetDefault = async (paymentMethod: PaymentMethodDTO) => {
    try {
      await setDefaultPaymentMethod.mutateAsync(paymentMethod.id);
    } catch (error) {
      console.error("Error setting default payment method:", error);
    }
  };

  const handleDeletePrompt = (paymentMethod: PaymentMethodDTO) => {
    setSelectedPaymentMethod(paymentMethod);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPaymentMethod) return;
    try {
      await deletePaymentMethod.mutateAsync(selectedPaymentMethod.id);
      setIsDeleteOpen(false);
      setSelectedPaymentMethod(null);
    } catch (error) {
      console.error("Error deleting payment method:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <TopNavigation
        title="Moyens de paiement"
        description={
          <Text>
            {paymentMethods.length} moyen{paymentMethods.length !== 1 ? "s" : ""}
          </Text>
        }
        noButton={true}
      />

      {paymentMethods.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg font-fbold text-gray-900 mb-2">Aucun moyen de paiement</Text>
          <Text className="text-sm font-fregular text-gray-600 text-center">
            Ajoutez un moyen de paiement
          </Text>
        </View>
      ) : (
        <FlatList
          className="mt-12"
          data={paymentMethods}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PaymentMethodListItem
              paymentMethod={item}
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

      <PaymentMethodFormSheet
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedPaymentMethod(null);
        }}
        paymentMethod={selectedPaymentMethod || undefined}
      />

      <ConfirmSheet
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedPaymentMethod(null);
        }}
        onConfirm={confirmDelete}
        title="Supprimer le moyen de paiement"
        message={`Êtes-vous sûr de vouloir supprimer ce moyen de paiement ?`}
        confirmText="Supprimer"
        confirmVariant="danger"
        isLoading={deletePaymentMethod.isPending}
      />
    </SafeAreaView>
  );
}
