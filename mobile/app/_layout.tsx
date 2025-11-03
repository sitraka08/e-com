import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-native-reanimated";
import "../global.css";
import { FONTS } from "@/constants/fonts";
import { COLORS } from "@/constants/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

/* eslint-disable */

const queryClient = new QueryClient();
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/home");
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <Text className="text-white text-xl font-fbold">Chargement...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    FThin: FONTS.Thin,
    FExtraLight: FONTS.ExtraLight,
    FLight: FONTS.Light,
    FRegular: FONTS.Regular,
    FMedium: FONTS.Medium,
    FSemiBold: FONTS.SemiBold,
    FBold: FONTS.Bold,
    FExtraBold: FONTS.ExtraBold,
    FBlack: FONTS.Black,
  });

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <View
          className="w-full h-12"
          style={{
            backgroundColor: COLORS.primary,
          }}
        >
          <StatusBar style="light" />
        </View>
        <AuthGuard>
          <Stack>
            <Stack.Screen name="(client)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          </Stack>
        </AuthGuard>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
