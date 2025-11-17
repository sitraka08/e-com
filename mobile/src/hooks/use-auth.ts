import { useRouter } from "expo-router";
import { authService } from "@/services/auth.services";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  AuthResponse,
  LoginDTO,
  RegisterDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from "@/types";
import { makeMutation } from "@/utils/tanstaq";

export const useAuthMutation = () => {
  const router = useRouter();
  const { setAuth, clearAuth } = useAuthStore();

  const login = makeMutation<LoginDTO, AuthResponse>({
    queryKey: ["login"],
    mutationFn: authService.login,
    onSuccessCallback: async (response) => {
      if (response.data) {
        await setAuth(
          response.data.user,
          response.data.tokens,
          response.data.seller
        );

        if (response.data.user.role === "ADMIN") {
          router.replace("/(admin)/dashboard");
          return;
        }

        if (response.data.user.role === "SELLER") {
          router.replace("/(seller)/dashboard");
          return;
        }

        router.replace("/home");
      }
    },
  });

  const register = makeMutation<RegisterDTO, AuthResponse>({
    queryKey: ["register"],
    mutationFn: authService.register,
    onSuccessCallback: async (response) => {
      if (response.data) {
        await setAuth(
          response.data.user,
          response.data.tokens,
          response.data.seller
        );

        if (response.data.user.role === "SELLER") {
          router.replace("/(seller)/dashboard");
          return;
        }

        router.replace("/home");
      }
    },
  });

  const logout = makeMutation<void, void>({
    queryKey: ["logout"],
    mutationFn: authService.logout,
    onSuccessCallback: async () => {
      await clearAuth();
      router.replace("/login");
    },
  });

  const forgotPassword = makeMutation<ForgotPasswordDTO, { message: string }>({
    queryKey: ["forgot-password"],
    mutationFn: authService.forgotPassword,
  });

  const resetPassword = makeMutation<ResetPasswordDTO, { message: string }>({
    queryKey: ["reset-password"],
    mutationFn: authService.resetPassword,
    onSuccessCallback: () => {
      router.replace("/login");
    },
  });

  return {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };
};
