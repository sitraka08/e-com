import { View, Text } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { cn } from "@/utils/utils";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface InputSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  label?: string;
  isAdmin?: boolean;
}

const InputSelect = <T extends FieldValues>({
  form,
  name,
  options,
  placeholder = "Sélectionner...",
  className,
  label,
  isAdmin,
}: InputSelectProps<T>) => {
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
          render={({ field: { onChange, value } }) => (
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={{
                width: "100%",
                height: 56,
                fontFamily: "FMedium",
              }}
              dropdownIconColor="#fff"
            >
              <Picker.Item
                label={placeholder}
                value=""
                enabled={false}
                style={{
                  color: "#DCDCF4",
                }}
                fontFamily="FMedium"
              />
              {options.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  style={{
                    color: "#000",
                  }}
                  fontFamily="FMedium"
                />
              ))}
            </Picker>
          )}
        />
      </View>
      {error && (
        <Text className="text-red-500 text-xs font-fmedium mt-1">
          {error.message as string}
        </Text>
      )}
    </View>
  );
};

export default InputSelect as <T extends FieldValues>(
  props: InputSelectProps<T>
) => React.JSX.Element;
