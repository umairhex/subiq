import { ThemedText } from '@/components/themed-text';
import { AuthButton } from '@/components/ui/auth-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import { supabase } from '@/lib/supabase';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        console.log(
          'ERROR: Failed to resend verification email:',
          error.message
        );
        toast.error('Resend failed', { description: error.message });
      } else {
        console.log('LOG: Verification email resent to', email);
        toast.success('A new verification email has been sent.');
      }
    } catch (err) {
      console.log('ERROR: Resend threw:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: theme.primary + '20',
              borderColor: theme.primary + '30',
            },
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={48}
            color={'#fff'}
            style={styles.icon}
          />
        </View>

        <ThemedText
          type="title"
          style={[styles.title, { color: theme.foreground }]}
        >
          Confirm your signup
        </ThemedText>

        <ThemedText
          type="default"
          style={[styles.subtitle, { color: theme.mutedForeground }]}
        >
          Follow this link to confirm your user:
        </ThemedText>

        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.email,
            {
              color: theme.foreground,
              backgroundColor: theme.card,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.border,
            },
          ]}
        >
          {email || 'your email address'}
        </ThemedText>

        <ThemedText
          type="default"
          style={[styles.description, { color: theme.mutedForeground }]}
        >
          Check your email and click the confirmation link to complete your
          signup.
        </ThemedText>

        <View style={styles.actions}>
          <AuthButton
            title="Resend Email"
            onPress={handleResend}
            isLoading={isResending}
            variant="outline"
          />

          <AuthButton
            title="Back to Login"
            onPress={() => router.replace('/')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
  },
  icon: {
    zIndex: 1,
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
});
