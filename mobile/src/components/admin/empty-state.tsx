import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
}

export default function EmptyState({ icon: Icon, title, message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Icon size={64} color="#9CA3AF" />
      <Text className="text-xl font-fbold text-gray-700 mt-4">{title}</Text>
      <Text className="text-sm font-fregular text-gray-500 mt-2 text-center">
        {message}
      </Text>
    </View>
  );
}
