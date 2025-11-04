import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon, User } from "lucide-react-native";

interface AvatarPickerProps {
  value: string;
  onChange: (image: string) => void;
  error?: string;
}

export default function AvatarPicker({
  value,
  onChange,
  error,
}: AvatarPickerProps) {
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
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
      console.error("Error picking image:", error);
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de prendre une photo");
      console.error("Error taking photo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mb-4">
      <View className="items-center mb-4">
        <View className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center overflow-hidden border-4 border-primary/20">
          {value ? (
            <Image
              source={{ uri: value }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <User size={60} color="#9CA3AF" />
          )}
        </View>
      </View>

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

      {error && (
        <Text className="text-sm font-fregular text-red-500 mt-1">{error}</Text>
      )}

      <Text className="text-xs font-fregular text-gray-500 mt-2">
        Formats acceptés: JPG, PNG, GIF, WebP. Max 5MB.
      </Text>
    </View>
  );
}
