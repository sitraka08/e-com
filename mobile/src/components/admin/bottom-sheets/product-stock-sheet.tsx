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
          Mise à jour du stock
        </Text>
        {product && (
          <Text className="text-sm font-fregular text-gray-600 mb-5">
            {product.name} - Stock actuel: {product.stock}
          </Text>
        )}

        <View className="flex gap-4">
          <InputSelect
            form={form}
            name="operation"
            label="Opération"
            options={operationOptions}
            placeholder="Sélectionner une opération"
            isAdmin
          />

          <Input
            form={form}
            name="quantity"
            label="Quantité"
            placeholder="0"
            isAdmin
            keyboardType="numeric"
          />
        </View>

        <View className="mb-4">
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
