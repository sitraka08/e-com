import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { cn } from "@/utils/utils";

interface ButtonProps {
  label: string;
  loading?: boolean;
  onPress?: () => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  variant?: "destructive" | "normal";
}

export default function Button({
  label,
  className = "",
  loading,
  onPress,
  textClassName = "",
  disabled = false,
  variant,
}: ButtonProps) {
  if (variant === "destructive") {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        disabled={loading || disabled}
        className="flex-row items-center justify-center py-4 px-4 rounded-2xl border-2 border-red-500 bg-red-50 mb-8"
      >
        <Text className="ml-2 text-base font-fsemibold text-red-500">
          {label}
        </Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      className={cn(
        "bg-primary px-4 py-3 rounded-xl flex items-center justify-center",
        className
      )}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={loading || disabled}
    >
      {loading ? (
        <View className="flex flex-row items-center justify-center gap-3">
          <ActivityIndicator color="#000" />
          <Text
            className={cn("font-fsemibold text-sm text-white", textClassName)}
          >
            {label}
          </Text>
        </View>
      ) : (
        <Text
          className={cn("font-fsemibold text-sm text-white", textClassName)}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
