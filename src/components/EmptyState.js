/**
 * EmptyState - reusable empty/error state display
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@theme/ThemeContext';
import {typography, spacing} from '@theme/theme';
import CustomButton from './CustomButton';

const EmptyState = ({
  icon = 'cube-outline',
  title = 'Nothing here yet',
  message,
  actionLabel,
  onAction,
}) => {
  const {theme} = useTheme();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrap,
          {backgroundColor: theme.colors.surface},
        ]}>
        <Icon name={icon} size={48} color={theme.colors.textTertiary} />
      </View>
      <Text style={[styles.title, {color: theme.colors.text}]}>{title}</Text>
      {message && (
        <Text style={[styles.msg, {color: theme.colors.textSecondary}]}>
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <View style={{marginTop: spacing.xl, width: 200}}>
          <CustomButton title={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {...typography.h3, marginBottom: spacing.sm, textAlign: 'center'},
  msg: {...typography.body, textAlign: 'center', lineHeight: 22},
});

export default EmptyState;
