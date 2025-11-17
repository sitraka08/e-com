import { useSellerProfile } from "@/hooks/useSeller";
import { useAuthStore } from "@/stores/useAuthStore";
import { Store, LogOut, User } from "lucide-react-native";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import TopNavigation from "@/components/top-navigation";
import { Button } from "@/components/button";

export default function SellerProfile() {
  const router = useRouter();
  const { data, isLoading } = useSellerProfile();
  const { user, clearAuth } = useAuthStore();
  const profile = data?.data;

  const handleLogout = () => {
    clearAuth();
    router.replace("/(client)/home");
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0174D8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <TopNavigation
        title="Mon Profil"
        description="Informations de votre boutique"
        noButton={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="h-[110%]"
        contentContainerStyle={{ padding: 16, paddingTop: 100, paddingBottom: 100 }}
      >
        <View className="bg-white rounded-xl p-6 mb-4 border border-gray-200 items-center">
          <View className="bg-primary/10 rounded-full p-4 mb-4">
            <Store size={40} color="#0174D8" />
          </View>
          <Text className="text-2xl font-fbold text-gray-800">
            {profile?.storeName || "Mon Magasin"}
          </Text>
          <Text className="text-sm font-fregular text-gray-600 mt-1">
            {user?.email}
          </Text>
        </View>

        <View className="bg-white rounded-xl p-6 mb-4 border border-gray-200">
          <Text className="text-lg font-fbold text-gray-800 mb-4">
            Informations
          </Text>

          <View className="mb-3">
            <Text className="text-sm font-fmedium text-gray-600">
              Description
            </Text>
            <Text className="text-base font-fregular text-gray-800 mt-1">
              {profile?.storeDescription || "Aucune description"}
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-sm font-fmedium text-gray-600">
              Taux de commission
            </Text>
            <Text className="text-base font-fbold text-primary mt-1">
              {profile?.commissionRate}%
            </Text>
          </View>

          <View>
            <Text className="text-sm font-fmedium text-gray-600">Statut</Text>
            <View className="flex-row items-center mt-1">
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  profile?.isApproved ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <Text className="text-base font-fregular text-gray-800">
                {profile?.isApproved ? "Approuvé" : "En attente"}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-6 mb-4 border border-gray-200">
          <Text className="text-lg font-fbold text-gray-800 mb-4">
            Compte utilisateur
          </Text>

          <View className="flex-row items-center mb-3">
            <User size={20} color="#6B7280" />
            <Text className="text-base font-fregular text-gray-800 ml-3">
              {user?.firstName} {user?.lastName}
            </Text>
          </View>

          <View className="bg-gray-50 rounded-lg p-3">
            <Text className="text-xs font-fmedium text-gray-600 mb-1">Rôle</Text>
            <Text className="text-sm font-fbold text-primary">{user?.role}</Text>
          </View>
        </View>

        <Button
          label="Déconnexion"
          variant="destructive"
          iconLeft={<LogOut size={20} color="#EF4444" />}
          onPress={handleLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
