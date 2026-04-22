/**
 * HomeScreen - Categories + Trending products
 * Uses RTK Query hooks - auto cached
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {FadeIn} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

import ProductCard from '@components/ProductCard';
import CategoryChip from '@components/CategoryChip';
import EmptyState from '@components/EmptyState';
import {useTheme} from '@theme/ThemeContext';
import {spacing, typography} from '@theme/theme';
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} from '@redux/api/productsApi';
import {selectUser} from '@redux/slices/authSlice';

const HomeScreen = ({navigation}) => {
  const {theme} = useTheme();
  const user = useSelector(selectUser);
  const [activeCategory, setActiveCategory] = useState('all');

  const {
    data: categories = [],
    isLoading: loadingCats,
  } = useGetCategoriesQuery();

  const {
    data: allProducts = [],
    isLoading: loadingAll,
    isError,
    refetch: refetchAll,
    isFetching: fetchingAll,
  } = useGetProductsQuery(20, {skip: activeCategory !== 'all'});

  const {
    data: categoryProducts = [],
    isLoading: loadingCat,
    refetch: refetchCat,
    isFetching: fetchingCat,
  } = useGetProductsByCategoryQuery(activeCategory, {
    skip: activeCategory === 'all',
  });

  const products = activeCategory === 'all' ? allProducts : categoryProducts;
  const loading = activeCategory === 'all' ? loadingAll : loadingCat;
  const refreshing = activeCategory === 'all' ? fetchingAll : fetchingCat;

  const onRefresh = useCallback(() => {
    if (activeCategory === 'all') refetchAll();
    else refetchCat();
  }, [activeCategory, refetchAll, refetchCat]);

  const openDetails = product => {
    navigation.navigate('ProductDetails', {productId: product.id, product});
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <SafeAreaView
      style={[styles.safe, {backgroundColor: theme.colors.background}]}
      edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text
            style={[styles.greet, {color: theme.colors.textSecondary}]}>
            {greeting} 👋
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.name, {color: theme.colors.text}]}>
            {user?.displayName || 'Welcome'}
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Wishlist')}
          style={[
            styles.iconBtn,
            {backgroundColor: theme.colors.surface},
          ]}
          hitSlop={8}>
          <Icon name="heart-outline" size={22} color={theme.colors.text} />
        </Pressable>
      </View>

      {/* Hero banner */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={[styles.banner, {backgroundColor: theme.colors.primary}]}>
        <View style={{flex: 1}}>
          <Text style={styles.bannerTag}>LIMITED TIME</Text>
          <Text style={styles.bannerTitle}>Flat 40% off</Text>
          <Text style={styles.bannerSub}>on fashion & accessories</Text>
        </View>
        <Icon name="cart" size={80} color="rgba(255,255,255,0.25)" />
      </Animated.View>

      {/* Category chips */}
      <View style={{marginTop: spacing.xl}}>
        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
          Categories
        </Text>
        {loadingCats ? (
          <ActivityIndicator
            color={theme.colors.primary}
            style={{marginVertical: spacing.lg}}
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: spacing.xl}}
            style={{marginTop: spacing.md}}>
            <CategoryChip
              label="All"
              active={activeCategory === 'all'}
              onPress={() => setActiveCategory('all')}
            />
            {categories.map(cat => (
              <CategoryChip
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onPress={() => setActiveCategory(cat)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Products grid */}
      <View style={{flex: 1, marginTop: spacing.lg}}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            {activeCategory === 'all' ? 'Trending' : 'Products'}
          </Text>
          <Text style={{color: theme.colors.textSecondary}}>
            {products.length} items
          </Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </View>
        ) : isError ? (
          <EmptyState
            icon="cloud-offline-outline"
            title="Couldn't load products"
            message="Check your internet and try again."
            actionLabel="Retry"
            onAction={onRefresh}
          />
        ) : (
          <FlatList
            data={products}
            keyExtractor={item => String(item.id)}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              paddingHorizontal: spacing.xl,
            }}
            contentContainerStyle={{paddingBottom: spacing.xxxl}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary}
              />
            }
            renderItem={({item, index}) => (
              <ProductCard
                product={item}
                onPress={openDetails}
                index={index}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  greet: {...typography.caption},
  name: {...typography.h3, marginTop: 2},
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    borderRadius: 20,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerTag: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  bannerTitle: {color: '#fff', fontSize: 26, fontWeight: '900'},
  bannerSub: {color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2},
  sectionTitle: {
    ...typography.h4,
    paddingHorizontal: spacing.xl,
    fontWeight: '800',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: spacing.xl,
    marginBottom: spacing.md,
  },
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default HomeScreen;
