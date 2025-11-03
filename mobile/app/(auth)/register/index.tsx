import Button from "@/components/button/button";
import Input from "@/components/input";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profil() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 p-10 bg-primary">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-full w-full flex items-center gap-3">
          <Text className="text-5xl text-white font-ffextrabold myt8">
            QitKif
          </Text>
          <Text className="text-2xl text-white font-ffextrabold">
            Créer un compte
          </Text>
          <Input label="Nom" placeholder="John" />
          <Input label="Prénom(s)" placeholder="Eric" />
          <Input label="Email" placeholder="qitkif@example.com" />
          <Input label="Mot de passe" type="password" />
          <Input label="Confirmer le mot de passe" type="password" />

          <Button
            label="Créer un compte"
            className="!bg-white  w-full h-14 mt-5"
            textClassName="!text-primary"
          />
          <Button
            label="Se connecter"
            className="border border-white  w-full h-14"
            textClassName="!text-white"
            onPress={() => router.push("/(auth)/login")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
