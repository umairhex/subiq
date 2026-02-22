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
          style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}
        >
          <Ionicons name="mail-outline" size={48} color={theme.primary} />
        </View>

        <ThemedText
          type="title"
          style={[styles.title, { color: theme.foreground }]}
        >
          Check Your Email
        </ThemedText>

        <ThemedText
          type="default"
          style={[styles.subtitle, { color: theme.mutedForeground }]}
        >
          We&apos;ve sent a verification link to
        </ThemedText>

        <ThemedText
          type="defaultSemiBold"
          style={[styles.email, { color: theme.foreground }]}
        >
          {email || 'your email address'}
        </ThemedText>

        <ThemedText
          type="default"
          style={[styles.description, { color: theme.mutedForeground }]}
        >
          Please open the link in the email to verify your account. Once
          verified, you can log in.
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
