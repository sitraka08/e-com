import { View, TextInput, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { cn } from "@/utils/utils";

interface InputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  label?: string;
  type?: "password";
  isAdmin?: boolean;
}

const Input = <T extends FieldValues>({
  form,
  name,
  placeholder,
  className,
  autoFocus,
  label,
  type,
  isAdmin,
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
        <Text
          className={cn(
            "text-sm font-fmedium mb-2",
            isAdmin ? "text-zinc-800" : "text-white"
          )}
        >
          {label}
        </Text>
      )}
      <View
        className={cn(
          `w-full  px-5 h-14 rounded-xl flex flex-row items-center justify-between relative ${className}`,
          isAdmin ? "bg-[#9b999946]" : "bg-[#ffffff46]"
        )}
      >
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={cn(
                "font-fmedium text-base w-[90%] text-white",
                isAdmin ? "text-zinc-800" : "text-white"
              )}
              placeholder={placeholder}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value as string}
              placeholderTextColor={!isAdmin ? "#DCDCF4" : "#848484"}
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

export default Input as <T extends FieldValues>(
  props: InputProps<T>
) => React.JSX.Element;
