/**
 * SplashScreen - shown during app initialization
 */

import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {useTheme} from '@theme/ThemeContext';
import {typography} from '@theme/theme';

const SplashScreen = () => {
  const {theme} = useTheme();
  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.logo, {color: theme.colors.primary}]}>
        URBAN·STORE
      </Text>
      <Text style={[styles.tag, {color: theme.colors.textSecondary}]}>
        Shop smarter
      </Text>
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        style={{marginTop: 24}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  logo: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 3,
  },
  tag: {...typography.caption, marginTop: 6, letterSpacing: 1},
});

export default SplashScreen;
