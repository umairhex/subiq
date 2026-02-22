import { CurrencySelector } from '@/components/settings/currency-selector';
import { SettingsItem } from '@/components/settings/settings-item';
import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useCurrencyStore } from '@/stores/currency-store';
import { useThemeStore } from '@/stores/theme-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { theme: overrideTheme, setTheme } = useThemeStore();
  const { currency } = useCurrencyStore();

  const [showCurrencySelector, setShowCurrencySelector] = useState(false);

  const toggleTheme = async () => {
    const newMode =
      overrideTheme === 'light'
        ? 'dark'
        : overrideTheme === 'dark'
          ? 'system'
          : 'light';
    setTheme(newMode);
  };
  const getThemeSubtitle = () => {
    switch (overrideTheme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System Default';
      default:
        return 'System Default';
    }
  };

  const getThemeIcon = () => {
    switch (overrideTheme) {
      case 'light':
        return 'sunny-outline';
      case 'dark':
        return 'moon-outline';
      case 'system':
        return 'contrast-outline';
      default:
        return 'moon-outline';
    }
  };

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={['top']}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText
            type="title"
            style={[styles.title, { color: theme.foreground }]}
          >
            Settings
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText
            type="default"
            style={[styles.sectionLabel, { color: theme.mutedForeground }]}
          >
            PROFILE
          </ThemedText>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Pressable
              style={styles.profileHeader}
              onPress={() => router.push('/edit-profile')}
            >
              <View style={styles.profileMain}>
                <View
                  style={[
                    styles.avatarContainer,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.muted + '20',
                    },
                  ]}
                >
                  <Ionicons name="person" size={32} color={theme.primary} />
                </View>
                <View style={styles.profileDetails}>
                  <ThemedText
                    type="title"
                    style={[styles.profileName, { color: theme.foreground }]}
                  >
                    John Doe
                  </ThemedText>
                  <ThemedText
                    type="default"
                    style={[
                      styles.profileEmail,
                      { color: theme.mutedForeground },
                    ]}
                  >
                    john.doe@example.com
                  </ThemedText>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.mutedForeground}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText
            type="default"
            style={[styles.sectionLabel, { color: theme.mutedForeground }]}
          >
            APP PREFERENCES
          </ThemedText>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <SettingsItem
              icon="cash-outline"
              title="Currency"
              subtitle={`${currency.code} (${currency.symbol})`}
              onPress={() => setShowCurrencySelector(true)}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="On"
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsItem
              icon={getThemeIcon()}
              title="Dark Mode"
              subtitle={getThemeSubtitle()}
              onPress={toggleTheme}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText
            type="default"
            style={[styles.sectionLabel, { color: theme.mutedForeground }]}
          >
            DATA & PRIVACY
          </ThemedText>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <SettingsItem icon="download-outline" title="Export Data" />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsItem
              icon="key-outline"
              title="Change Password"
              onPress={() => router.push('/change-password')}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsItem
              icon="help-circle-outline"
              title="Forgot Password"
              subtitle="Reset your password"
              onPress={() => router.push('/forgot-password')}
            />
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 40 }]}>
          <Pressable
            onPress={handleLogout}
            style={[styles.logoutBtn, { borderColor: theme.destructive }]}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={theme.destructive}
            />
            <ThemedText
              type="default"
              style={[styles.logoutText, { color: theme.destructive }]}
            >
              Logout
            </ThemedText>
          </Pressable>
        </View>

        <CurrencySelector
          visible={showCurrencySelector}
          onClose={() => setShowCurrencySelector(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 12,
  },
  profileMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    marginHorizontal: 24,
    opacity: 0.5,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
  },
  logoutText: {
    fontSize: 16,
  },
});
