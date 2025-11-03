import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profil() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/(auth)/login");
  }, [router]);

  return (
    <SafeAreaView className="flex-1 p-10 bg-primary">
      <View className="h-full w-full flex items-center pt-14 gap-3">
        <Text className="text-5xl text-white font-ffextrabold my-8">
          Profile
        </Text>
      </View>
    </SafeAreaView>
  );
}
