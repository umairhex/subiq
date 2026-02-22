import { ThemedText } from "@/components/themed-text";
import { AuthButton } from "@/components/ui/auth-button";
import { AuthInput } from "@/components/ui/auth-input";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 2000);
  };

  const handleBackToLogin = () => {
    router.back();
  };

  if (emailSent) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.background }}
        edges={["top"]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Pressable
                onPress={handleBackToLogin}
                style={[styles.backButton, { borderColor: theme.border }]}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={theme.foreground}
                />
              </Pressable>
            </View>

            <View style={styles.content}>
              <View
                style={[
                  styles.successIcon,
                  { backgroundColor: theme.primary + "20" },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={64}
                  color={theme.primary}
                />
              </View>

              <ThemedText
                type="title"
                style={[styles.title, { color: theme.foreground }]}
              >
                Check Your Email
              </ThemedText>

              <ThemedText
                type="default"
                style={[styles.description, { color: theme.mutedForeground }]}
              >
                We&apos;ve sent a password reset link to{" "}
                <ThemedText
                  type="default"
                  style={[styles.emailText, { color: theme.foreground }]}
                >
                  {email}
                </ThemedText>
              </ThemedText>

              <View style={styles.instructions}>
                <ThemedText
                  type="default"
                  style={[
                    styles.instructionText,
                    { color: theme.mutedForeground },
                  ]}
                >
                  • Click the link in the email to reset your password
                </ThemedText>
                <ThemedText
                  type="default"
                  style={[
                    styles.instructionText,
                    { color: theme.mutedForeground },
                  ]}
                >
                  • The link will expire in 24 hours
                </ThemedText>
                <ThemedText
                  type="default"
                  style={[
                    styles.instructionText,
                    { color: theme.mutedForeground },
                  ]}
                >
                  • Check your spam folder if you don&apos;t see the email
                </ThemedText>
              </View>

              <View style={styles.buttonContainer}>
                <AuthButton title="Back to Login" onPress={handleBackToLogin} />
              </View>

              <Pressable
                onPress={() => setEmailSent(false)}
                style={styles.resendContainer}
              >
                <ThemedText
                  type="default"
                  style={[styles.resendText, { color: theme.primary }]}
                >
                  Didn&apos;t receive the email? Resend
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              onPress={handleBackToLogin}
              style={[styles.backButton, { borderColor: theme.border }]}
            >
              <Ionicons name="arrow-back" size={24} color={theme.foreground} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <Ionicons name="lock-closed" size={48} color={theme.primary} />
            </View>

            <ThemedText
              type="title"
              style={[styles.title, { color: theme.foreground }]}
            >
              Forgot Password?
            </ThemedText>

            <ThemedText
              type="default"
              style={[styles.description, { color: theme.mutedForeground }]}
            >
              No worries! Enter your email address and we&apos;ll send you a
              link to reset your password.
            </ThemedText>

            <View style={styles.form}>
              <AuthInput
                label="Email Address"
                icon="mail-outline"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <View style={styles.buttonContainer}>
                <AuthButton
                  title="Send Reset Link"
                  onPress={handleResetPassword}
                  isLoading={isLoading}
                />
              </View>
            </View>

            <Pressable
              onPress={handleBackToLogin}
              style={styles.backToLoginContainer}
            >
              <ThemedText
                type="default"
                style={[styles.backToLoginText, { color: theme.primary }]}
              >
                Remember your password? Back to Login
              </ThemedText>
            </Pressable>
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
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  emailText: {
    fontWeight: "600",
  },
  instructions: {
    alignSelf: "stretch",
    marginBottom: 32,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  form: {
    width: "100%",
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 24,
  },
  backToLoginContainer: {
    marginTop: 24,
  },
  backToLoginText: {
    fontSize: 16,
    textAlign: "center",
  },
  resendContainer: {
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    textAlign: "center",
  },
});
