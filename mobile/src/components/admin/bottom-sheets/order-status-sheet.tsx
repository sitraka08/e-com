import React, { useEffect, useRef } from "react";
import { View, Text } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/button/button";
import InputSelect from "@/components/input-select";
import {
  OrderDTO,
  UpdateOrderStatusDTO,
  UpdateOrderStatusSchema,
} from "@/types";
import { useOrderMutations } from "@/hooks/use-orders";

interface OrderStatusSheetProps {
  isPending?: boolean;
  isOpen: boolean;
  onClose: () => void;
  order?: OrderDTO;
  role?: "ADMIN" | "SELLER";
  onUpdate?: (orderId: number, data: UpdateOrderStatusDTO) => Promise<void>;
}

export default function OrderStatusSheet({
  isOpen,
  onClose,
  order,
  role = "ADMIN",
  onUpdate,
  isPending,
}: OrderStatusSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { updateOrderStatus: adminUpdateOrderStatus } = useOrderMutations();

  const form = useForm<UpdateOrderStatusDTO>({
    resolver: zodResolver(UpdateOrderStatusSchema),
    defaultValues: {
      status: order?.status || "PENDING",
    },
  });

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      if (order) {
        form.reset({ status: order.status });
      }
    } else {
      bottomSheetRef.current?.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, order]);

  const onSubmit = async (data: UpdateOrderStatusDTO) => {
    if (!order) return;
    try {
      if (onUpdate) {
        await onUpdate(order.id, data);
      } else {
        await adminUpdateOrderStatus.mutateAsync({ id: order.id, data });
      }
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const allStatusOptions = [
    { label: "En attente", value: "PENDING" },
    { label: "Confirmée", value: "CONFIRMED" },
    { label: "En traitement", value: "PROCESSING" },
    { label: "Expédiée", value: "SHIPPED" },
    { label: "Livrée", value: "DELIVERED" },
    { label: "Annulée", value: "CANCELLED" },
  ];

  const sellerStatusOptions = [
    { label: "Confirmée", value: "CONFIRMED" },
    { label: "En traitement", value: "PROCESSING" },
    { label: "Expédiée", value: "SHIPPED" },
    { label: "Livrée", value: "DELIVERED" },
  ];

  const statusOptions =
    role === "SELLER" ? sellerStatusOptions : allStatusOptions;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["40%"]}
      enablePanDownToClose
      onClose={onClose}
      index={-1}
      backgroundStyle={{
        backgroundColor: "#edf4fc",
        borderWidth: 1,
        borderColor: "#0174D8",
      }}
    >
      <BottomSheetView
        className="flex-1 px-5 gap-2"
        style={{ paddingBottom: 100 }}
      >
        <Text className="text-xl font-fbold text-primary mb-3">
          Changer le statut
        </Text>
        {order && (
          <Text className="text-sm font-fregular text-gray-600 mb-5">
            Commande #{order.orderNumber}
          </Text>
        )}

        <View className="flex gap-4">
          <InputSelect
            form={form}
            name="status"
            label="Nouveau statut"
            options={statusOptions}
            placeholder="Sélectionner un statut"
            isAdmin
          />
        </View>

        <View className="mb-4">
          <Button
            label="Mettre à jour"
            onPress={form.handleSubmit(onSubmit)}
            loading={adminUpdateOrderStatus.isPending || isPending}
            className="!bg-primary w-full h-14"
            textClassName="!text-white"
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
