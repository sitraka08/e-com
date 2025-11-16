import Button from "@/components/button/button";
import Input from "@/components/input";
import TopNavigation from "@/components/top-navigation";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterDTO, RegisterSchema } from "@/types";
import { useAuthMutation } from "@/hooks/use-auth";
import { Checkbox } from "@/components/checkbox";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [isSeller, setIsSeller] = useState(false);
  const form = useForm<RegisterDTO>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      isSeller: false,
    },
  });
  const { register } = useAuthMutation();

  const submitAction = (data: RegisterDTO) => {
    register.mutate({ ...data, isSeller });
  };

  return (
    <SafeAreaView className="flex-1 p-10 bg-primary">
      <TopNavigation
        title="Accueil"
        onPress={() => router.replace("/home")}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-full w-full flex items-center gap-3">
          <Text className="text-5xl text-white font-ffextrabold myt8">
            QitKif
          </Text>
          <Text className="text-2xl text-white font-ffextrabold">
            Créer un compte
          </Text>
          <Input
            form={form}
            name="firstName"
            label="Prénom"
            placeholder="Eric"
          />
          <Input
            form={form}
            name="lastName"
            label="Nom"
            placeholder="John"
          />
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

          <View className="w-full mt-2">
            <Checkbox
              checked={isSeller}
              onPress={() => setIsSeller(!isSeller)}
              label="Je souhaite devenir vendeur"
            />
          </View>

          {isSeller && (
            <>
              <Input
                form={form}
                name="storeName"
                label="Nom du magasin"
                placeholder="Mon Magasin"
              />
              <Input
                form={form}
                name="storeDescription"
                label="Description du magasin"
                placeholder="Description de votre magasin..."
              />
            </>
          )}

          <Button
            label="Créer un compte"
            className="!bg-white  w-full h-14 mt-5"
            textClassName="!text-primary"
            onPress={form.handleSubmit(submitAction)}
            loading={register.isPending}
          />
          <Button
            label="Se connecter"
            className="border border-white  w-full h-14"
            textClassName="!text-white"
            onPress={() => router.push("/login")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
