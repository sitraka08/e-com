import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { OrderDTO } from '@/types';

interface OrderDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  order?: OrderDTO;
}

export default function OrderDetailSheet({
  isOpen,
  onClose,
  order,
}: OrderDetailSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!order) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['90%']}
      enablePanDownToClose
      onClose={onClose}
      index={-1}
      backgroundStyle={{ backgroundColor: '#fff' }}
    >
      <BottomSheetScrollView className="flex-1 px-5">
        <Text className="text-2xl font-fbold text-gray-900 mb-5">
          Détails de la commande
        </Text>

        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-sm font-fmedium text-gray-500">Numéro</Text>
          <Text className="text-lg font-fbold text-gray-900 mt-1">
            #{order.orderNumber}
          </Text>
          <Text className="text-sm font-fregular text-gray-600 mt-2">
            {formatDate(order.createdAt)}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-base font-fbold text-gray-900 mb-2">Client</Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="text-base font-fmedium text-gray-900">
              {order.user?.firstName} {order.user?.lastName}
            </Text>
            <Text className="text-sm font-fregular text-gray-600 mt-1">
              {order.user?.email}
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-base font-fbold text-gray-900 mb-2">Adresse de livraison</Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="text-base font-fmedium text-gray-900">
              {order.address?.fullName}
            </Text>
            <Text className="text-sm font-fregular text-gray-600 mt-1">
              {order.address?.phone}
            </Text>
            <Text className="text-sm font-fregular text-gray-600 mt-1">
              {order.address?.street}
            </Text>
            <Text className="text-sm font-fregular text-gray-600">
              {order.address?.city}, {order.address?.region}
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-base font-fbold text-gray-900 mb-2">Produits</Text>
          {order.items?.map((item, index) => (
            <View key={index} className="bg-gray-50 rounded-xl p-4 mb-2">
              <View className="flex-row justify-between">
                <Text className="text-base font-fmedium text-gray-900 flex-1">
                  {item.product?.name || 'Produit'}
                </Text>
                <Text className="text-base font-fbold text-gray-900">
                  x{item.quantity}
                </Text>
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-sm font-fregular text-gray-600">
                  {item.priceAtOrder.toLocaleString()} Ar/unité
                </Text>
                <Text className="text-base font-fbold text-primary">
                  {item.subtotal.toLocaleString()} Ar
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="bg-primary/10 rounded-xl p-4 mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-base font-fmedium text-gray-700">Sous-total</Text>
            <Text className="text-base font-fmedium text-gray-900">
              {((order.totalAmount || 0) - (order.deliveryFee || 0)).toLocaleString()} Ar
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-base font-fmedium text-gray-700">Livraison</Text>
            <Text className="text-base font-fmedium text-gray-900">
              {(order.deliveryFee || 0).toLocaleString()} Ar
            </Text>
          </View>
          <View className="border-t border-gray-300 my-2" />
          <View className="flex-row justify-between">
            <Text className="text-lg font-fbold text-gray-900">Total</Text>
            <Text className="text-lg font-fbold text-primary">
              {(order.totalAmount || 0).toLocaleString()} Ar
            </Text>
          </View>
        </View>

        {order.payments && order.payments.length > 0 && (
          <View className="mb-4">
            <Text className="text-base font-fbold text-gray-900 mb-2">Paiements</Text>
            {order.payments.map((payment, index) => (
              <View key={index} className="bg-gray-50 rounded-xl p-4 mb-2">
                <View className="flex-row justify-between">
                  <Text className="text-base font-fmedium text-gray-900">
                    {payment.paymentMethod?.label || 'Paiement'}
                  </Text>
                  <Text className="text-base font-fbold text-gray-900">
                    {payment.amount.toLocaleString()} Ar
                  </Text>
                </View>
                <Text className="text-sm font-fregular text-gray-600 mt-1">
                  Status: {payment.status}
                </Text>
              </View>
            ))}
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
