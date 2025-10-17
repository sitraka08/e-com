import Button from "@/components/button/button";
import Input from "@/components/input";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profil() {
  return (
    <SafeAreaView className="flex-1 p-10 bg-primary">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-full w-full flex items-center gap-3">
          <Text className="text-5xl text-white font-ffextrabold my-8">
            QitKif
          </Text>
          <Input label="Nom" placeholder="John" />
          <Input label="Prénom(s)" placeholder="Eric" />
          <Input label="Email" placeholder="qitkif@example.com" />
          <Input label="Mot de passe" type="password" />
          <Input label="Confirmer le mot de passe" type="password" />

          <Button
            label="Se connecter"
            className="!bg-white  w-full h-14 mt-12"
            textClassName="!text-primary"
          />
          <Button
            label="Créer un compte"
            className="border border-white  w-full h-14"
            textClassName="!text-white"
          />
          <Text className="font-fmedium text-sm underline text-white">
            Mot de passe oublié ?
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
