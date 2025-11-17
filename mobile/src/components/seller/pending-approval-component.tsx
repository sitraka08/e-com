import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { sellerServices } from "@/services/seller.services";

export default function PendingApprovalComponent() {
  const router = useRouter();
  const { seller, clearAuth, setSeller } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      const response = await sellerServices.getSellerProfile();
      if (response.success && response.data) {
        await setSeller(response.data);

        if (response.data.isApproved) {
          router.replace("/(seller)/dashboard");
        }
      }
    } catch (error) {
      console.error("Error refreshing status:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await clearAuth();
    router.replace("/login");
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="bg-[#0174D8] pt-14 pb-8 px-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-2xl font-fbold">
              Compte Vendeur
            </Text>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-white/20 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-fmedium">Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 -mt-4">
          <View className="rounded-2xl border-2 bg-yellow-100 border-yellow-500 p-6 bg-white shadow-lg">
            <View className="items-center mb-4">
              <View className="bg-white rounded-full p-4 mb-4">
                <Ionicons name="time" size={64} color="#eab308" />
              </View>
              <Text className="text-2xl font-fbold text-gray-800 text-center">
                En attente de validation
              </Text>
            </View>

            <Text className="text-gray-600 text-center font-fregular leading-6 mb-6">
              Votre demande de compte vendeur est en cours d'examen par notre
              équipe. Vous recevrez une notification dès qu'une décision sera
              prise.
            </Text>

            {seller && (
              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <Text className="text-sm font-fmedium text-gray-500 mb-2">
                  Informations de votre demande
                </Text>
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="storefront-outline"
                      size={20}
                      color="#6b7280"
                    />
                    <Text className="ml-2 font-fmedium text-gray-800">
                      {seller.storeName}
                    </Text>
                  </View>
                  <Text className="text-gray-600 font-fregular ml-7">
                    {seller.storeDescription}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#6b7280"
                    />
                    <Text className="ml-2 text-sm text-gray-500 font-fregular">
                      Demande créée le{" "}
                      {new Date(seller.createdAt).toLocaleDateString("fr-FR")}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              onPress={handleRefreshStatus}
              disabled={isRefreshing}
              className="bg-[#0174D8] py-4 rounded-xl flex-row items-center justify-center"
            >
              {isRefreshing ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text className="text-white font-fbold ml-2">
                    Vérifier le statut
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 mt-6">
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={24} color="#0174D8" />
              <View className="ml-3 flex-1">
                <Text className="font-fmedium text-gray-800 mb-1">
                  Temps de traitement
                </Text>
                <Text className="text-sm text-gray-600 font-fregular">
                  Le traitement de votre demande peut prendre de 24 à 72
                  heures. Vous pouvez vérifier le statut à tout moment en
                  cliquant sur le bouton ci-dessus.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 mt-4 mb-8">
          <View className="bg-white border border-gray-200 rounded-xl p-4">
            <View className="flex-row items-start">
              <Ionicons name="mail-outline" size={24} color="#6b7280" />
              <View className="ml-3 flex-1">
                <Text className="font-fmedium text-gray-800 mb-1">
                  Besoin d'aide ?
                </Text>
                <Text className="text-sm text-gray-600 font-fregular">
                  Si vous avez des questions concernant votre demande,
                  n'hésitez pas à contacter notre équipe support.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
