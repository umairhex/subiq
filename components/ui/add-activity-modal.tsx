import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { toast } from 'sonner-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { ThemedText } from '../themed-text';
import { AuthInput } from './auth-input';
import { ModalActionButtons } from './modal-action-buttons';

interface AddActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (activity: {
    platform: string;
    activityName: string;
    duration: string;
  }) => Promise<void>;
}

export function AddActivityModal({
  visible,
  onClose,
  onAdd,
}: AddActivityModalProps) {
  const { theme } = useAppTheme();
  const [platform, setPlatform] = useState('');
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setPlatform('');
    setActivityName('');
    setDuration('');
  };

  const handleAdd = async () => {
    if (!platform.trim() || !activityName.trim() || !duration.trim()) {
      toast.warning('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await onAdd({
        platform: platform.trim(),
        activityName: activityName.trim(),
        duration: duration.trim(),
      });
      resetForm();
      onClose();
    } catch {
      toast.error('Failed to add activity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <ThemedText
              type="title"
              style={[styles.title, { color: theme.foreground }]}
            >
              Add Activity
            </ThemedText>
            <ThemedText
              type="default"
              style={[styles.subtitle, { color: theme.mutedForeground }]}
            >
              Log your recent activity
            </ThemedText>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Platform"
              icon="tv-outline"
              placeholder="e.g., Netflix, Spotify, YouTube"
              value={platform}
              onChangeText={setPlatform}
              autoCapitalize="words"
            />

            <AuthInput
              label="Activity Name"
              icon="play-circle-outline"
              placeholder="What did you do?"
              value={activityName}
              onChangeText={setActivityName}
              autoCapitalize="sentences"
            />

            <AuthInput
              label="Duration"
              icon="time-outline"
              placeholder="e.g., 2h 30m, 45m"
              value={duration}
              onChangeText={setDuration}
            />
          </View>

          <ModalActionButtons
            onCancel={handleClose}
            onAdd={handleAdd}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    flex: 1,
    gap: 20,
  },
});
