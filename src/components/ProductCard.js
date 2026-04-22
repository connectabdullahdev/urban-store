/**
 * ProductCard - animated product grid item
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {toggleWishlist, selectIsWishlisted} from '@redux/slices/wishlistSlice';
import {selectUser} from '@redux/slices/authSlice';
import {saveWishlistToCloud} from '@services/userService';
import {useTheme} from '@theme/ThemeContext';
import {radius, spacing, typography} from '@theme/theme';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 3) / 2;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ProductCard = ({product, onPress, index = 0}) => {
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isWishlisted = useSelector(selectIsWishlisted(product.id));

  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));
  const heartStyle = useAnimatedStyle(() => ({
    transform: [{scale: heartScale.value}],
  }));

  const handleWishlist = async () => {
    heartScale.value = withTiming(1.4, {duration: 120}, () => {
      heartScale.value = withSpring(1);
    });
    dispatch(toggleWishlist(product));
    if (user?.uid) {
      // Fire and forget cloud sync
      try {
        const {store} = require('@redux/store');
        const nextItems = store.getState().wishlist.items;
        saveWishlistToCloud(user.uid, nextItems);
      } catch (e) {
        console.warn('Wishlist sync failed', e);
      }
    }
  };

  return (
    <AnimatedPressable
      onPress={() => onPress(product)}
      onPressIn={() => (scale.value = withSpring(0.97))}
      onPressOut={() => (scale.value = withSpring(1))}
      style={[
        styles.card,
        {backgroundColor: theme.colors.card, width: CARD_WIDTH},
        animatedStyle,
      ]}>
      <View
        style={[
          styles.imageWrap,
          {backgroundColor: theme.colors.surface},
        ]}>
        <Image
          source={{uri: product.image}}
          style={styles.image}
          resizeMode="contain"
        />
        <Pressable style={styles.heartBtn} onPress={handleWishlist} hitSlop={10}>
          <Animated.View style={heartStyle}>
            <Icon
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={isWishlisted ? theme.colors.danger : theme.colors.text}
            />
          </Animated.View>
        </Pressable>
      </View>
      <View style={{padding: spacing.md}}>
        <Text
          numberOfLines={1}
          style={[styles.category, {color: theme.colors.textTertiary}]}>
          {product.category}
        </Text>
        <Text
          numberOfLines={2}
          style={[styles.title, {color: theme.colors.text}]}>
          {product.title}
        </Text>
        <View style={styles.row}>
          <Text style={[styles.price, {color: theme.colors.primary}]}>
            ${product.price.toFixed(2)}
          </Text>
          {product.rating && (
            <View style={styles.rating}>
              <Icon name="star" size={12} color={theme.colors.star} />
              <Text
                style={[
                  styles.ratingText,
                  {color: theme.colors.textSecondary},
                ]}>
                {product.rating.rate}
              </Text>
            </View>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  imageWrap: {
    height: 160,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {width: '100%', height: '100%'},
  heartBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 6,
  },
  category: {
    ...typography.small,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    ...typography.bodyBold,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.sm,
    minHeight: 36,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  price: {fontSize: 16, fontWeight: '800'},
  rating: {flexDirection: 'row', alignItems: 'center', gap: 4},
  ratingText: {...typography.small},
});

export default React.memo(ProductCard);
