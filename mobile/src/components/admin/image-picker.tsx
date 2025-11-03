import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon, X } from "lucide-react-native";

interface ImagePickerComponentProps {
  value: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  error?: string;
}

export default function ImagePickerComponent({
  value = [],
  onChange,
  maxImages = 5,
  error,
}: ImagePickerComponentProps) {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert(
        "Permissions requises",
        "Nous avons besoin des permissions pour accéder à votre caméra et galerie."
      );
      return false;
    }
    return true;
  };

  const pickFromGallery = async () => {
    if (value.length >= maxImages) {
      Alert.alert(
        "Limite atteinte",
        `Vous ne pouvez ajouter que ${maxImages} images maximum.`
      );
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxImages - value.length,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        onChange([...value, ...newImages]);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
      console.error("Error picking image:", error);
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    if (value.length >= maxImages) {
      Alert.alert(
        "Limite atteinte",
        `Vous ne pouvez ajouter que ${maxImages} images maximum.`
      );
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        const newImage = result.assets[0].uri;
        onChange([...value, newImage]);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de prendre une photo");
      console.error("Error taking photo:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <View className="mb-4">
      <Text className="text-base font-fmedium text-gray-700 mb-2">
        Images du produit ({value.length}/{maxImages})
      </Text>

      {value.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
        >
          {value.map((uri, index) => (
            <View key={index} className="mr-2 relative">
              <Image
                source={{ uri }}
                className="w-24 h-24 rounded-lg"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => removeImage(index)}
                className="absolute -top-0 -right-2 bg-red-500 rounded-full p-1"
              >
                <X size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {value.length < maxImages && (
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={pickFromGallery}
            disabled={loading}
            className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl border border-dashed ${
              loading
                ? "border-gray-300 bg-gray-50"
                : "border-primary bg-primary/5"
            }`}
          >
            <ImageIcon size={17} color={loading ? "#9CA3AF" : "#0174D8"} />
            <Text
              className={`ml-2 text-xs font-fmedium ${
                loading ? "text-gray-400" : "text-primary"
              }`}
            >
              Galerie
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePhoto}
            disabled={loading}
            className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl border border-dashed ${
              loading
                ? "border-gray-300 bg-gray-50"
                : "border-primary bg-primary/5"
            }`}
          >
            <Camera size={17} color={loading ? "#9CA3AF" : "#0174D8"} />
            <Text
              className={`ml-2 text-xs font-fmedium ${
                loading ? "text-gray-400" : "text-primary"
              }`}
            >
              Caméra
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <Text className="text-sm font-fregular text-red-500 mt-1">{error}</Text>
      )}

      <Text className="text-xs font-fregular text-gray-500 mt-2">
        Formats acceptés: JPG, PNG, GIF, WebP. Max 5MB par image.
      </Text>
    </View>
  );
}
