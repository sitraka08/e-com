import Button from "@/components/button/button";
import Input from "@/components/input";
import TopNavigation from "@/components/top-navigation";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginDTO, LoginSchema } from "@/types";
import { useAuthMutation } from "@/hooks/use-auth";

export default function Profil() {
  const router = useRouter();
  const form = useForm<LoginDTO>({
    resolver: zodResolver(LoginSchema),
  });
  const { login } = useAuthMutation();

  const submitAction = (data: LoginDTO) => {
    login.mutate(data);
  };
  return (
    <SafeAreaView className="flex-1 p-10 bg-primary">
      <TopNavigation
        title="Accueil"
        onPress={() => router.replace("/(admin)/users")}
      />
      <View className="h-full w-full flex items-center pt-14 gap-3">
        <Text className="text-5xl text-white font-ffextrabold my-t">
          QitKif
        </Text>
        <Text className="text-2xl text-white font-ffextrabold">
          Se connecter
        </Text>
        <Input
          form={form}
          name="email"
          label="Email"
          placeholder="qitkif@example.com"
        />
        <Input
          form={form}
          name="password"
          label="Mot de passe"
          type="password"
        />
        <Button
          label="Se connecter"
          className="!bg-white  w-full h-14 mt-12"
          textClassName="!text-primary"
          onPress={form.handleSubmit(submitAction)}
          loading={login.isPending}
        />

        <Button
          onPress={() => router.push("/(auth)/register")}
          label="Créer un compte"
          className="border border-white  w-full h-14"
          textClassName="!text-white"
        />
        <Text
          className="font-fmedium text-sm underline text-white"
          onPress={() => router.push("/(auth)/forgot-password")}
        >
          Mot de passe oublié ?
        </Text>
      </View>
    </SafeAreaView>
  );
}
