import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { UserDTO } from '@/types';
import { CheckCircle, Ban, Trash2, UserCheck } from 'lucide-react-native';
import ConfirmSheet from '../confirm-sheet';
import { useUserMutations } from '@/hooks/use-users';

interface UserActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserDTO;
}

export default function UserActionSheet({
  isOpen,
  onClose,
  user,
}: UserActionSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [confirmAction, setConfirmAction] = useState<'validate' | 'suspend' | 'activate' | 'delete' | null>(null);
  const { validateUser, suspendUser, activateUser, deleteUser } = useUserMutations();

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const handleAction = async () => {
    if (!user || !confirmAction) return;
    try {
      switch (confirmAction) {
        case 'validate':
          await validateUser.mutateAsync(user.id);
          break;
        case 'suspend':
          await suspendUser.mutateAsync(user.id);
          break;
        case 'activate':
          await activateUser.mutateAsync(user.id);
          break;
        case 'delete':
          await deleteUser.mutateAsync(user.id);
          break;
      }
      setConfirmAction(null);
      onClose();
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const getConfirmMessage = () => {
    if (!user) return { title: '', message: '' };
    switch (confirmAction) {
      case 'validate':
        return {
          title: 'Valider l\'utilisateur',
          message: `Êtes-vous sûr de vouloir valider ${user.firstName} ${user.lastName} ?`,
        };
      case 'suspend':
        return {
          title: 'Suspendre l\'utilisateur',
          message: `Êtes-vous sûr de vouloir suspendre ${user.firstName} ${user.lastName} ?`,
        };
      case 'activate':
        return {
          title: 'Activer l\'utilisateur',
          message: `Êtes-vous sûr de vouloir activer ${user.firstName} ${user.lastName} ?`,
        };
      case 'delete':
        return {
          title: 'Supprimer l\'utilisateur',
          message: `Êtes-vous sûr de vouloir supprimer définitivement ${user.firstName} ${user.lastName} ?`,
        };
      default:
        return { title: '', message: '' };
    }
  };

  const isLoading = validateUser.isPending || suspendUser.isPending || activateUser.isPending || deleteUser.isPending;

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['50%']}
        enablePanDownToClose
        onClose={onClose}
        index={-1}
        backgroundStyle={{ backgroundColor: '#fff' }}
      >
        <BottomSheetView className="flex-1 px-5">
          <Text className="text-2xl font-fbold text-gray-900 mb-5">
            Actions utilisateur
          </Text>

          {user?.status === 'PENDING' && (
            <TouchableOpacity
              onPress={() => setConfirmAction('validate')}
              className="flex-row items-center p-4 bg-green-50 rounded-xl mb-3"
            >
              <UserCheck size={24} color="#10B981" />
              <Text className="text-green-700 font-fmedium text-base ml-3">
                Valider l'utilisateur
              </Text>
            </TouchableOpacity>
          )}

          {user?.status === 'ACTIVE' && (
            <TouchableOpacity
              onPress={() => setConfirmAction('suspend')}
              className="flex-row items-center p-4 bg-orange-50 rounded-xl mb-3"
            >
              <Ban size={24} color="#F59E0B" />
              <Text className="text-orange-700 font-fmedium text-base ml-3">
                Suspendre l'utilisateur
              </Text>
            </TouchableOpacity>
          )}

          {user?.status === 'SUSPENDED' && (
            <TouchableOpacity
              onPress={() => setConfirmAction('activate')}
              className="flex-row items-center p-4 bg-blue-50 rounded-xl mb-3"
            >
              <CheckCircle size={24} color="#3B82F6" />
              <Text className="text-blue-700 font-fmedium text-base ml-3">
                Activer l'utilisateur
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => setConfirmAction('delete')}
            className="flex-row items-center p-4 bg-red-50 rounded-xl"
          >
            <Trash2 size={24} color="#EF4444" />
            <Text className="text-red-700 font-fmedium text-base ml-3">
              Supprimer l'utilisateur
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>

      <ConfirmSheet
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleAction}
        {...getConfirmMessage()}
        confirmVariant={confirmAction === 'delete' ? 'danger' : 'primary'}
        isLoading={isLoading}
      />
    </>
  );
}
