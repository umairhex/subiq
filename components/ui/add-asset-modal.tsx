import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { ThemedText } from '../themed-text';
import { AuthInput } from './auth-input';
import { ModalActionButtons } from './modal-action-buttons';

interface AddAssetModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (asset: {
    name: string;
    brand: string;
    purchaseDate: string;
    warrantyEnd: string;
  }) => Promise<void>;
}

export function AddAssetModal({ visible, onClose, onAdd }: AddAssetModalProps) {
  const { theme } = useAppTheme();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyEnd, setWarrantyEnd] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setBrand('');
    setPurchaseDate('');
    setWarrantyEnd('');
  };

  const handleAdd = async () => {
    if (
      !name.trim() ||
      !brand.trim() ||
      !purchaseDate.trim() ||
      !warrantyEnd.trim()
    ) {
      toast.warning('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await onAdd({
        name: name.trim(),
        brand: brand.trim(),
        purchaseDate: purchaseDate.trim(),
        warrantyEnd: warrantyEnd.trim(),
      });
      resetForm();
      onClose();
    } catch {
      toast.error('Failed to add asset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <ThemedText
                type="title"
                style={[styles.title, { color: theme.foreground }]}
              >
                Add Asset
              </ThemedText>
              <ThemedText
                type="default"
                style={[styles.subtitle, { color: theme.mutedForeground }]}
              >
                Track your warranty and item details
              </ThemedText>
            </View>

            <View style={styles.form}>
              <AuthInput
                label="Asset Name"
                icon="cube-outline"
                placeholder="e.g., MacBook Pro, Washing Machine"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <AuthInput
                label="Brand"
                icon="business-outline"
                placeholder="e.g., Apple, Samsung"
                value={brand}
                onChangeText={setBrand}
                autoCapitalize="words"
              />

              <AuthInput
                label="Purchase Date"
                icon="calendar-outline"
                placeholder="e.g., Dec 15, 2023"
                value={purchaseDate}
                onChangeText={setPurchaseDate}
              />

              <AuthInput
                label="Warranty End Date"
                icon="shield-checkmark-outline"
                placeholder="e.g., Dec 15, 2024"
                value={warrantyEnd}
                onChangeText={setWarrantyEnd}
              />
            </View>

            <ModalActionButtons
              onCancel={handleClose}
              onAdd={handleAdd}
              isLoading={isLoading}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    flex: 1,
    gap: 20,
  },
});
