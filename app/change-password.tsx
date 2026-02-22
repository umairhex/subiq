import { ThemedText } from '@/components/themed-text';
import { AuthButton } from '@/components/ui/auth-button';
import { AuthInput } from '@/components/ui/auth-input';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { updatePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const validatePasswords = () => {
    if (!currentPassword.trim()) {
      toast.warning('Please enter your current password');
      return false;
    }

    if (!newPassword.trim()) {
      toast.warning('Please enter a new password');
      return false;
    }

    if (newPassword.length < 8) {
      toast.warning('New password must be at least 8 characters long');
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.warning('New passwords do not match');
      return false;
    }

    if (currentPassword === newPassword) {
      toast.warning('New password must be different from current password');
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) return;

    setIsLoading(true);

    try {
      const success = await updatePassword(newPassword);
      if (success) {
        toast.success('Your password has been changed successfully!', {
          onAutoClose: () => router.back(),
          onDismiss: () => router.back(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              onPress={handleBack}
              style={[styles.backButton, { borderColor: theme.border }]}
            >
              <Ionicons name="arrow-back" size={24} color={theme.foreground} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.primary + '20' },
              ]}
            >
              <Ionicons name="key" size={48} color={'#ffff'} />
            </View>

            <ThemedText
              type="title"
              style={[styles.title, { color: theme.foreground }]}
            >
              Change Password
            </ThemedText>

            <ThemedText
              type="default"
              style={[styles.description, { color: theme.mutedForeground }]}
            >
              Keep your account secure by updating your password regularly.
            </ThemedText>

            <View style={styles.form}>
              <AuthInput
                label="Current Password"
                icon="lock-closed-outline"
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                showPasswordToggle
                isPasswordVisible={isCurrentPasswordVisible}
                onTogglePassword={() =>
                  setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                }
              />
              <AuthInput
                label="New Password"
                icon="lock-open-outline"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                showPasswordToggle
                isPasswordVisible={isNewPasswordVisible}
                onTogglePassword={() =>
                  setIsNewPasswordVisible(!isNewPasswordVisible)
                }
              />

              <AuthInput
                label="Confirm New Password"
                icon="checkmark-circle-outline"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                showPasswordToggle
                isPasswordVisible={isConfirmPasswordVisible}
                onTogglePassword={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
              />

              <View style={styles.passwordRequirements}>
                <ThemedText
                  type="default"
                  style={[styles.requirementTitle, { color: theme.foreground }]}
                >
                  Password Requirements:
                </ThemedText>
                <ThemedText
                  type="default"
                  style={[
                    styles.requirementText,
                    { color: theme.mutedForeground },
                  ]}
                >
                  • At least 8 characters long
                </ThemedText>
                <ThemedText
                  type="default"
                  style={[
                    styles.requirementText,
                    { color: theme.mutedForeground },
                  ]}
                >
                  • Different from current password
                </ThemedText>
              </View>

              <View style={styles.buttonContainer}>
                <AuthButton
                  title="Update Password"
                  onPress={handleChangePassword}
                  isLoading={isLoading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  passwordRequirements: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  requirementTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 24,
  },
});
