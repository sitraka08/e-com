import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ArrowLeft } from "lucide-react-native";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";
import SearchInput from "./search-input";

interface TopNavigationProps {
  onPress?: () => void;
  title: string;
  description?: string | React.ReactNode;
  withIput?: boolean;
  noButton?: boolean;
  rightAction?: React.ReactNode;
  onChange?: (s: string) => void;
}

export default function TopNavigation({
  title,
  onPress,
  description,
  withIput = false,
  noButton = false,
  rightAction,
  onChange,
}: TopNavigationProps) {
  const router = useRouter();
  return (
    <View className="bg-primary absolute w-full top-0 rounded-b-[30px] p-6 px-10 z-10">
      <View className="flex flex-row items-center gap-4">
        {!noButton && (
          <TouchableOpacity
            className="bg-white rounded-full p-1"
            onPress={onPress || router.back}
          >
            <ArrowLeft size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        <View className="flex-1 justify-center">
          <Text className="text-white font-fmedium text-xl">{title}</Text>
          {description && (
            <Text className="text-xs text-white">{description}</Text>
          )}
        </View>

        {rightAction}
      </View>
      {withIput && <SearchInput autoFocus onChange={onChange} />}
    </View>
  );
}
