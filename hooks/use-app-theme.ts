import { Colors } from '@/constants/theme';
import { useThemeStore } from '@/stores/theme-store';
import { useColorScheme } from 'react-native';

export function useAppTheme() {
  const systemColorScheme = useColorScheme() ?? 'light';
  const { theme: overrideTheme } = useThemeStore();
  const colorScheme =
    overrideTheme === 'system' ? systemColorScheme : overrideTheme;
  return { theme: Colors[colorScheme], colorScheme } as const;
}
