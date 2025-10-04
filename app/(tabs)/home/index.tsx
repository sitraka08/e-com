import SearchBar from "@/components/search-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1">
      <SearchBar />
    </SafeAreaView>
  );
}
