/**
 * WishlistScreen - user's saved items (synced with Firestore)
 */

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';

import ProductCard from '@components/ProductCard';
import EmptyState from '@components/EmptyState';
import {useTheme} from '@theme/ThemeContext';
import {spacing, typography} from '@theme/theme';
import {
  selectWishlistItems,
  setWishlist,
} from '@redux/slices/wishlistSlice';
import {selectUser} from '@redux/slices/authSlice';
import {fetchWishlistFromCloud} from '@services/userService';

const WishlistScreen = ({navigation}) => {
  const {theme} = useTheme();
  const items = useSelector(selectWishlistItems);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // Sync from cloud on mount (merge with local)
  useEffect(() => {
    (async () => {
      if (!user?.uid) return;
      try {
        const cloudItems = await fetchWishlistFromCloud(user.uid);
        if (cloudItems && cloudItems.length > 0 && items.length === 0) {
          dispatch(setWishlist(cloudItems));
        }
      } catch (e) {
        console.warn('Wishlist fetch failed', e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  return (
    <SafeAreaView
      style={[styles.safe, {backgroundColor: theme.colors.background}]}
      edges={['top']}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.iconBtn, {backgroundColor: theme.colors.surface}]}
          hitSlop={8}>
          <Icon name="chevron-back" size={22} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          Wishlist
        </Text>
        <View style={{width: 40}} />
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="No favorites yet"
          message="Tap the heart on any product to save it here."
          actionLabel="Browse products"
          onAction={() => navigation.navigate('MainTabs', {screen: 'Home'})}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => String(i.id)}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            paddingHorizontal: spacing.xl,
          }}
          contentContainerStyle={{paddingBottom: spacing.xxxl}}
          renderItem={({item}) => (
            <ProductCard
              product={item}
              onPress={p =>
                navigation.navigate('ProductDetails', {
                  productId: p.id,
                  product: p,
                })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1},
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {...typography.h3},
});

export default WishlistScreen;
