/**
 * Theme configuration - Light & Dark
 * Urban-Store uses a warm, modern palette with a bold accent
 */

import {DefaultTheme, DarkTheme} from '@react-navigation/native';

const palette = {
  primary: '#FF6B35', // warm coral - brand accent
  primaryDark: '#E85826',
  primaryLight: '#FF8B5E',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
};

export const lightTheme = {
  mode: 'light',
  colors: {
    ...palette,
    background: '#FFFFFF',
    surface: '#F8F9FB',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    overlay: 'rgba(0,0,0,0.5)',
    shadow: '#000000',
    placeholder: '#9CA3AF',
    inputBg: '#F3F4F6',
    star: '#FBBF24',
  },
  navigationTheme: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: palette.primary,
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#1A1A1A',
      border: '#E5E7EB',
    },
  },
};

export const darkTheme = {
  mode: 'dark',
  colors: {
    ...palette,
    background: '#0F0F10',
    surface: '#1A1A1C',
    card: '#1E1E21',
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textTertiary: '#71717A',
    border: '#2A2A2E',
    borderLight: '#27272A',
    overlay: 'rgba(0,0,0,0.7)',
    shadow: '#000000',
    placeholder: '#71717A',
    inputBg: '#27272A',
    star: '#FBBF24',
  },
  navigationTheme: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: palette.primary,
      background: '#0F0F10',
      card: '#1E1E21',
      text: '#FFFFFF',
      border: '#2A2A2E',
    },
  },
};

export const typography = {
  h1: {fontSize: 32, fontWeight: '800', letterSpacing: -0.5},
  h2: {fontSize: 24, fontWeight: '700', letterSpacing: -0.3},
  h3: {fontSize: 20, fontWeight: '700'},
  h4: {fontSize: 18, fontWeight: '600'},
  body: {fontSize: 15, fontWeight: '400'},
  bodyBold: {fontSize: 15, fontWeight: '600'},
  caption: {fontSize: 13, fontWeight: '400'},
  small: {fontSize: 11, fontWeight: '500'},
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  full: 999,
};
