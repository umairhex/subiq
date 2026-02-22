import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { toast } from 'sonner-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { Subscription } from '../dashboard/subscription-card';
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
    icon: string;
  }) => Promise<void>;
  editingSubscription?: Subscription | null;
}

export function AddSubscriptionModal({
  visible,
  onClose,
  onAdd,
  editingSubscription,
}: AddSubscriptionModalProps) {
  const { theme } = useAppTheme();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>(
    'Monthly'
  );
  const [paymentMethod, setPaymentMethod] = useState('');
  const [icon, setIcon] = useState('card-outline');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingSubscription) {
      setName(editingSubscription.name);
      setPrice(editingSubscription.price.toString());
      setBillingCycle(editingSubscription.billingCycle);
      setPaymentMethod(editingSubscription.paymentMethod);
      setIcon(editingSubscription.icon);

      const startDate = new Date(editingSubscription.startDate);
      setYear(startDate.getFullYear());
      setMonth(startDate.getMonth() + 1);
      setDay(startDate.getDate());
    } else {
      resetForm();
    }
  }, [editingSubscription]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setBillingCycle('Monthly');
    setPaymentMethod('');
    setIcon('card-outline');
    setYear(new Date().getFullYear());
    setMonth(new Date().getMonth() + 1);
    setDay(new Date().getDate());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAdd = async () => {
    if (!name.trim() || !price.trim()) {
      toast.warning('Please fill in all required fields');
      return;
    }

    if (!year || !month || !day) {
      toast.warning('Please select a valid date');
      return;
    }

    const dateObj = new Date(year, month - 1, day);
    if (isNaN(dateObj.getTime())) {
      toast.warning('Please enter a valid date');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.warning('Please enter a valid price');
      return;
    }

    setIsLoading(true);
    try {
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      await onAdd({
        name: name.trim(),
        price: price,
        billingCycle,
        paymentMethod: paymentMethod.trim(),
        startDate: formattedDate,
        icon,
      });
      resetForm();
      onClose();
    } catch {
      toast.error('Failed to add subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const handleYearChange = (text: string) => {
    const numValue = parseInt(text);
    if (!isNaN(numValue) && numValue >= 1900 && numValue <= 2100) {
      setYear(numValue);

      const maxDays = getDaysInMonth(numValue, month);
      if (day > maxDays) {
        setDay(maxDays);
      }
    }
  };

  const handleMonthChange = (text: string) => {
    const numValue = parseInt(text);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
      setMonth(numValue);

      const maxDays = getDaysInMonth(year, numValue);
      if (day > maxDays) {
        setDay(maxDays);
      }
    }
  };

  const handleDayChange = (text: string) => {
    const numValue = parseInt(text);
    const maxDays = getDaysInMonth(year, month);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= maxDays) {
      setDay(numValue);
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
                {editingSubscription ? 'Edit Subscription' : 'Add Subscription'}
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

              <View
                style={[styles.billingCycleContainer, { marginBottom: 20 }]}
              >
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
                placeholder="e.g., Visa **** 4242 (optional)"
                value={paymentMethod}
                onChangeText={setPaymentMethod}
                autoCapitalize="words"
              />

              <View style={[styles.inputGroup, { marginBottom: 20 }]}>
                <ThemedText
                  type="default"
                  style={[styles.inputLabel, { color: theme.foreground }]}
                >
                  Start Date
                </ThemedText>
                <View style={styles.dateInputsContainer}>
                  <View style={styles.dateInputWrapper}>
                    <ThemedText
                      type="default"
                      style={[
                        styles.dateInputLabel,
                        { color: theme.mutedForeground },
                      ]}
                    >
                      Year
                    </ThemedText>
                    <TextInput
                      style={[
                        styles.dateInput,
                        {
                          backgroundColor: theme.input,
                          borderColor: theme.border,
                          color: theme.foreground,
                        },
                      ]}
                      placeholder="2024"
                      value={year.toString()}
                      onChangeText={handleYearChange}
                      keyboardType="number-pad"
                      placeholderTextColor={theme.mutedForeground}
                    />
                  </View>
                  <View style={styles.dateInputWrapper}>
                    <ThemedText
                      type="default"
                      style={[
                        styles.dateInputLabel,
                        { color: theme.mutedForeground },
                      ]}
                    >
                      Month
                    </ThemedText>
                    <TextInput
                      style={[
                        styles.dateInput,
                        {
                          backgroundColor: theme.input,
                          borderColor: theme.border,
                          color: theme.foreground,
                        },
                      ]}
                      placeholder="01"
                      value={month.toString().padStart(2, '0')}
                      onChangeText={handleMonthChange}
                      keyboardType="number-pad"
                      placeholderTextColor={theme.mutedForeground}
                    />
                  </View>
                  <View style={styles.dateInputWrapper}>
                    <ThemedText
                      type="default"
                      style={[
                        styles.dateInputLabel,
                        { color: theme.mutedForeground },
                      ]}
                    >
                      Day
                    </ThemedText>
                    <TextInput
                      style={[
                        styles.dateInput,
                        {
                          backgroundColor: theme.input,
                          borderColor: theme.border,
                          color: theme.foreground,
                        },
                      ]}
                      placeholder="15"
                      value={day.toString().padStart(2, '0')}
                      onChangeText={handleDayChange}
                      keyboardType="number-pad"
                      placeholderTextColor={theme.mutedForeground}
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.inputGroup, { marginBottom: 20 }]}>
                <ThemedText
                  type="default"
                  style={[styles.inputLabel, { color: theme.foreground }]}
                >
                  Icon
                </ThemedText>
                <View style={styles.iconGrid}>
                  {[
                    'card-outline',
                    'tv-outline',
                    'musical-notes-outline',
                    'game-controller-outline',
                    'cloud-outline',
                    'book-outline',
                    'fitness-outline',
                    'cafe-outline',
                    'newspaper-outline',
                    'briefcase-outline',
                    'car-outline',
                    'home-outline',
                  ].map((iconName) => (
                    <Pressable
                      key={iconName}
                      style={[
                        styles.iconOption,
                        {
                          backgroundColor:
                            icon === iconName ? theme.primary : theme.input,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => setIcon(iconName)}
                    >
                      <Ionicons
                        name={iconName as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={
                          icon === iconName
                            ? theme.primaryForeground
                            : theme.foreground
                        }
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <ModalActionButtons
              onCancel={handleClose}
              onAdd={handleAdd}
              isLoading={isLoading}
              addButtonTitle={editingSubscription ? 'Update' : 'Add'}
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
    gap: 0,
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
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateInputsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInputWrapper: {
    flex: 1,
  },
  dateInputLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
