import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { RadioButton } from "./button/radio-button";
import DividerDashed from "./divider-dashed";
import { BanknoteArrowUp } from "lucide-react-native";
import { cn } from "utils/utils";

interface PayementMethodCardProps {
  checked?: boolean;
  onPress?: () => void;
  label: string;
  description?: string;
  noInput?: boolean;
}

export default function PayementMethodCard({
  onPress,
  checked,
  label,
  description,
  noInput = false,
}: PayementMethodCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      className={cn(
        "p-5 border-2 border-[#0000000a]  rounded-xl ",
        checked ? "!border-primary !bg-secondary" : "bg-[#ffffffd0]"
      )}
    >
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row gap-5 items-center">
          <View className="bg-primary p-2 rounded-lg w-14 h-14 flex items-center justify-center">
            <BanknoteArrowUp size={22} color="#fff" />
          </View>
          <View className="flex flex-col justify-center">
            <Text className="font-fsemibold text-sm">{label}</Text>
            <Text className="font-fregular text-sm">{description}</Text>
          </View>
        </View>

        <View>
          <RadioButton selected={checked} />
        </View>
      </View>
      {!noInput && (
        <>
          <DividerDashed className="!border-[#00000033] !my-2" />
          <View
            className={`w-full bg-[#fff] px-5 py-0 rounded-xl flex flex-row items-center justify-between my-3 border border-[#0000003a]`}
          >
            <TextInput
              className="font-fmedium text-base mt-2 w-[90%] text-[#000000af]"
              placeholderTextColor={"#DCDCF4"}
              keyboardType="numeric"
            />
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}
