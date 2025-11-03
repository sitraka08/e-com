import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-native-reanimated";
import "../global.css";
import { FONTS } from "@/constants/fonts";
import { COLORS } from "@/constants/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();
/* eslint-disable */
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

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
        <Stack>
          <Stack.Screen name="(client)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
