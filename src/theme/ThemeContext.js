/**
 * Theme Context - manages Dark/Light mode
 * Persists user preference in AsyncStorage
 */

import React, {createContext, useContext, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {lightTheme, darkTheme} from './theme';

const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

const THEME_STORAGE_KEY = '@UrbanStore:theme';

export const ThemeProvider = ({children}) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light' | 'dark' | 'system'
  const [loaded, setLoaded] = useState(false);

  // Load stored preference on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored) {
          setThemeMode(stored);
        }
      } catch (e) {
        console.warn('Theme load failed', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const resolvedMode =
    themeMode === 'system' ? systemScheme || 'light' : themeMode;
  const isDark = resolvedMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = async () => {
    const next = isDark ? 'light' : 'dark';
    setThemeMode(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (e) {
      console.warn('Theme save failed', e);
    }
  };

  const updateThemeMode = async mode => {
    setThemeMode(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.warn('Theme save failed', e);
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{theme, isDark, toggleTheme, setThemeMode: updateThemeMode, themeMode}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
};
