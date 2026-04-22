/**
 * CustomInput - themed text input with label, icon, error
 */

import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@theme/ThemeContext';
import {radius, spacing, typography} from '@theme/theme';

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  icon,
  error,
  maxLength,
  multiline = false,
  style,
}) => {
  const {theme} = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isSecure = secureTextEntry && !showPwd;

  return (
    <View style={[{marginBottom: spacing.lg}, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            {color: theme.colors.textSecondary},
          ]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.inputBg,
            borderColor: error
              ? theme.colors.danger
              : focused
              ? theme.colors.primary
              : 'transparent',
            minHeight: multiline ? 90 : 52,
          },
        ]}>
        {icon && (
          <Icon
            name={icon}
            size={20}
            color={focused ? theme.colors.primary : theme.colors.textTertiary}
            style={{marginRight: spacing.sm}}
          />
        )}
        <TextInput
          style={[
            styles.input,
            {color: theme.colors.text},
            multiline && {textAlignVertical: 'top', paddingTop: spacing.md},
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          multiline={multiline}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setShowPwd(!showPwd)}>
            <Icon
              name={showPwd ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.textTertiary}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text style={[styles.error, {color: theme.colors.danger}]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...typography.caption,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: spacing.md,
  },
  error: {
    ...typography.caption,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default CustomInput;
