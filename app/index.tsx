import { ThemedText } from '@/components/themed-text';
import { AuthButton } from '@/components/ui/auth-button';
import { AuthInput } from '@/components/ui/auth-input';
import { SocialAuthButtons } from '@/components/ui/social-auth-buttons';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthMode = 'login' | 'signup';

export default function AuthScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (authMode === 'signup' && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
              progressBackgroundColor={theme.background}
            />
          }
        >
          <View style={styles.titleSection}>
            <ThemedText
              type="title"
              style={[styles.mainTitle, { color: theme.foreground }]}
            >
              {authMode === 'signup' ? 'Join SUBIQ' : 'Welcome Back'}
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.subTitle, { color: theme.mutedForeground }]}
            >
              {authMode === 'signup'
                ? 'AI-driven subscription auditing for your peace of mind.'
                : 'Unlock the power of AI to manage your subscriptions effortlessly.'}
            </ThemedText>
          </View>

          <View style={styles.formSection}>
            {authMode === 'signup' && (
              <AuthInput
                label="Full Name"
                icon="person-outline"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}

            <AuthInput
              label="Email Address"
              icon="mail-outline"
              placeholder="example@domain.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <AuthInput
              label="Password"
              icon="lock-closed-outline"
              placeholder={
                authMode === 'signup'
                  ? 'Create a strong password'
                  : 'Enter your password'
              }
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              showPasswordToggle
              isPasswordVisible={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {authMode === 'login' && (
              <View style={styles.forgotPasswordContainer}>
                <Pressable onPress={() => router.push('/forgot-password')}>
                  <ThemedText
                    type="default"
                    style={[
                      styles.forgotPasswordText,
                      { color: theme.primary },
                    ]}
                  >
                    Forgot Password?
                  </ThemedText>
                </Pressable>
              </View>
            )}

            <AuthButton
              title={authMode === 'signup' ? 'Sign Up' : 'Log In'}
              onPress={handleAuth}
              isLoading={isLoading}
            />
          </View>

          <SocialAuthButtons />

          {authMode === 'signup' && (
            <ThemedText
              type="default"
              style={[styles.termsText, { color: theme.mutedForeground }]}
            >
              By signing up, you agree to our{' '}
              <ThemedText
                type="link"
                style={{ textDecorationLine: 'underline' }}
              >
                Terms of Service
              </ThemedText>{' '}
              and{' '}
              <ThemedText
                type="link"
                style={{ textDecorationLine: 'underline' }}
              >
                Privacy Policy
              </ThemedText>
              .
            </ThemedText>
          )}

          <View style={styles.footerContainer}>
            <ThemedText
              type="default"
              style={[styles.footerText, { color: theme.foreground }]}
            >
              {authMode === 'signup'
                ? 'Already have an account? '
                : "Don't have an account? "}
            </ThemedText>
            <Pressable onPress={toggleAuthMode}>
              <ThemedText
                type="defaultSemiBold"
                style={[styles.footerLink, { color: theme.primary }]}
              >
                {authMode === 'signup' ? 'Log In' : 'Sign Up'}
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 60,
  },
  titleSection: {
    marginBottom: 32,
  },
  mainTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subTitle: {
    lineHeight: 26,
    opacity: 0.8,
    fontSize: 16,
    fontWeight: 'normal',
  },
  formSection: {
    marginBottom: 32,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
  footerLink: {
    fontSize: 16,
  },
});
