import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { PaymentMethodDTO, PaymentMethodType } from "@/types";
import { usePaymentMethodMutations } from "@/hooks/use-payment-methods";
import { COLORS } from "@/constants/colors";

interface PaymentMethodFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod?: PaymentMethodDTO;
}

const PAYMENT_TYPES: { value: PaymentMethodType; label: string }[] = [
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "CREDIT_CARD", label: "Carte bancaire" },
  { value: "BANK_TRANSFER", label: "Virement bancaire" },
  { value: "CASH_ON_DELIVERY", label: "Paiement à la livraison" },
];

export default function PaymentMethodFormSheet({
  isOpen,
  onClose,
  paymentMethod,
}: PaymentMethodFormSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [label, setLabel] = useState("");
  const [type, setType] = useState<PaymentMethodType>("MOBILE_MONEY");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createPaymentMethod, updatePaymentMethod } = usePaymentMethodMutations();
  const isEditing = !!paymentMethod;
  const isLoading = createPaymentMethod.isPending || updatePaymentMethod.isPending;

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      if (paymentMethod) {
        setLabel(paymentMethod.label);
        setType(paymentMethod.type);
        if (paymentMethod.type === "MOBILE_MONEY" && paymentMethod.details.phoneNumber) {
          setPhoneNumber(paymentMethod.details.phoneNumber as string);
        }
        if (paymentMethod.type === "CREDIT_CARD") {
          setCardHolder((paymentMethod.details.cardHolder as string) || "");
          setExpiryDate((paymentMethod.details.expiryDate as string) || "");
        }
      } else {
        resetForm();
      }
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen, paymentMethod]);

  const resetForm = () => {
    setLabel("");
    setType("MOBILE_MONEY");
    setPhoneNumber("");
    setCardNumber("");
    setCardHolder("");
    setExpiryDate("");
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!label.trim()) newErrors.label = "Le libellé est requis";

    if (type === "MOBILE_MONEY" && !phoneNumber.trim()) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis";
    }

    if (type === "CREDIT_CARD") {
      if (!isEditing && !cardNumber.trim()) {
        newErrors.cardNumber = "Le numéro de carte est requis";
      }
      if (!cardHolder.trim()) {
        newErrors.cardHolder = "Le nom du titulaire est requis";
      }
      if (!expiryDate.trim()) {
        newErrors.expiryDate = "La date d'expiration est requise";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      let details: Record<string, unknown> = {};

      if (type === "MOBILE_MONEY") {
        details = { phoneNumber: phoneNumber.trim() };
      } else if (type === "CREDIT_CARD") {
        details = {
          cardHolder: cardHolder.trim(),
          expiryDate: expiryDate.trim(),
        };

        if (!isEditing && cardNumber.trim()) {
          details.last4 = cardNumber.slice(-4);
        } else if (isEditing && paymentMethod?.details.last4) {
          details.last4 = paymentMethod.details.last4;
        }
      }

      const data = {
        type,
        label: label.trim(),
        details,
      };

      if (isEditing && paymentMethod) {
        await updatePaymentMethod.mutateAsync({ id: paymentMethod.id, data });
      } else {
        await createPaymentMethod.mutateAsync(data);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving payment method:", error);
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
          {isEditing ? "Modifier le moyen de paiement" : "Nouveau moyen de paiement"}
        </Text>

        <View className="mb-4">
          <Text className="text-sm font-fmedium text-gray-700 mb-2">Libellé *</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="Ex: Mon Orange Money"
            className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
          />
          {errors.label && (
            <Text className="text-red-500 text-xs mt-1">{errors.label}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-fmedium text-gray-700 mb-2">Type *</Text>
          <View className="flex-row flex-wrap gap-2">
            {PAYMENT_TYPES.map((pt) => (
              <TouchableOpacity
                key={pt.value}
                onPress={() => setType(pt.value)}
                className={`px-4 py-2 rounded-lg border ${
                  type === pt.value
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-sm font-fmedium ${
                    type === pt.value ? "text-white" : "text-gray-700"
                  }`}
                >
                  {pt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {type === "MOBILE_MONEY" && (
          <View className="mb-4">
            <Text className="text-sm font-fmedium text-gray-700 mb-2">Numéro *</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="034 00 000 00"
              keyboardType="phone-pad"
              className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
            />
            {errors.phoneNumber && (
              <Text className="text-red-500 text-xs mt-1">{errors.phoneNumber}</Text>
            )}
          </View>
        )}

        {type === "CREDIT_CARD" && (
          <>
            {!isEditing && (
              <View className="mb-4">
                <Text className="text-sm font-fmedium text-gray-700 mb-2">Numéro de carte *</Text>
                <TextInput
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  maxLength={19}
                  className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
                />
                {errors.cardNumber && (
                  <Text className="text-red-500 text-xs mt-1">{errors.cardNumber}</Text>
                )}
              </View>
            )}

            <View className="mb-4">
              <Text className="text-sm font-fmedium text-gray-700 mb-2">Titulaire *</Text>
              <TextInput
                value={cardHolder}
                onChangeText={setCardHolder}
                placeholder="Nom sur la carte"
                className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
              />
              {errors.cardHolder && (
                <Text className="text-red-500 text-xs mt-1">{errors.cardHolder}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-sm font-fmedium text-gray-700 mb-2">Date d'expiration *</Text>
              <TextInput
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="MM/AA"
                keyboardType="numeric"
                maxLength={5}
                className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
              />
              {errors.expiryDate && (
                <Text className="text-red-500 text-xs mt-1">{errors.expiryDate}</Text>
              )}
            </View>
          </>
        )}

        <View className="flex-row gap-3 mt-2">
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
