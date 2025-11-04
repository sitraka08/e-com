import React from "react";
import { TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";

interface FABProps {
  onPress: () => void;
}

export default function FAB({ onPress }: FABProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-32 right-5 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
      activeOpacity={0.8}
    >
      <Plus size={28} color="#fff" />
    </TouchableOpacity>
  );
}
