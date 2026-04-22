/**
 * SignupScreen - Firebase signup + Firestore profile doc creation
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
import Icon from 'react-native-vector-icons/Ionicons';

import CustomInput from '@components/CustomInput';
import CustomButton from '@components/CustomButton';
import {useTheme} from '@theme/ThemeContext';
import {spacing, typography} from '@theme/theme';
import {signUpUser, friendlyAuthError} from '@services/authService';

const SignupScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6)
      e.password = 'Password must be at least 6 characters';
    if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signUpUser({
        email: email.trim(),
        password,
        displayName: name.trim(),
      });
      // auth listener in App.js will update Redux
    } catch (err) {
      Alert.alert('Signup Failed', friendlyAuthError(err.code));
    } finally {
      setLoading(false);
    }
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
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}>
            <Icon name="chevron-back" size={26} color={theme.colors.text} />
          </Pressable>

          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              Create account
            </Text>
            <Text
              style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
              Join Urban-Store in a minute
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(500)}
            style={{marginTop: spacing.xxxl}}>
            <CustomInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              autoCapitalize="words"
              icon="person-outline"
              error={errors.name}
            />
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
              placeholder="Minimum 6 characters"
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
            />
            <CustomInput
              label="Confirm Password"
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Re-enter password"
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.confirm}
            />

            <View style={{marginTop: spacing.md}}>
              <CustomButton
                title="Create Account"
                onPress={handleSignup}
                loading={loading}
              />
            </View>

            <View style={styles.footerRow}>
              <Text style={{color: theme.colors.textSecondary}}>
                Already have an account?{' '}
              </Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.link, {color: theme.colors.primary}]}>
                  Login
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
  scroll: {padding: spacing.xxl, paddingTop: spacing.lg},
  backBtn: {marginBottom: spacing.xl, width: 40},
  title: {...typography.h1, marginBottom: spacing.xs},
  subtitle: {...typography.body},
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  link: {fontWeight: '700'},
});

export default SignupScreen;
