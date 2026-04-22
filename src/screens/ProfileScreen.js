/**
 * ProfileScreen - user info, theme toggle, logout
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Switch,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';

import {useTheme} from '@theme/ThemeContext';
import {spacing, typography, radius} from '@theme/theme';
import {selectUser} from '@redux/slices/authSlice';
import {logoutUser} from '@services/authService';
import {clearCart} from '@redux/slices/cartSlice';
import {clearWishlist} from '@redux/slices/wishlistSlice';
import {selectCartCount} from '@redux/slices/cartSlice';
import {selectWishlistItems} from '@redux/slices/wishlistSlice';

const ProfileScreen = ({navigation}) => {
  const {theme, isDark, toggleTheme} = useTheme();
  const user = useSelector(selectUser);
  const cartCount = useSelector(selectCartCount);
  const wishlist = useSelector(selectWishlistItems);
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutUser();
            dispatch(clearCart());
            dispatch(clearWishlist());
          } catch (e) {
            Alert.alert('Error', 'Could not log out. Try again.');
          }
        },
      },
    ]);
  };

  const avatarLetter = (user?.displayName || user?.email || 'U')
    .charAt(0)
    .toUpperCase();

  return (
    <SafeAreaView
      style={[styles.safe, {backgroundColor: theme.colors.background}]}
      edges={['top']}>
      <ScrollView
        contentContainerStyle={{paddingBottom: spacing.xxxl}}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.header, {color: theme.colors.text}]}>
          Profile
        </Text>

        {/* User card */}
        <View
          style={[styles.userCard, {backgroundColor: theme.colors.card}]}>
          <View
            style={[
              styles.avatar,
              {backgroundColor: theme.colors.primary},
            ]}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <View style={{flex: 1, marginLeft: spacing.md}}>
            <Text
              style={[styles.name, {color: theme.colors.text}]}
              numberOfLines={1}>
              {user?.displayName || 'User'}
            </Text>
            <Text
              style={{color: theme.colors.textSecondary}}
              numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBox
            label="Cart"
            value={cartCount}
            theme={theme}
          />
          <StatBox
            label="Wishlist"
            value={wishlist.length}
            theme={theme}
          />
          <StatBox
            label="Orders"
            value={0}
            theme={theme}
          />
        </View>

        {/* Settings */}
        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
          Settings
        </Text>

        <MenuRow
          icon="heart-outline"
          label="Wishlist"
          theme={theme}
          onPress={() => navigation.navigate('Wishlist')}
          right={<Icon name="chevron-forward" size={18} color={theme.colors.textTertiary} />}
        />
        <MenuRow
          icon={isDark ? 'moon' : 'sunny-outline'}
          label="Dark mode"
          theme={theme}
          right={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor="#fff"
            />
          }
        />
        <MenuRow
          icon="help-circle-outline"
          label="Help & Support"
          theme={theme}
          onPress={() =>
            Alert.alert('Help', 'Contact us at support@urbanstore.com')
          }
          right={<Icon name="chevron-forward" size={18} color={theme.colors.textTertiary} />}
        />
        <MenuRow
          icon="information-circle-outline"
          label="About"
          theme={theme}
          onPress={() =>
            Alert.alert('Urban-Store', 'Version 1.0.0\nMade with React Native')
          }
          right={<Icon name="chevron-forward" size={18} color={theme.colors.textTertiary} />}
        />

        <View style={{paddingHorizontal: spacing.xl, marginTop: spacing.xl}}>
          <Pressable
            onPress={handleLogout}
            style={[
              styles.logoutBtn,
              {
                backgroundColor: theme.colors.danger + '15',
                borderColor: theme.colors.danger + '30',
              },
            ]}>
            <Icon
              name="log-out-outline"
              size={20}
              color={theme.colors.danger}
              style={{marginRight: spacing.sm}}
            />
            <Text
              style={{color: theme.colors.danger, fontWeight: '700'}}>
              Log out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatBox = ({label, value, theme}) => (
  <View
    style={[styles.statBox, {backgroundColor: theme.colors.card}]}>
    <Text style={[styles.statValue, {color: theme.colors.primary}]}>
      {value}
    </Text>
    <Text style={{color: theme.colors.textSecondary, fontSize: 12}}>
      {label}
    </Text>
  </View>
);

const MenuRow = ({icon, label, theme, onPress, right}) => (
  <Pressable
    onPress={onPress}
    style={({pressed}) => [
      styles.menuRow,
      {
        backgroundColor: pressed
          ? theme.colors.surface
          : 'transparent',
      },
    ]}>
    <View
      style={[styles.menuIcon, {backgroundColor: theme.colors.surface}]}>
      <Icon name={icon} size={20} color={theme.colors.text} />
    </View>
    <Text style={[styles.menuLabel, {color: theme.colors.text}]}>
      {label}
    </Text>
    {right}
  </Pressable>
);

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {
    ...typography.h1,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {color: '#fff', fontSize: 24, fontWeight: '900'},
  name: {...typography.h4, marginBottom: 2},
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  statValue: {fontSize: 22, fontWeight: '900', marginBottom: 2},
  sectionTitle: {
    ...typography.h4,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {...typography.body, fontWeight: '600', flex: 1},
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
});

export default ProfileScreen;
