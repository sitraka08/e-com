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
}

export default function Button({
  label,
  className = "",
  loading,
  onPress,
  textClassName = "",
  disabled = false,
}: ButtonProps) {
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
