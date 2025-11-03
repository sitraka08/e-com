import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Button from '@/components/button/button';

interface ConfirmSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export default function ConfirmSheet({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmVariant = 'danger',
  isLoading = false,
}: ConfirmSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

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
        <Text className="text-2xl font-fbold text-gray-900 mb-3">{title}</Text>
        <Text className="text-base font-fregular text-gray-600 mb-8">
          {message}
        </Text>

        <View className="flex-col gap-3">
          <Button
            label={confirmText}
            onPress={onConfirm}
            loading={isLoading}
            className={
              confirmVariant === 'danger'
                ? '!bg-red-500 w-full h-14'
                : '!bg-primary w-full h-14'
            }
            textClassName="!text-white"
          />
          <Button
            label={cancelText}
            onPress={onClose}
            className="border border-gray-300 bg-white w-full h-14"
            textClassName="!text-gray-700"
            disabled={isLoading}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
