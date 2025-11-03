import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/button/button';
import Input from '@/components/input';
import InputSelect from '@/components/input-select';
import { ProductDTO, UpdateStockDTO, UpdateStockSchema } from '@/types';
import { useProductMutations } from '@/hooks/use-products';

interface ProductStockSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductDTO;
}

export default function ProductStockSheet({
  isOpen,
  onClose,
  product,
}: ProductStockSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { updateStock } = useProductMutations();

  const form = useForm<UpdateStockDTO>({
    resolver: zodResolver(UpdateStockSchema),
    defaultValues: {
      quantity: 0,
      operation: 'add',
    },
  });

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const onSubmit = async (data: UpdateStockDTO) => {
    if (!product) return;
    try {
      await updateStock.mutateAsync({ id: product.id, data });
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const operationOptions = [
    { label: 'Ajouter', value: 'add' },
    { label: 'Retirer', value: 'subtract' },
    { label: 'Définir', value: 'set' },
  ];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['50%']}
      enablePanDownToClose
      onClose={onClose}
      index={-1}
      backgroundStyle={{ backgroundColor: '#fff' }}
    >
      <BottomSheetView className="flex-1 px-5">
        <Text className="text-2xl font-fbold text-gray-900 mb-3">
          Mise à jour du stock
        </Text>
        {product && (
          <Text className="text-sm font-fregular text-gray-600 mb-5">
            {product.name} - Stock actuel: {product.stock}
          </Text>
        )}

        <InputSelect
          form={form}
          name="operation"
          label="Opération"
          options={operationOptions}
          placeholder="Sélectionner une opération"
        />

        <Input
          form={form}
          name="quantity"
          label="Quantité"
          placeholder="0"
          className="mt-3"
        />

        <View className="mt-6">
          <Button
            label="Mettre à jour le stock"
            onPress={form.handleSubmit(onSubmit)}
            loading={updateStock.isPending}
            className="!bg-primary w-full h-14"
            textClassName="!text-white"
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
