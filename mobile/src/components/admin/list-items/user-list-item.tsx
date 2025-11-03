import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { UserDTO } from '@/types';
import { Pencil, MoreVertical } from 'lucide-react-native';

interface UserListItemProps {
  user: UserDTO;
  onEdit: () => void;
  onActions: () => void;
}

export default function UserListItem({ user, onEdit, onActions }: UserListItemProps) {
  const getRoleBadgeColor = (role: string) => {
    return role === 'ADMIN' ? 'bg-purple-100' : 'bg-blue-100';
  };

  const getRoleTextColor = (role: string) => {
    return role === 'ADMIN' ? 'text-purple-700' : 'text-blue-700';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100';
      case 'SUSPENDED':
        return 'bg-red-100';
      case 'PENDING':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-700';
      case 'SUSPENDED':
        return 'text-red-700';
      case 'PENDING':
        return 'text-orange-700';
      default:
        return 'text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Actif';
      case 'SUSPENDED':
        return 'Suspendu';
      case 'PENDING':
        return 'En attente';
      default:
        return status;
    }
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-lg font-fbold text-gray-900">
            {user.firstName} {user.lastName}
          </Text>
          <Text className="text-sm font-fregular text-gray-600 mt-1">{user.email}</Text>

          <View className="flex-row gap-2 mt-3">
            <View className={`px-2 py-1 rounded ${getRoleBadgeColor(user.role)}`}>
              <Text className={`text-xs font-fmedium ${getRoleTextColor(user.role)}`}>
                {user.role}
              </Text>
            </View>
            <View className={`px-2 py-1 rounded ${getStatusBadgeColor(user.status)}`}>
              <Text className={`text-xs font-fmedium ${getStatusTextColor(user.status)}`}>
                {getStatusLabel(user.status)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row mt-3 gap-2">
        <TouchableOpacity
          onPress={onEdit}
          className="flex-1 bg-gray-50 rounded-lg p-3 flex-row items-center justify-center"
        >
          <Pencil size={16} color="#6B7280" />
          <Text className="text-gray-700 font-fmedium text-sm ml-1">Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onActions}
          className="flex-1 bg-blue-50 rounded-lg p-3 flex-row items-center justify-center"
        >
          <MoreVertical size={16} color="#3B82F6" />
          <Text className="text-blue-600 font-fmedium text-sm ml-1">Actions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
