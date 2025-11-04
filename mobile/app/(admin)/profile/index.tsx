import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserMutations } from "@/hooks/use-users";
import { UpdateUserDTO, UpdateUserSchema } from "@/types";
import Input from "@/components/input";
import Button from "@/components/button/button";
import TopNavigation from "@/components/top-navigation";
import AvatarPicker from "@/components/admin/avatar-picker";
import { COLORS } from "@/constants/colors";

export default function AdminProfilePage() {
  const { user, clearAuth } = useAuthStore();
  const { updateUser } = useUserMutations();
  const router = useRouter();
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [avatarError, setAvatarError] = useState("");

  const form = useForm<UpdateUserDTO>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: "",
    },
  });

  const onSubmit = async (data: UpdateUserDTO) => {
    if (!user) return;

    try {
      const filteredData: UpdateUserDTO = {};
      if (data.firstName) filteredData.firstName = data.firstName;
      if (data.lastName) filteredData.lastName = data.lastName;
      if (data.email) filteredData.email = data.email;
      if (data.password) filteredData.password = data.password;

      await updateUser.mutateAsync({
        id: user.id,
        data: filteredData,
      });

      form.setValue("password", "");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          await clearAuth();
          router.replace("/login");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-fmedium text-gray-500">
            Utilisateur non connecté
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <TopNavigation
        title="Mon Profil"
        description="Gérez vos informations personnelles"
      />

      <ScrollView
        className="flex-1 px-5 mt-12"
        contentContainerStyle={{
          paddingTop: 70,
        }}
      >
        <View className="py-4">
          <AvatarPicker
            value={avatar}
            onChange={(newAvatar) => {
              setAvatar(newAvatar);
              setAvatarError("");
            }}
            error={avatarError}
          />

          {/* Informations personnelles */}
          <View className="mb-6">
            <Text className="text-lg font-fbold text-zinc-800 mb-4">
              Informations personnelles
            </Text>

            <View className="gap-4">
              <Input
                form={form}
                name="firstName"
                label="Prénom"
                placeholder="Votre prénom"
                isAdmin
              />

              <Input
                form={form}
                name="lastName"
                label="Nom"
                placeholder="Votre nom"
                isAdmin
              />

              <Input
                form={form}
                name="email"
                label="Email"
                placeholder="votre@email.com"
                isAdmin
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-fbold text-zinc-800 mb-4">
              Sécurité
            </Text>

            <Input
              form={form}
              name="password"
              label="Nouveau mot de passe"
              placeholder="Laissez vide pour ne pas changer"
              type="password"
              isAdmin
            />

            <Text className="text-xs font-fregular text-gray-500 mt-2">
              Le mot de passe doit contenir au moins 8 caractères avec une
              majuscule, une minuscule et un chiffre.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-fbold text-zinc-800 mb-4">
              Informations du compte
            </Text>

            <View className="bg-gray-50 rounded-xl p-4 gap-3">
              <View className="flex-row justify-between">
                <Text className="text-sm font-fmedium text-gray-600">Rôle</Text>
                <Text className="text-sm font-fbold text-primary">
                  {user.role === "ADMIN" ? "Administrateur" : user.role}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm font-fmedium text-gray-600">
                  Statut
                </Text>
                <Text
                  className={`text-sm font-fbold ${
                    user.status === "ACTIVE"
                      ? "text-green-600"
                      : user.status === "SUSPENDED"
                        ? "text-red-600"
                        : "text-orange-600"
                  }`}
                >
                  {user.status === "ACTIVE"
                    ? "Actif"
                    : user.status === "SUSPENDED"
                      ? "Suspendu"
                      : "En attente"}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm font-fmedium text-gray-600">
                  Membre depuis
                </Text>
                <Text className="text-sm font-fregular text-gray-700">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </View>

          {/* Boutons d'action */}
          <View className="gap-3 mb-8">
            <Button
              label="Mettre à jour le profil"
              onPress={form.handleSubmit(onSubmit)}
              loading={updateUser.isPending}
              className="!bg-primary w-full h-14"
              textClassName="!text-white"
            />

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center justify-center py-4 px-4 rounded-xl border-2 border-red-500 bg-red-50"
            >
              <LogOut size={20} color="#EF4444" />
              <Text className="ml-2 text-base font-fbold text-red-500">
                Se déconnecter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
