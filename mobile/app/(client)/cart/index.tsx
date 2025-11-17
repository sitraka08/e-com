import CartCard from "@/components/cart-card";
import TopNavigation from "@/components/top-navigation";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DividerDashed from "@/components/divider-dashed";
import Button from "@/components/button/button";
import { useRouter } from "expo-router";
import useCartStore, { DELIVERY_FEE } from "@/stores/useCartStore";
import EmptyState from "@/components/admin/empty-state";
import { Save, Bookmark } from "lucide-react-native";
import { useSavedCartMutations } from "@/hooks/useSavedCarts";
import { useState } from "react";

export default function Cart() {
  const router = useRouter();
  const { cart, getTotal, getTotalPayd, clearCart } = useCartStore();
  const { createSavedCart } = useSavedCartMutations();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [cartName, setCartName] = useState("");

  const subtotal = getTotal();
  const total = getTotalPayd();

  const handleSaveCart = () => {
    if (!cartName.trim()) return;

    const cartItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      productName: item.name,
      productPrice: item.price,
      productImage: Array.isArray(item.images) ? item.images[0] : "",
    }));

    createSavedCart.mutate(
      { name: cartName, items: cartItems },
      {
        onSuccess: () => {
          setShowSaveModal(false);
          setCartName("");
        },
      }
    );
  };

  return (
    <SafeAreaView className="">
      <TopNavigation
        title="Mon panier"
        description=" Retrouve ici tous tes produits préférés. Ton panier t'attend pour le paiement !"
        rightAction={
          cart.length > 0 ? (
            <TouchableOpacity
              onPress={() => router.push("/(client)/cart/saved")}
              className="mr-4"
            >
              <Bookmark size={24} color="#0174D8" />
            </TouchableOpacity>
          ) : undefined
        }
      />
      <View className="flex px-5 h-screen">
        {cart.length > 0 ? (
          <FlatList
            data={cart}
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
                  <Text className="font-fbold ">
                    {subtotal.toLocaleString()} Ar
                  </Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="font-fmedium ">Livraison</Text>
                  <Text className="font-fbold ">
                    {DELIVERY_FEE.toLocaleString()} Ar
                  </Text>
                </View>
                <DividerDashed className="!border-[#000]" />
                <View className="flex flex-row justify-between">
                  <Text className="font-fbold  text-xl">Total</Text>
                  <Text className="font-fbold  text-xl">
                    {total.toLocaleString()} Ar
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setShowSaveModal(true)}
                  className="mt-4 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center gap-2"
                >
                  <Save size={18} color="#374151" />
                  <Text className="font-fsemibold text-gray-700">
                    Sauvegarder ce panier
                  </Text>
                </TouchableOpacity>

                <Button
                  className="mt-4"
                  label="Procéder au payement"
                  onPress={() => router.push("/(client)/cart/payement")}
                />
                <Button
                  className="mt-4"
                  label="Vider le panier"
                  variant="destructive"
                  onPress={clearCart}
                />
              </View>
            }
          />
        ) : (
          <EmptyState title="Panier" message="Votre panier est vide" />
        )}
      </View>

      <Modal
        visible={showSaveModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-xl font-fbold text-gray-800 mb-2">
              Sauvegarder le panier
            </Text>
            <Text className="text-sm font-fregular text-gray-600 mb-4">
              Donnez un nom à ce panier pour le retrouver facilement
            </Text>

            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 font-fregular mb-4"
              placeholder="Ex: Courses du weekend"
              value={cartName}
              onChangeText={setCartName}
              autoFocus
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowSaveModal(false);
                  setCartName("");
                }}
                className="flex-1 bg-gray-100 py-3 rounded-xl"
              >
                <Text className="font-fsemibold text-gray-700 text-center">
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveCart}
                disabled={!cartName.trim()}
                className={`flex-1 py-3 rounded-xl ${
                  cartName.trim() ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <Text className="font-fsemibold text-white text-center">
                  Sauvegarder
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
