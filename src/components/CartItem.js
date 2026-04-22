/**
 * CartItem - animated quantity controls
 */

import React from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {FadeIn, FadeOut, Layout} from 'react-native-reanimated';
import {useDispatch} from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '@redux/slices/cartSlice';
import {useTheme} from '@theme/ThemeContext';
import {radius, spacing, typography} from '@theme/theme';

const CartItem = ({item}) => {
  const {theme} = useTheme();
  const dispatch = useDispatch();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify()}
      style={[
        styles.container,
        {backgroundColor: theme.colors.card, borderColor: theme.colors.border},
      ]}>
      <View style={[styles.imgWrap, {backgroundColor: theme.colors.surface}]}>
        <Image
          source={{uri: item.image}}
          style={styles.img}
          resizeMode="contain"
        />
      </View>
      <View style={{flex: 1, marginLeft: spacing.md}}>
        <Text
          numberOfLines={2}
          style={[styles.title, {color: theme.colors.text}]}>
          {item.title}
        </Text>
        <Text style={[styles.price, {color: theme.colors.primary}]}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
        <View style={styles.row}>
          <View
            style={[
              styles.qtyBox,
              {backgroundColor: theme.colors.surface},
            ]}>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => dispatch(decreaseQuantity(item.id))}
              hitSlop={8}>
              <Icon name="remove" size={18} color={theme.colors.text} />
            </Pressable>
            <Text style={[styles.qty, {color: theme.colors.text}]}>
              {item.quantity}
            </Text>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => dispatch(increaseQuantity(item.id))}
              hitSlop={8}>
              <Icon name="add" size={18} color={theme.colors.text} />
            </Pressable>
          </View>
          <Pressable
            onPress={() => dispatch(removeFromCart(item.id))}
            hitSlop={8}
            style={styles.deleteBtn}>
            <Icon
              name="trash-outline"
              size={18}
              color={theme.colors.danger}
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  imgWrap: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {width: '100%', height: '100%'},
  title: {...typography.bodyBold, fontSize: 13, marginBottom: spacing.xs},
  price: {fontSize: 16, fontWeight: '800', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingHorizontal: spacing.xs,
  },
  qtyBtn: {padding: 6},
  qty: {
    minWidth: 24,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 14,
  },
  deleteBtn: {padding: 6},
});

export default React.memo(CartItem);
