import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserDTO } from "@/types";
import UserListItem from "@/components/admin/list-items/user-list-item";
import UserFormSheet from "@/components/admin/bottom-sheets/user-form-sheet";
import UserActionSheet from "@/components/admin/bottom-sheets/user-action-sheet";
import EmptyState from "@/components/admin/empty-state";
import { Users } from "lucide-react-native";
import { useUsers } from "@/hooks/use-users";
import TopNavigation from "@/components/top-navigation";

export default function UsersScreen() {
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);

  const { data: usersResponse, isLoading, refetch } = useUsers();
  const users = usersResponse?.data || [];

  const handleEdit = (user: UserDTO) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleActions = (user: UserDTO) => {
    setSelectedUser(user);
    setIsActionOpen(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0174D8" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <TopNavigation
        title="Utilisateurs"
        description={
          <Text>
            {users.length} utilisateur{users.length !== 1 ? "s" : ""}
          </Text>
        }
        noButton={true}
      />

      {users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun utilisateur"
          message="Aucun utilisateur enregistré"
        />
      ) : (
        <FlatList
          className="h-[110%] mt-12"
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <UserListItem
              user={item}
              onEdit={() => handleEdit(item)}
              onActions={() => handleActions(item)}
            />
          )}
          contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        />
      )}

      <UserFormSheet
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser || undefined}
      />

      <UserActionSheet
        isOpen={isActionOpen}
        onClose={() => {
          setIsActionOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser || undefined}
      />
    </SafeAreaView>
  );
}
