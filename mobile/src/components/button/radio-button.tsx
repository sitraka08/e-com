import React from "react";
import { View, Pressable } from "react-native";
import { cn } from "@/utils/utils";

interface RadioButtonProps {
  selected?: boolean;
  onPress?: () => void;
}

const RadioButton = ({ selected, onPress }: RadioButtonProps) => {
  return (
    <Pressable onPress={onPress} className="flex-row items-center mb-2">
      <View
        className={cn(
          `w-6 h-6 rounded-full border-2  mr-2 border-[#000000c7]`,
          selected ? "!border-primary" : ""
        )}
      >
        {selected && (
          <View className="w-3 h-3 rounded-full bg-primary self-center mt-1" />
        )}
      </View>
    </Pressable>
  );
};

export default RadioButton;
