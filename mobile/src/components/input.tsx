import { View, TextInput, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";

interface InputProps {
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
  label?: string;
  type?: "password";
}

const Input = ({
  placeholder,
  className,
  onChange,
  autoFocus,
  label,
  type,
}: InputProps) => {
  const [show, setShow] = useState(false);
  return (
    <View className="w-full">
      {label && (
        <Text className="text-white text-sm font-fmedium">{label}</Text>
      )}
      <View
        className={`w-full bg-[#ffffff46] px-5  h-14 rounded-xl flex flex-row items-center justify-between relative ${className}`}
      >
        <TextInput
          className="font-fmedium text-base mt-2 w-[90%] text-white"
          placeholder={placeholder}
          onChangeText={onChange}
          placeholderTextColor={"#DCDCF4"}
          autoFocus={autoFocus}
          secureTextEntry={show}
        />
        {type === "password" && (
          <>
            {show ? (
              <TouchableOpacity
                onPress={() => {
                  setShow(false);
                }}
              >
                <Text>
                  <Eye color="#fff" size={20} />
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setShow(true);
                }}
              >
                <Text>
                  <EyeOff color="#fff" size={20} />
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default Input;
