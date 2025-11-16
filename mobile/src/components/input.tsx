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
  variant?: "auth" | "sheet";
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
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
  variant = "auth",
  keyboardType = "default",
}: InputProps<T>) => {
  const [show, setShow] = useState(false);
  const {
    control,
    formState: { errors },
  } = form;
  const error = errors[name];

  const isSheet = variant === "sheet";

  return (
    <View className="w-full">
      {label && (
        <Text
          className={cn(
            "text-sm font-fmedium mb-2",
            isSheet ? "text-gray-700" : isAdmin ? "text-zinc-800" : "text-white"
          )}
        >
          {label}
        </Text>
      )}
      <View
        className={cn(
          `w-full px-5 h-14 rounded-xl flex flex-row items-center justify-between relative ${className}`,
          isSheet
            ? "bg-white border border-gray-300"
            : isAdmin
            ? "bg-[#9b999946]"
            : "bg-[#ffffff46]"
        )}
      >
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={cn(
                "font-fregular text-base w-[90%]",
                isSheet ? "text-gray-900" : isAdmin ? "text-zinc-800" : "text-white"
              )}
              placeholder={placeholder}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value ? String(value) : ""}
              placeholderTextColor={isSheet ? "#9CA3AF" : !isAdmin ? "#DCDCF4" : "#848484"}
              autoFocus={autoFocus}
              secureTextEntry={type === "password" && !show}
              keyboardType={keyboardType}
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
                <Eye color={isSheet ? "#000" : "#fff"} size={20} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setShow(true);
                }}
              >
                <EyeOff color={isSheet ? "#000" : "#fff"} size={20} />
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
