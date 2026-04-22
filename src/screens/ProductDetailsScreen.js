/**
 * ProductDetailsScreen - full product info
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {FadeIn, FadeInDown} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';

import CustomButton from '@components/CustomButton';
import {useTheme} from '@theme/ThemeContext';
import {spacing, typography, radius} from '@theme/theme';
import {useGetProductByIdQuery} from '@redux/api/productsApi';
import {addToCart, selectIsInCart} from '@redux/slices/cartSlice';
import {
  toggleWishlist,
  selectIsWishlisted,
} from '@redux/slices/wishlistSlice';
import {selectUser} from '@redux/slices/authSlice';
import {saveWishlistToCloud} from '@services/userService';
import {store} from '@redux/store';

const {width} = Dimensions.get('window');

const ProductDetailsScreen = ({route, navigation}) => {
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const {productId, product: initialProduct} = route.params;

  // Use initial data while fresh fetch happens
  const {data: fetched, isLoading} = useGetProductByIdQuery(productId, {
    skip: !!initialProduct,
  });
  const product = fetched || initialProduct;

  const inCart = useSelector(product ? selectIsInCart(product.id) : () => false);
  const isWishlisted = useSelector(
    product ? selectIsWishlisted(product.id) : () => false,
  );

  if (!product || isLoading) {
    return (
      <SafeAreaView
        style={[styles.safe, {backgroundColor: theme.colors.background}]}>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 100,
            color: theme.colors.text,
          }}>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    Alert.alert('Added', `${product.title} added to cart.`, [
      {text: 'Keep shopping', style: 'cancel'},
      {text: 'View cart', onPress: () => navigation.navigate('MainTabs', {screen: 'Cart'})},
    ]);
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    if (user?.uid) {
      const items = store.getState().wishlist.items;
      saveWishlistToCloud(user.uid, items);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, {backgroundColor: theme.colors.background}]}
      edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.iconBtn, {backgroundColor: theme.colors.surface}]}
          hitSlop={8}>
          <Icon name="chevron-back" size={22} color={theme.colors.text} />
        </Pressable>
        <Pressable
          onPress={handleWishlist}
          style={[styles.iconBtn, {backgroundColor: theme.colors.surface}]}
          hitSlop={8}>
          <Icon
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={22}
            color={isWishlisted ? theme.colors.danger : theme.colors.text}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 120}}>
        <Animated.View
          entering={FadeIn.duration(400)}
          style={[styles.imageBox, {backgroundColor: theme.colors.surface}]}>
          <Image
            source={{uri: product.image}}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={{padding: spacing.xl}}>
          <Text
            style={[styles.category, {color: theme.colors.primary}]}>
            {product.category}
          </Text>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            {product.title}
          </Text>

          <View style={styles.row}>
            <Text style={[styles.price, {color: theme.colors.text}]}>
              ${product.price.toFixed(2)}
            </Text>
            {product.rating && (
              <View
                style={[
                  styles.ratingBox,
                  {backgroundColor: theme.colors.surface},
                ]}>
                <Icon name="star" size={14} color={theme.colors.star} />
                <Text
                  style={[
                    styles.ratingText,
                    {color: theme.colors.text},
                  ]}>
                  {product.rating.rate}
                </Text>
                <Text style={{color: theme.colors.textSecondary, fontSize: 12}}>
                  ({product.rating.count})
                </Text>
              </View>
            )}
          </View>

          <Text
            style={[styles.sectionLabel, {color: theme.colors.text}]}>
            Description
          </Text>
          <Text
            style={[styles.description, {color: theme.colors.textSecondary}]}>
            {product.description}
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Sticky add-to-cart */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
          },
        ]}>
        <CustomButton
          title={inCart ? 'Added to cart' : 'Add to cart'}
          onPress={handleAddToCart}
          icon={
            <Icon
              name={inCart ? 'checkmark' : 'bag-add-outline'}
              size={20}
              color="#fff"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1},
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBox: {
    width: width,
    height: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxxl,
  },
  image: {width: '100%', height: '100%'},
  category: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  title: {...typography.h2, marginBottom: spacing.md, lineHeight: 30},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  price: {fontSize: 28, fontWeight: '900'},
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  ratingText: {fontWeight: '700'},
  sectionLabel: {
    ...typography.h4,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
  },
});

export default ProductDetailsScreen;
