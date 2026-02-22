import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  variant?: 'primary' | 'outline';
}

export function AuthButton({
  title,
  onPress,
  isLoading,
  variant = 'primary',
}: AuthButtonProps) {
  const { theme } = useAppTheme();
  const isOutline = variant === 'outline';

  return (
    <Pressable
      style={[
        styles.submitButton,
        {
          backgroundColor: isOutline ? 'transparent' : theme.primary,
          borderWidth: isOutline ? 1.5 : 0,
          borderColor: isOutline ? theme.primary : undefined,
          opacity: isLoading ? 0.7 : 1,
          shadowColor: isOutline ? 'transparent' : theme.primary,
        },
      ]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator
          color={isOutline ? theme.primary : theme.primaryForeground}
        />
      ) : (
        <>
          <Text
            style={[
              styles.submitButtonText,
              { color: isOutline ? theme.primary : theme.primaryForeground },
            ]}
          >
            {title}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={isOutline ? theme.primary : theme.primaryForeground}
            style={styles.buttonArrow}
          />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    borderRadius: 16,
    marginTop: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  buttonArrow: {
    marginLeft: 8,
  },
});
