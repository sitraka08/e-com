import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/button/button';
import InputSelect from '@/components/input-select';
import { OrderDTO, UpdateOrderStatusDTO, UpdateOrderStatusSchema } from '@/types';
import { useOrderMutations } from '@/hooks/use-orders';

interface OrderStatusSheetProps {
  isOpen: boolean;
  onClose: () => void;
  order?: OrderDTO;
}

export default function OrderStatusSheet({
  isOpen,
  onClose,
  order,
}: OrderStatusSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { updateOrderStatus } = useOrderMutations();

  const form = useForm<UpdateOrderStatusDTO>({
    resolver: zodResolver(UpdateOrderStatusSchema),
    defaultValues: {
      status: order?.status || 'PENDING',
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
      await updateOrderStatus.mutateAsync({ id: order.id, data });
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const statusOptions = [
    { label: 'En attente', value: 'PENDING' },
    { label: 'Confirmée', value: 'CONFIRMED' },
    { label: 'Expédiée', value: 'SHIPPED' },
    { label: 'Livrée', value: 'DELIVERED' },
    { label: 'Annulée', value: 'CANCELLED' },
  ];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['40%']}
      enablePanDownToClose
      onClose={onClose}
      index={-1}
      backgroundStyle={{ backgroundColor: '#fff' }}
    >
      <BottomSheetView className="flex-1 px-5">
        <Text className="text-2xl font-fbold text-gray-900 mb-3">
          Changer le statut
        </Text>
        {order && (
          <Text className="text-sm font-fregular text-gray-600 mb-5">
            Commande #{order.orderNumber}
          </Text>
        )}

        <InputSelect
          form={form}
          name="status"
          label="Nouveau statut"
          options={statusOptions}
          placeholder="Sélectionner un statut"
        />

        <View className="mt-6">
          <Button
            label="Mettre à jour"
            onPress={form.handleSubmit(onSubmit)}
            loading={updateOrderStatus.isPending}
            className="!bg-primary w-full h-14"
            textClassName="!text-white"
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
