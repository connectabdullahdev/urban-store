/**
 * CartScreen - list + subtotal + checkout button
 */

import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import Animated, {FadeInDown} from 'react-native-reanimated';

import CartItem from '@components/CartItem';
import CustomButton from '@components/CustomButton';
import EmptyState from '@components/EmptyState';
import {useTheme} from '@theme/ThemeContext';
import {spacing, typography} from '@theme/theme';
import {
  selectCartItems,
  selectCartSubtotal,
  clearCart,
} from '@redux/slices/cartSlice';

const SHIPPING = 5.0;
const TAX_RATE = 0.05;

const CartScreen = ({navigation}) => {
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const tax = subtotal * TAX_RATE;
  const total = items.length > 0 ? subtotal + SHIPPING + tax : 0;

  if (items.length === 0) {
    return (
      <SafeAreaView
        style={[styles.safe, {backgroundColor: theme.colors.background}]}
        edges={['top']}>
        <Text style={[styles.header, {color: theme.colors.text}]}>
          Your Cart
        </Text>
        <EmptyState
          icon="bag-outline"
          title="Your cart is empty"
          message="Looks like you haven't added anything yet."
          actionLabel="Start Shopping"
          onAction={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, {backgroundColor: theme.colors.background}]}
      edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={[styles.header, {color: theme.colors.text}]}>
          Your Cart
        </Text>
        <Text
          style={[styles.clear, {color: theme.colors.danger}]}
          onPress={() => dispatch(clearCart())}>
          Clear all
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <CartItem item={item} />}
      />

      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[
          styles.summary,
          {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
          },
        ]}>
        <Row
          label="Subtotal"
          value={`$${subtotal.toFixed(2)}`}
          theme={theme}
        />
        <Row
          label="Shipping"
          value={`$${SHIPPING.toFixed(2)}`}
          theme={theme}
        />
        <Row label="Tax (5%)" value={`$${tax.toFixed(2)}`} theme={theme} />
        <View
          style={[
            styles.divider,
            {backgroundColor: theme.colors.border},
          ]}
        />
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, {color: theme.colors.text}]}>
            Total
          </Text>
          <Text style={[styles.totalValue, {color: theme.colors.primary}]}>
            ${total.toFixed(2)}
          </Text>
        </View>
        <CustomButton
          title="Proceed to Checkout"
          onPress={() => navigation.navigate('Checkout', {total})}
          style={{marginTop: spacing.md}}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const Row = ({label, value, theme}) => (
  <View style={styles.row}>
    <Text style={{color: theme.colors.textSecondary}}>{label}</Text>
    <Text style={{color: theme.colors.text, fontWeight: '600'}}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {
    ...typography.h1,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: spacing.xl,
  },
  clear: {fontWeight: '700'},
  summary: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  divider: {height: 1, marginVertical: spacing.sm},
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  totalLabel: {...typography.h3},
  totalValue: {...typography.h2, fontWeight: '900'},
});

export default CartScreen;
