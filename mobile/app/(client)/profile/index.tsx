import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LogOut,
  MapPin,
  CreditCard,
  Lock,
  ChevronRight,
  User as UserIcon,
} from "lucide-react-native";
import { useAuthStore } from "@/stores/useAuthStore";
import { COLORS } from "@/constants/colors";
import TopNavigation from "@/components/top-navigation";

interface MenuItem {
  icon: any;
  label: string;
  route: string;
  color?: string;
}

export default function Profil() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();

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

  const menuItems: MenuItem[] = [
    {
      icon: MapPin,
      label: "Mes adresses",
      route: "/(client)/profile/addresses",
    },
    {
      icon: CreditCard,
      label: "Moyens de paiement",
      route: "/(client)/profile/payment-methods",
    },
    {
      icon: Lock,
      label: "Changer le mot de passe",
      route: "/(client)/profile/change-password",
    },
  ];

  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <TopNavigation
        title="Mon Profil"
        description="Gérez votre compte et vos préférences"
      />

      <ScrollView className="flex-1 px-5 mt-16">
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <View className="items-center mb-4">
            <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-3">
              <UserIcon size={40} color={COLORS.primary} />
            </View>
            <Text className="text-xl font-fbold text-zinc-800">
              {user.firstName} {user.lastName}
            </Text>
            <Text className="text-sm font-fregular text-gray-500 mt-1">
              {user.email}
            </Text>
          </View>

          <View className="bg-gray-50 rounded-xl p-4 gap-3">
            <View className="flex-row justify-between">
              <Text className="text-sm font-fmedium text-gray-600">Statut</Text>
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

        <View className="bg-white rounded-2xl mb-6 shadow-sm overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(item.route as any)}
                className={`flex-row items-center justify-between px-6 py-4 ${
                  index < menuItems.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
                    <Icon size={20} color={COLORS.primary} />
                  </View>
                  <Text className="text-base font-fmedium text-zinc-800">
                    {item.label}
                  </Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center py-4 px-4 rounded-2xl border-2 border-red-500 bg-red-50 mb-8"
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="ml-2 text-base font-fbold text-red-500">
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
