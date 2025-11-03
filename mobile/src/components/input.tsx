import { View, TextInput, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  label?: string;
  type?: "password";
}

const Input = <T extends FieldValues>({
  form,
  name,
  placeholder,
  className,
  autoFocus,
  label,
  type,
}: InputProps<T>) => {
  const [show, setShow] = useState(false);
  const {
    control,
    formState: { errors },
  } = form;
  const error = errors[name];

  return (
    <View className="w-full">
      {label && (
        <Text className="text-white text-sm font-fmedium mb-2">{label}</Text>
      )}
      <View
        className={`w-full bg-[#ffffff46] px-5 h-14 rounded-xl flex flex-row items-center justify-between relative ${className}`}
      >
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="font-fmedium text-base w-[90%] text-white"
              placeholder={placeholder}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value as string}
              placeholderTextColor={"#DCDCF4"}
              autoFocus={autoFocus}
              secureTextEntry={type === "password" && !show}
            />
          )}
        />
        {type === "password" && (
          <>
            {show ? (
              <TouchableOpacity
                onPress={() => {
                  setShow(false);
                }}
              >
                <Eye color="#fff" size={20} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setShow(true);
                }}
              >
                <EyeOff color="#fff" size={20} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      {error && (
        <Text className="text-[#ec0707] text-xs font-fmedium mt-1">
          {error.message as string}
        </Text>
      )}
    </View>
  );
};

export default Input as <T extends FieldValues>(props: InputProps<T>) => React.JSX.Element;
