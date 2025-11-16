import React from "react";
import { View, Pressable, Text } from "react-native";
import { Check } from "lucide-react-native";
import { cn } from "@/utils/utils";

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  className?: string;
}

export const Checkbox = ({ checked, onPress, label, className }: CheckboxProps) => {
  return (
    <Pressable onPress={onPress} className={cn("flex-row items-center w-full", className)}>
      <View
        className={cn(
          "w-6 h-6 rounded border-2 mr-3 items-center justify-center",
          checked ? "bg-white border-white" : "bg-[#ffffff46] border-white"
        )}
      >
        {checked && <Check size={16} color="#0174D8" strokeWidth={3} />}
      </View>
      {label && (
        <Text className="text-white font-fmedium text-base flex-1">
          {label}
        </Text>
      )}
    </Pressable>
  );
};
