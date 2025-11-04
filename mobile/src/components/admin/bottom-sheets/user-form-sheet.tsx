import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/button/button';
import Input from '@/components/input';
import { UserDTO, UpdateUserDTO, UpdateUserSchema } from '@/types';
import { useUserMutations } from '@/hooks/use-users';

interface UserFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserDTO;
}

export default function UserFormSheet({
  isOpen,
  onClose,
  user,
}: UserFormSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { updateUser } = useUserMutations();

  const form = useForm<UpdateUserDTO>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      if (user) {
        form.reset({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      }
    } else {
      bottomSheetRef.current?.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user]);

  const onSubmit = async (data: UpdateUserDTO) => {
    if (!user) return;
    try {
      await updateUser.mutateAsync({ id: user.id, data });
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['70%']}
      enablePanDownToClose
      onClose={onClose}
      index={-1}
      backgroundStyle={{ backgroundColor: '#fff' }}
    >
      <BottomSheetScrollView className="flex-1 px-5">
        <Text className="text-2xl font-fbold text-gray-900 mb-5">
          Modifier l'utilisateur
        </Text>

        <Input
          form={form}
          name="firstName"
          label="Prénom"
          placeholder="Prénom"
          isAdmin
        />

        <Input
          form={form}
          name="lastName"
          label="Nom"
          placeholder="Nom"
          className="mt-3"
          isAdmin
        />

        <Input
          form={form}
          name="email"
          label="Email"
          placeholder="email@example.com"
          className="mt-3"
          isAdmin
        />

        <View className="mt-6 mb-4">
          <Button
            label="Mettre à jour"
            onPress={form.handleSubmit(onSubmit)}
            loading={updateUser.isPending}
            className="!bg-primary w-full h-14"
            textClassName="!text-white"
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
