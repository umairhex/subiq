import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { ThemedText } from '../themed-text';
import { AuthInput } from './auth-input';
import { ModalActionButtons } from './modal-action-buttons';

interface AddSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (subscription: {
    name: string;
    price: string;
    billingCycle: 'Monthly' | 'Yearly';
    paymentMethod: string;
    startDate: string;
  }) => Promise<void>;
}

export function AddSubscriptionModal({
  visible,
  onClose,
  onAdd,
}: AddSubscriptionModalProps) {
  const { theme } = useAppTheme();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>(
    'Monthly'
  );
  const [paymentMethod, setPaymentMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setPrice('');
    setBillingCycle('Monthly');
    setPaymentMethod('');
    setStartDate('');
  };

  const handleAdd = async () => {
    if (
      !name.trim() ||
      !price.trim() ||
      !paymentMethod.trim() ||
      !startDate.trim()
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    setIsLoading(true);
    try {
      await onAdd({
        name: name.trim(),
        price: price,
        billingCycle,
        paymentMethod: paymentMethod.trim(),
        startDate: startDate.trim(),
      });
      resetForm();
      onClose();
    } catch {
      Alert.alert('Error', 'Failed to add subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <ThemedText
                type="title"
                style={[styles.title, { color: theme.foreground }]}
              >
                Add Subscription
              </ThemedText>
              <ThemedText
                type="default"
                style={[styles.subtitle, { color: theme.mutedForeground }]}
              >
                Track your recurring payments
              </ThemedText>
            </View>

            <View style={styles.form}>
              <AuthInput
                label="Subscription Name"
                icon="card-outline"
                placeholder="e.g., Netflix, Spotify"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <AuthInput
                label="Price"
                icon="cash-outline"
                placeholder="e.g., 15.99"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />

              <View style={styles.billingCycleContainer}>
                <ThemedText
                  type="default"
                  style={[styles.label, { color: theme.foreground }]}
                >
                  Billing Cycle
                </ThemedText>
                <View style={styles.cycleButtons}>
                  <Pressable
                    style={[
                      styles.cycleButton,
                      {
                        backgroundColor:
                          billingCycle === 'Monthly'
                            ? theme.primary
                            : theme.secondary,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setBillingCycle('Monthly')}
                  >
                    <ThemedText
                      type="default"
                      style={[
                        styles.cycleButtonText,
                        {
                          color:
                            billingCycle === 'Monthly'
                              ? theme.primaryForeground
                              : theme.secondaryForeground,
                        },
                      ]}
                    >
                      Monthly
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.cycleButton,
                      {
                        backgroundColor:
                          billingCycle === 'Yearly'
                            ? theme.primary
                            : theme.secondary,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setBillingCycle('Yearly')}
                  >
                    <ThemedText
                      type="default"
                      style={[
                        styles.cycleButtonText,
                        {
                          color:
                            billingCycle === 'Yearly'
                              ? theme.primaryForeground
                              : theme.secondaryForeground,
                        },
                      ]}
                    >
                      Yearly
                    </ThemedText>
                  </Pressable>
                </View>
              </View>

              <AuthInput
                label="Payment Method"
                icon="card-outline"
                placeholder="e.g., Visa **** 4242"
                value={paymentMethod}
                onChangeText={setPaymentMethod}
                autoCapitalize="words"
              />

              <AuthInput
                label="Start Date"
                icon="calendar-outline"
                placeholder="e.g., Jan 15, 2024"
                value={startDate}
                onChangeText={setStartDate}
                autoCapitalize="words"
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
  billingCycleContainer: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  cycleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cycleButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
