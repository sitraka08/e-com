import Button from "@/components/button/button";
import Input from "@/components/input";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profil() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/(tabs)/profile/login");
  }, [router]);

  return (
    <SafeAreaView className="flex-1 p-10 bg-primary">
      <View className="h-full w-full flex items-center pt-14 gap-3">
        <Text className="text-5xl text-white font-ffextrabold my-8">
          QitKif
        </Text>
        <Input label="Email" placeholder="qitkif@example.com" />
        <Input label="Mot de passe" type="password" />
        <Button
          label="Se connecter"
          className="!bg-white  w-full h-14 mt-12"
          textClassName="!text-primary"
        />
        <Button
          onPress={() => router.push("/(tabs)/profile/register")}
          label="Créer un compte"
          className="border border-white  w-full h-14"
          textClassName="!text-white"
        />
        <Text className="font-fmedium text-sm underline text-white">
          Mot de passe oublié ?
        </Text>
      </View>
    </SafeAreaView>
  );
}
