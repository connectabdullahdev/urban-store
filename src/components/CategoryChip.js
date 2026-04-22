/**
 * CategoryChip - horizontal scrollable filter chip
 */

import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {useTheme} from '@theme/ThemeContext';
import {radius, spacing, typography} from '@theme/theme';

const CategoryChip = ({label, active, onPress}) => {
  const {theme} = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.colors.primary : theme.colors.surface,
          borderColor: active ? theme.colors.primary : theme.colors.border,
        },
      ]}>
      <Text
        numberOfLines={1}
        style={[
          styles.text,
          {color: active ? '#FFFFFF' : theme.colors.text},
        ]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  text: {...typography.bodyBold, fontSize: 13, textTransform: 'capitalize'},
});

export default CategoryChip;
