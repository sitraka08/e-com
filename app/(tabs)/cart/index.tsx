import CartCard from "@/components/cart-card";
import TopNavigation from "@/components/top-navigation";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PRODUCTS } from "../home";
import DividerDashed from "@/components/divider-dashed";

export default function Cart() {
  return (
    <SafeAreaView className="">
      <TopNavigation title="Mon panier" />
      <View className="flex h-screen px-5 border">
        <FlatList
          data={PRODUCTS}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 120,
            paddingTop: 70,
          }}
          renderItem={({ item }) => (
            <View>
              <DividerDashed />
              <CartCard {...item} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
