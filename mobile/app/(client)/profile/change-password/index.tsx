import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserMutations } from "@/hooks/use-users";
import Input from "@/components/input";
import Button from "@/components/button/button";
import TopNavigation from "@/components/top-navigation";

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

export default function ChangePassword() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { updateUser } = useUserMutations();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (!user) return;

    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: {
          password: data.newPassword,
        },
      });

      form.reset();
      router.back();
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <TopNavigation
        title="Changer le mot de passe"
        description="Modifiez votre mot de passe"
        showBackButton
      />

      <ScrollView className="flex-1 px-5 mt-16">
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <View className="gap-4">
            <Input
              form={form}
              name="currentPassword"
              label="Mot de passe actuel"
              placeholder="Entrez votre mot de passe actuel"
              type="password"
              isAdmin
            />

            <Input
              form={form}
              name="newPassword"
              label="Nouveau mot de passe"
              placeholder="Entrez votre nouveau mot de passe"
              type="password"
              isAdmin
            />

            <Input
              form={form}
              name="confirmPassword"
              label="Confirmer le mot de passe"
              placeholder="Confirmez votre nouveau mot de passe"
              type="password"
              isAdmin
            />

            <Text className="text-xs font-fregular text-gray-500 mt-2">
              Le mot de passe doit contenir au moins 8 caractères avec une
              majuscule, une minuscule et un chiffre.
            </Text>
          </View>

          <Button
            label="Changer le mot de passe"
            onPress={form.handleSubmit(onSubmit)}
            loading={updateUser.isPending}
            className="!bg-primary w-full h-14 mt-6"
            textClassName="!text-white"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
