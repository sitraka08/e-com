import React from "react";
import { View, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "#0174D8",
  iconBgColor = "#E0F2FE",
}: StatCardProps) {
  return (
    <View className="bg-white rounded-xl p-4 border border-gray-200">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-sm font-fmedium text-gray-600">{title}</Text>
          <Text className="text-lg font-fbold text-gray-900 mt-1">{value}</Text>
        </View>
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={24} color={iconColor} />
        </View>
      </View>
    </View>
  );
}
