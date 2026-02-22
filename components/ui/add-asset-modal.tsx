import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { ThemedText } from "../themed-text";
import { AuthButton } from "./auth-button";
import { AuthInput } from "./auth-input";

interface AddAssetModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (asset: {
    name: string;
    brand: string;
    purchaseDate: string;
    warrantyEnd: string;
  }) => void;
  theme: any;
}

export function AddAssetModal({
  visible,
  onClose,
  onAdd,
  theme,
}: AddAssetModalProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyEnd, setWarrantyEnd] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (
      !name.trim() ||
      !brand.trim() ||
      !purchaseDate.trim() ||
      !warrantyEnd.trim()
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await onAdd({
        name: name.trim(),
        brand: brand.trim(),
        purchaseDate: purchaseDate.trim(),
        warrantyEnd: warrantyEnd.trim(),
      });

      // Reset form
      setName("");
      setBrand("");
      setPurchaseDate("");
      setWarrantyEnd("");
      onClose();
    } catch (_error) {
      Alert.alert("Error", "Failed to add asset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setBrand("");
    setPurchaseDate("");
    setWarrantyEnd("");
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <ThemedText
                type="title"
                style={[styles.title, { color: theme.foreground }]}
              >
                Add Asset
              </ThemedText>
              <ThemedText
                type="default"
                style={[styles.subtitle, { color: theme.mutedForeground }]}
              >
                Track your warranty and item details
              </ThemedText>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <AuthInput
                label="Asset Name"
                icon="cube-outline"
                placeholder="e.g., MacBook Pro, Washing Machine"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                theme={theme}
              />

              <AuthInput
                label="Brand"
                icon="business-outline"
                placeholder="e.g., Apple, Samsung"
                value={brand}
                onChangeText={setBrand}
                autoCapitalize="words"
                theme={theme}
              />

              <AuthInput
                label="Purchase Date"
                icon="calendar-outline"
                placeholder="e.g., Dec 15, 2023"
                value={purchaseDate}
                onChangeText={setPurchaseDate}
                theme={theme}
              />

              <AuthInput
                label="Warranty End Date"
                icon="shield-checkmark-outline"
                placeholder="e.g., Dec 15, 2024"
                value={warrantyEnd}
                onChangeText={setWarrantyEnd}
                theme={theme}
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: theme.secondary,
                    borderColor: theme.border,
                  },
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
                title="Add Asset"
                onPress={handleAdd}
                theme={theme}
                isLoading={isLoading}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
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
