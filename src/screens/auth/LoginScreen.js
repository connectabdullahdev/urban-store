/**
 * LoginScreen - Firebase email/password login
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {FadeInDown} from 'react-native-reanimated';

import CustomInput from '@components/CustomInput';
import CustomButton from '@components/CustomButton';
import {useTheme} from '@theme/ThemeContext';
import {spacing, typography} from '@theme/theme';
import {
  loginUser,
  resetPassword,
  friendlyAuthError,
} from '@services/authService';

const LoginScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await loginUser({email: email.trim(), password});
      // auth listener in App.js will update Redux and navigate automatically
    } catch (err) {
      Alert.alert('Login Failed', friendlyAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert(
        'Enter Email',
        'Please type your email in the field, then tap Forgot password again.',
      );
      return;
    }
    Alert.alert('Reset Password', `Send reset link to ${email}?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Send',
        onPress: async () => {
          try {
            await resetPassword(email.trim());
            Alert.alert('Sent', 'Check your email for the reset link.');
          } catch (err) {
            Alert.alert('Error', friendlyAuthError(err.code));
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={[styles.brand, {color: theme.colors.primary}]}>
              URBAN·STORE
            </Text>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              Welcome back
            </Text>
            <Text
              style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
              Login to continue shopping
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(500)}
            style={{marginTop: spacing.xxxl}}>
            <CustomInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              icon="mail-outline"
              error={errors.email}
            />
            <CustomInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
            />

            <Pressable onPress={handleForgot} style={{alignSelf: 'flex-end'}}>
              <Text
                style={[
                  styles.forgot,
                  {color: theme.colors.primary},
                ]}>
                Forgot password?
              </Text>
            </Pressable>

            <View style={{marginTop: spacing.xl}}>
              <CustomButton
                title="Login"
                onPress={handleLogin}
                loading={loading}
              />
            </View>

            <View style={styles.footerRow}>
              <Text style={{color: theme.colors.textSecondary}}>
                Don't have an account?{' '}
              </Text>
              <Pressable onPress={() => navigation.navigate('Signup')}>
                <Text
                  style={[styles.link, {color: theme.colors.primary}]}>
                  Sign up
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1},
  scroll: {padding: spacing.xxl, paddingTop: spacing.xxxl},
  brand: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: spacing.xxxl,
  },
  title: {...typography.h1, marginBottom: spacing.xs},
  subtitle: {...typography.body},
  forgot: {
    ...typography.caption,
    fontWeight: '600',
    marginTop: -spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  link: {fontWeight: '700'},
});

export default LoginScreen;
