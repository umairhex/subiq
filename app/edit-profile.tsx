import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import { toast } from 'sonner-native';

import { ThemedText } from '@/components/themed-text';
import { AuthButton } from '@/components/ui/auth-button';
import { AuthInput } from '@/components/ui/auth-input';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useProfile, useUpdateProfile } from '@/hooks/use-profile';

export default function EditProfileScreen() {
  const { theme } = useAppTheme();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name ?? '');
      setLastName(profile.last_name ?? '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.warning('Please fill in both fields');
      return;
    }

    try {
      await updateProfile.mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      console.log('LOG: Profile updated');
      router.back();
    } catch (error) {
      console.log('ERROR: Failed to save profile:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 32 }}>
              <ThemedText
                type="title"
                style={{
                  fontSize: 28,
                  fontWeight: '700',
                  marginBottom: 8,
                  color: theme.foreground,
                }}
              >
                Edit Profile
              </ThemedText>
              <ThemedText
                type="default"
                style={{
                  fontSize: 16,
                  color: theme.mutedForeground,
                }}
              >
                Update your personal information
              </ThemedText>
            </View>

            <View style={{ gap: 20 }}>
              <AuthInput
                label="First Name"
                icon="person-outline"
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                autoComplete="given-name"
              />

              <AuthInput
                label="Last Name"
                icon="person-outline"
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                autoComplete="family-name"
              />
            </View>

            <View style={{ marginTop: 40 }}>
              <AuthButton title="Save Changes" onPress={handleSave} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
