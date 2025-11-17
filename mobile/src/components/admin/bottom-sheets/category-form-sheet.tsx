import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Button from "@/components/button/button";
import { CategoryDTO } from "@/types";
import { useCategoryMutations } from "@/hooks/use-categories";
import { COLORS } from "@/constants/colors";

interface CategoryFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  category?: CategoryDTO;
}

export default function CategoryFormSheet({
  isOpen,
  onClose,
  category,
}: CategoryFormSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { createCategory, updateCategory } = useCategoryMutations();
  const isEditMode = !!category;
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      if (category) {
        setName(category.name);
        setSlug(category.slug);
        setDescription(category.description || "");
      } else {
        resetForm();
      }
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen, category]);

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setErrors({});
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditMode || !slug) {
      setSlug(generateSlug(value));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Le nom est requis";
    if (!slug.trim()) newErrors.slug = "Le slug est requis";
    if (slug && !/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug =
        "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const data = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
      };

      if (isEditMode && category) {
        await updateCategory.mutateAsync({ id: category.id, data });
      } else {
        await createCategory.mutateAsync(data);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["65%"]}
      enablePanDownToClose
      onClose={onClose}
      index={-1}
      backgroundStyle={{
        backgroundColor: "#edf4fc",
        borderWidth: 1,
        borderColor: COLORS.primary,
      }}
    >
      <BottomSheetScrollView
        className="flex-1 px-5 gap-2"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text className="text-xl font-fbold text-primary mb-5">
          {isEditMode ? "Modifier la catégorie" : "Nouvelle catégorie"}
        </Text>

        <View className="mb-4">
          <Text className="text-sm font-fmedium text-gray-700 mb-2">
            Nom *
          </Text>
          <TextInput
            value={name}
            onChangeText={handleNameChange}
            placeholder="Ex: Électronique"
            className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
          />
          {errors.name && (
            <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-fmedium text-gray-700 mb-2">
            Slug *
          </Text>
          <TextInput
            value={slug}
            onChangeText={setSlug}
            placeholder="Ex: electronique"
            className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
          />
          {errors.slug && (
            <Text className="text-red-500 text-xs mt-1">{errors.slug}</Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="text-sm font-fmedium text-gray-700 mb-2">
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description de la catégorie (optionnel)"
            multiline
            numberOfLines={3}
            className="border border-gray-300 rounded-lg px-4 py-3 font-fregular bg-white"
            textAlignVertical="top"
          />
        </View>

        <View className="mb-4">
          <Button
            label={isEditMode ? "Mettre à jour" : "Créer"}
            onPress={handleSubmit}
            loading={createCategory.isPending || updateCategory.isPending}
            className="!bg-primary w-full h-14"
            textClassName="!text-white"
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
