import { ThemedText } from '@/components/themed-text';
import { AuthButton } from '@/components/ui/auth-button';
import { AuthErrorBanner } from '@/components/ui/auth-error-banner';
import { AuthInput } from '@/components/ui/auth-input';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
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

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function AuthScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { signIn, signUp } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (authMode === 'signup' && !name.trim()) {
      errors.name = 'Please enter your full name.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!isValidEmail(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setFormError(null);
    setFieldErrors({});
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleAuth = async () => {
    setFormError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        const parts = name.trim().split(' ');
        const firstName = parts[0] ?? '';
        const lastName = parts.slice(1).join(' ') || '';
        const result = await signUp(email, password, firstName, lastName);
        if (result) {
          if (!result.session) {
            console.log('LOG: Signup complete, email verification required');
            router.push({
              pathname: '/verify-email',
              params: { email },
            });
          } else {
            console.log('LOG: Signup complete, auto-confirmed');
          }
        }
      } else {
        const result = await signIn(email, password);
        if (result) {
          console.log('LOG: Login complete, waiting for auth redirect');
        }
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.';
      console.log('ERROR: Auth failed:', message);
      setFormError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setName('');
    setFieldErrors({});
    setFormError(null);
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
            <AuthErrorBanner
              message={formError}
              onDismiss={() => setFormError(null)}
            />

            {authMode === 'signup' && (
              <AuthInput
                label="Full Name"
                icon="person-outline"
                placeholder="Enter your full name"
                value={name}
                onChangeText={(v) => {
                  setName(v);
                  clearFieldError('name');
                }}
                autoCapitalize="words"
                error={fieldErrors.name}
              />
            )}

            <AuthInput
              label="Email Address"
              icon="mail-outline"
              placeholder="example@domain.com"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                clearFieldError('email');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={fieldErrors.email}
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
              onChangeText={(v) => {
                setPassword(v);
                clearFieldError('password');
              }}
              autoCapitalize="none"
              showPasswordToggle
              isPasswordVisible={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              error={fieldErrors.password}
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
