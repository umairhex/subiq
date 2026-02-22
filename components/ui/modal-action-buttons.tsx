import { useAppTheme } from '@/hooks/use-app-theme';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { AuthButton } from './auth-button';

interface ModalActionButtonsProps {
  onCancel: () => void;
  onAdd: () => void;
  isLoading?: boolean;
  addButtonTitle?: string;
}

export function ModalActionButtons({
  onCancel,
  onAdd,
  isLoading = false,
  addButtonTitle = 'Add',
}: ModalActionButtonsProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={[
          styles.cancelButton,
          {
            backgroundColor: theme.secondary,
            borderColor: theme.border,
          },
        ]}
        onPress={onCancel}
      >
        <ThemedText
          type="default"
          style={[
            styles.cancelButtonText,
            { color: theme.secondaryForeground },
          ]}
        >
          Cancel
        </ThemedText>
      </Pressable>
      <View style={styles.addButtonContainer}>
        <AuthButton
          title={addButtonTitle}
          onPress={onAdd}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 12,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonContainer: {
    flex: 1,
    marginTop: 0,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
