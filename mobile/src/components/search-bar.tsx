import { View, Text } from "react-native";
import React from "react";
import SearchInput from "./search-input";
import { useAuthStore } from "@/stores/useAuthStore";

interface SearchBarProps {
  autoFocus?: boolean;
  onFocus?: () => void;
}

export default function SearchBar({ autoFocus, onFocus }: SearchBarProps) {
  const { user } = useAuthStore();

  return (
    <View
      className="bg-primary absolute w-full top-0 rounded-b-[40px] p-5"
      onFocus={onFocus}
    >
      <Text className="text-white font-fmedium text-lg">
        Bonjour {user?.firstName} {user?.lastName}
      </Text>
      <Text className="text-white font-fregular text-xs">
        Que cherchez-vous aujourd'hui ?
      </Text>
      <SearchInput autoFocus={autoFocus} />
    </View>
  );
}
