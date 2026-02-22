import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/hooks/use-app-theme';
import {
  CURRENCIES,
  Currency,
  useCurrencyStore,
} from '@/stores/currency-store';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

interface CurrencySelectorProps {
  visible: boolean;
  onClose: () => void;
}

export function CurrencySelector({ visible, onClose }: CurrencySelectorProps) {
  const { theme } = useAppTheme();
  const { currency, setCurrency } = useCurrencyStore();

  const handleCurrencySelect = (selectedCurrency: Currency) => {
    setCurrency(selectedCurrency);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.foreground} />
          </Pressable>
          <ThemedText
            type="title"
            style={[styles.title, { color: theme.foreground }]}
          >
            Select Currency
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {CURRENCIES.map((curr) => (
            <Pressable
              key={curr.code}
              onPress={() => handleCurrencySelect(curr)}
              style={({ pressed }) => [
                styles.currencyItem,
                {
                  backgroundColor: pressed ? theme.input : theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.currencyInfo}>
                <ThemedText
                  type="default"
                  style={[styles.flag, { color: theme.foreground }]}
                >
                  {curr.flag}
                </ThemedText>
                <View style={styles.currencyDetails}>
                  <ThemedText
                    type="default"
                    style={[styles.currencyName, { color: theme.foreground }]}
                  >
                    {curr.name}
                  </ThemedText>
                  <ThemedText
                    type="default"
                    style={[
                      styles.currencyCode,
                      { color: theme.mutedForeground },
                    ]}
                  >
                    {curr.code} • {curr.symbol}
                  </ThemedText>
                </View>
              </View>
              {currency.code === curr.code && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.primary}
                />
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
  },
  placeholder: {
    width: 40,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  currencyDetails: {
    flex: 1,
  },
  currencyName: {
    fontSize: 16,
    marginBottom: 2,
  },
  currencyCode: {
    fontSize: 14,
  },
});
