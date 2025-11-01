import { View, Text } from "react-native";
import React from "react";
import SearchInput from "./search-input";

interface SearchBarProps {
  autoFocus?: boolean;
}

export default function SearchBar({ autoFocus }: SearchBarProps) {
  return (
    <View className="bg-primary absolute w-full top-0 rounded-b-[40px] p-5">
      <Text className="text-white font-fmedium text-lg">Bonjour Marie !</Text>
      <Text className="text-white font-fregular text-xs">
        Que cherchez-vous aujourd'hui ?
      </Text>
      <SearchInput autoFocus={autoFocus} />
    </View>
  );
}
