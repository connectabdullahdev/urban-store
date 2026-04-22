/**
 * CustomButton - themed, accessible, with press animation
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useTheme} from '@theme/ThemeContext';
import {radius, spacing} from '@theme/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // primary | secondary | outline | ghost
  size = 'md', // sm | md | lg
  loading = false,
  disabled = false,
  icon = null,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const {theme} = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.96, {damping: 15, stiffness: 300});
  };
  const onPressOut = () => {
    scale.value = withSpring(1, {damping: 15, stiffness: 300});
  };

  const sizes = {
    sm: {height: 40, paddingHorizontal: 16, fontSize: 13},
    md: {height: 52, paddingHorizontal: 20, fontSize: 15},
    lg: {height: 58, paddingHorizontal: 24, fontSize: 16},
  };
  const s = sizes[size];

  const variantStyles = {
    primary: {
      bg: theme.colors.primary,
      fg: '#FFFFFF',
      border: 'transparent',
    },
    secondary: {
      bg: theme.colors.surface,
      fg: theme.colors.text,
      border: theme.colors.border,
    },
    outline: {
      bg: 'transparent',
      fg: theme.colors.primary,
      border: theme.colors.primary,
    },
    ghost: {
      bg: 'transparent',
      fg: theme.colors.primary,
      border: 'transparent',
    },
  };
  const v = variantStyles[variant];

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || loading}
      style={[
        styles.btn,
        {
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: variant === 'outline' || variant === 'secondary' ? 1.5 : 0,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        animatedStyle,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.row}>
          {icon && <View style={{marginRight: spacing.sm}}>{icon}</View>}
          <Text
            style={[
              styles.text,
              {color: v.fg, fontSize: s.fontSize},
              textStyle,
            ]}>
            {title}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  text: {fontWeight: '700', letterSpacing: 0.2},
});

export default CustomButton;
