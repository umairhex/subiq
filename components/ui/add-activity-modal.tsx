import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { ThemedText } from "../themed-text";
import { AuthButton } from "./auth-button";
import { AuthInput } from "./auth-input";

interface AddActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (activity: {
    platform: string;
    activityName: string;
    duration: string;
  }) => void;
  theme: any;
}

export function AddActivityModal({
  visible,
  onClose,
  onAdd,
  theme,
}: AddActivityModalProps) {
  const [platform, setPlatform] = useState("");
  const [activityName, setActivityName] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!platform.trim() || !activityName.trim() || !duration.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await onAdd({
        platform: platform.trim(),
        activityName: activityName.trim(),
        duration: duration.trim(),
      });

      // Reset form
      setPlatform("");
      setActivityName("");
      setDuration("");
      onClose();
    } catch (_error) {
      Alert.alert("Error", "Failed to add activity");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPlatform("");
    setActivityName("");
    setDuration("");
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Header */}
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

          {/* Form */}
          <View style={styles.form}>
            <AuthInput
              label="Platform"
              icon="tv-outline"
              placeholder="e.g., Netflix, Spotify, YouTube"
              value={platform}
              onChangeText={setPlatform}
              autoCapitalize="words"
              theme={theme}
            />

            <AuthInput
              label="Activity Name"
              icon="play-circle-outline"
              placeholder="What did you do?"
              value={activityName}
              onChangeText={setActivityName}
              autoCapitalize="sentences"
              theme={theme}
            />

            <AuthInput
              label="Duration"
              icon="time-outline"
              placeholder="e.g., 2h 30m, 45m"
              value={duration}
              onChangeText={setDuration}
              theme={theme}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.cancelButton,
                { backgroundColor: theme.secondary, borderColor: theme.border },
              ]}
              onPress={handleClose}
            >
              <ThemedText
                type="default"
                style={[
                  styles.cancelButtonText,
                  { color: theme.secondaryForeground },
                ]}
              >
                Cancel
              </ThemedText>
            </Pressable>
            <AuthButton
              title="Add Activity"
              onPress={handleAdd}
              theme={theme}
              isLoading={isLoading}
            />
          </View>
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
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    flex: 1,
    gap: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
