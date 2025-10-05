import { View, TextInput } from "react-native";
import React from "react";
import { Search } from "lucide-react-native";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
}

const SearchInput = ({
  placeholder = "Rechercher un produit",
  className,
  onChange,
  autoFocus,
}: SearchInputProps) => {
  return (
    <View
      className={`w-full bg-[#ffffff46] px-5 py-0 rounded-xl flex flex-row items-center justify-between my-3 ${className}`}
    >
      <TextInput
        className="font-fmedium text-sm mt-2 w-[90%] text-white"
        placeholder={placeholder}
        onChangeText={onChange}
        placeholderTextColor={"#DCDCF4"}
        autoFocus={autoFocus}
      />
      <Search color="#fff" />
    </View>
  );
};

export default SearchInput;
