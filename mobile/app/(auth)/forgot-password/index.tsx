import Button from "@/components/button/button";
import Input from "@/components/input";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OtpInput } from "react-native-otp-entry";
import TopNavigation from "@/components/top-navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordDTO, ForgotPasswordSchema, ResetPasswordDTO, ResetPasswordSchema } from "@/types";
import { useAuthMutation } from "@/hooks/use-auth";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const forgotForm = useForm<ForgotPasswordDTO>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const resetForm = useForm<ResetPasswordDTO>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const { forgotPassword, resetPassword } = useAuthMutation();

  const submitForgotPassword = (data: ForgotPasswordDTO) => {
    setEmail(data.email);
    forgotPassword.mutate(data, {
      onSuccess: () => {
        setStep(2);
      },
    });
  };

  const submitResetPassword = (data: Pick<ResetPasswordDTO, 'newPassword'>) => {
    const resetData: ResetPasswordDTO = {
      email,
      otp,
      newPassword: data.newPassword,
    };
    resetPassword.mutate(resetData);
  };

  return (
    <SafeAreaView className="flex-1 p-10 bg-primary">
      <TopNavigation
        title="Accueil"
        onPress={() => router.replace("/home")}
      />
      {step === 1 ? (
        <View className="h-full w-full flex items-center pt-14 gap-3">
          <Text className="text-5xl text-white font-ffextrabold my-t">
            QitKif
          </Text>
          <Text className="text-2xl text-white font-ffextrabold">
            Mot de passe oublié
          </Text>
          <Text className="text-white text-sm font-fregular text-center">
            Entrez votre email pour recevoir un code de réinitialisation
          </Text>
          <Input
            form={forgotForm}
            name="email"
            label="Email"
            placeholder="qitkif@example.com"
          />

          <Button
            label="Envoyer le code"
            className="!bg-white  w-full h-14 mt-12"
            textClassName="!text-primary"
            onPress={forgotForm.handleSubmit(submitForgotPassword)}
            loading={forgotPassword.isPending}
          />
          <Button
            onPress={() => router.push("/login")}
            label="Se connecter"
            className="border border-white  w-full h-14"
            textClassName="!text-white"
          />
        </View>
      ) : (
        <View className="h-full w-full flex items-center pt-14 gap-3">
          <Text className="text-5xl text-white font-ffextrabold my-t">
            QitKif
          </Text>
          <Text className="text-2xl text-white font-ffextrabold">OTP</Text>
          <Text className="text-white text-sm font-fregular text-center">
            Saisis ici le code que nous t'avons envoyé par e-mail.
          </Text>
          <View className="w-[80%] mt-8 mb-4">
            <OtpInput
              numberOfDigits={6}
              onTextChange={setOtp}
              theme={{
                pinCodeTextStyle: {
                  color: "#fff",
                },
                filledPinCodeContainerStyle: {
                  backgroundColor: "#ffffff46",
                },
                pinCodeContainerStyle: {
                  backgroundColor: "#ffffff46",
                },
              }}
            />
          </View>
          <Input
            form={resetForm}
            name="newPassword"
            label="Nouveau mot de passe"
            type="password"
          />

          <Button
            label="Valider"
            className="!bg-white  w-full h-14 mt-5"
            textClassName="!text-primary"
            onPress={resetForm.handleSubmit(submitResetPassword)}
            loading={resetPassword.isPending}
          />
          <Button
            onPress={() => router.push("/login")}
            label="Se connecter"
            className="border border-white  w-full h-14"
            textClassName="!text-white"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
