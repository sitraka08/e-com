import { TouchableOpacity, GestureResponderEvent } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface PlusButtonProps {
  onPress: (event: GestureResponderEvent) => void;
}

const PlusButton = ({ onPress }: PlusButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="bg-white border border-zinc-800 w-6 h-6 rounded-lg flex items-center justify-center"
      onPress={onPress}
    >
      <Ionicons name="add" color="#000" size={10} />
    </TouchableOpacity>
  );
};

export default PlusButton;
