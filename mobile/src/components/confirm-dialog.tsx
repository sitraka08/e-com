import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { AlertCircle, X } from "lucide-react-native";

interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
  isLoading?: boolean;
}

export default function ConfirmDialog({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  confirmVariant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const confirmBgColor =
    confirmVariant === "danger" ? "bg-red-600" : "bg-primary";
  const confirmBgColorDisabled =
    confirmVariant === "danger" ? "bg-red-400" : "bg-blue-400";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Overlay */}
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-6"
        onPress={isLoading ? undefined : onClose}
        disabled={isLoading}
      >
        {/* Dialog Card */}
        <Pressable
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
            <View className="flex-1" />
            <TouchableOpacity
              onPress={onClose}
              disabled={isLoading}
              className="p-1"
              activeOpacity={0.7}
            >
              <X size={24} color={isLoading ? "#9CA3AF" : "#6B7280"} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="p-6 items-center">
            {/* Icon */}
            <View
              className={`w-16 h-16 rounded-full ${
                confirmVariant === "danger" ? "bg-red-100" : "bg-blue-100"
              } items-center justify-center mb-4`}
            >
              <AlertCircle
                size={32}
                color={confirmVariant === "danger" ? "#DC2626" : "#0174D8"}
                strokeWidth={2.5}
              />
            </View>

            {/* Title */}
            <Text className="font-fbold text-xl text-gray-900 text-center mb-3">
              {title}
            </Text>

            {/* Message */}
            <Text className="font-fregular text-base text-gray-600 text-center leading-6">
              {message}
            </Text>
          </View>

          {/* Actions */}
          <View className="flex-row gap-3 p-6 pt-0">
            {/* Cancel Button */}
            <TouchableOpacity
              onPress={onClose}
              disabled={isLoading}
              className={`flex-1 py-4 rounded-xl border-2 border-gray-300 ${
                isLoading ? "bg-gray-100" : "bg-white"
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`font-fsemibold text-base text-center ${
                  isLoading ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-4 rounded-xl ${
                isLoading ? confirmBgColorDisabled : confirmBgColor
              } flex-row items-center justify-center`}
              activeOpacity={0.7}
            >
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                  className="mr-2"
                />
              )}
              <Text className="font-fsemibold text-base text-white text-center">
                {isLoading ? "Suppression..." : confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
