import CartCard from "@/components/cart-card";
import TopNavigation from "@/components/top-navigation";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PRODUCTS } from "../home";
import DividerDashed from "@/components/divider-dashed";
import Button from "@/components/button/button";
import { useRouter } from "expo-router";

export default function Cart() {
  const router = useRouter();
  return (
    <SafeAreaView className="">
      <TopNavigation
        title="Mon panier"
        description=" Retrouve ici tous tes produits préférés. Ton panier t’attend pour le paiement !"
      />
      <View className="flex px-5 h-screen">
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
          ListFooterComponent={
            <View className="bg-[#fff] w-full  p-5 rounded-xl border-2 border-primary">
              <View className="flex flex-row justify-between">
                <Text className="font-fmedium ">Sous-total</Text>
                <Text className="font-fbold ">2000 Ar</Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="font-fmedium ">Livraison</Text>
                <Text className="font-fbold ">3000 Ar</Text>
              </View>
              <DividerDashed className="!border-[#000]" />
              <View className="flex flex-row justify-between">
                <Text className="font-fbold  text-xl">Total</Text>
                <Text className="font-fbold  text-xl">2000 Ar</Text>
              </View>
              <Button
                className="mt-8"
                label="Procéder au payement"
                onPress={() => router.push("/(client)/cart/payement")}
              />
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
