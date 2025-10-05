import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React from "react";
import { cn } from "utils/utils";

interface ButtonProps {
  label: string;
  loading?: boolean;
  onPress?: () => void;
  className?: string;
}

export default function Button({
  label,
  className = "",
  loading,
  onPress,
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(
        "bg-primary px-4 py-3 rounded-xl flex items-center justify-center",
        className
      )}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className={cn("font-fsemibold text-sm text-white")}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
