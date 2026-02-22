import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

interface AuthErrorBannerProps {
  message: string | null;
  onDismiss?: () => void;
}

export function AuthErrorBanner({ message, onDismiss }: AuthErrorBannerProps) {
  const { theme } = useAppTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    if (message) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      translateY.setValue(-8);
    }
  }, [message, opacity, translateY]);

  if (!message) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.destructive + '12',
          borderColor: theme.destructive + '30',
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name="alert-circle"
          size={20}
          color={theme.destructive}
          style={styles.icon}
        />
        <Text style={[styles.message, { color: theme.destructive }]}>
          {message}
        </Text>
      </View>
      {onDismiss && (
        <Pressable onPress={onDismiss} hitSlop={8}>
          <Ionicons name="close" size={18} color={theme.destructive} />
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter',
    lineHeight: 20,
    flex: 1,
  },
});
