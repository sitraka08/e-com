import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-native-reanimated";
import "../global.css";
import { FONTS } from "@/constants/fonts";

const queryClient = new QueryClient();
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

export default function RootLayout() {
  const [loaded, error] = useFonts({
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
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
