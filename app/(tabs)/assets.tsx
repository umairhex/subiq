import { AssetCard } from '@/components/assets/asset-card';
import { ThemedText } from '@/components/themed-text';
import { AddAssetModal } from '@/components/ui/add-asset-modal';
import { StatsCard } from '@/components/ui/stats-card';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAssets, useCreateAsset } from '@/hooks/use-assets';
import { toAsset } from '@/utils/transforms';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AssetsScreen() {
  const { theme } = useAppTheme();

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: assets, isLoading } = useAssets();
  const createAsset = useCreateAsset();

  const mapped = useMemo(() => (assets ?? []).map(toAsset), [assets]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return mapped;
    const q = searchQuery.toLowerCase();
    return mapped.filter(
      (a) =>
        a.name.toLowerCase().includes(q) || a.brand.toLowerCase().includes(q)
    );
  }, [mapped, searchQuery]);

  const inWarranty = mapped.filter(
    (a) => a.status !== 'Out of Warranty'
  ).length;

  const handleAddAsset = async (asset: {
    name: string;
    brand: string;
    purchaseDate: string;
    warrantyEnd: string;
  }): Promise<void> => {
    console.log('LOG: Adding asset:', asset);
    await createAsset.mutateAsync({
      name: asset.name,
      brand: asset.brand,
      purchase_date: asset.purchaseDate,
      warranty_end: asset.warrantyEnd,
    });
    setShowAddModal(false);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <ThemedText
              type="title"
              style={[styles.title, { color: theme.foreground }]}
            >
              My Assets
            </ThemedText>
            <ThemedText
              type="default"
              style={[styles.subtitle, { color: theme.mutedForeground }]}
            >
              Track your warranties and items
            </ThemedText>
          </View>
          <Pressable
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color={theme.primaryForeground} />
          </Pressable>
        </View>

        <StatsCard
          items={[
            {
              label: 'Total Assets',
              value: `${mapped.length} Items`,
            },
            {
              label: 'In Warranty',
              value: `${inWarranty} Active`,
            },
          ]}
        />

        <View style={[styles.searchBar, { backgroundColor: theme.input }]}>
          <Ionicons name="search" size={20} color={theme.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: theme.foreground }]}
            placeholder="Search assets or brands..."
            placeholderTextColor={theme.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: theme.foreground }]}
          >
            All Assets
          </ThemedText>
        </View>

        {isLoading ? (
          <ActivityIndicator color={theme.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.assetsList}>
            {filtered.length === 0 ? (
              <ThemedText
                type="default"
                style={{
                  color: theme.mutedForeground,
                  textAlign: 'center',
                  marginTop: 20,
                }}
              >
                {searchQuery
                  ? 'No assets match your search.'
                  : 'No assets yet. Tap + to add one.'}
              </ThemedText>
            ) : (
              filtered.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))
            )}
          </View>
        )}
      </ScrollView>

      <AddAssetModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAsset}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBar: {
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchInput: {
    marginLeft: 12,
    fontSize: 15,
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
  },
  assetsList: {
    gap: 12,
  },
});
