/**
 * SearchScreen - client-side filter over cached product list
 */

import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import CustomInput from '@components/CustomInput';
import ProductCard from '@components/ProductCard';
import EmptyState from '@components/EmptyState';
import CategoryChip from '@components/CategoryChip';
import {useTheme} from '@theme/ThemeContext';
import {spacing, typography} from '@theme/theme';
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
} from '@redux/api/productsApi';

const SearchScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [sortBy, setSortBy] = useState('none'); // none | low | high

  const {data: products = [], isLoading} = useGetProductsQuery(20);
  const {data: categories = []} = useGetCategoriesQuery();

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCat !== 'all') {
      list = list.filter(p => p.category === selectedCat);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    if (sortBy === 'low') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'high') list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, query, selectedCat, sortBy]);

  return (
    <SafeAreaView
      style={[styles.safe, {backgroundColor: theme.colors.background}]}
      edges={['top']}>
      <View style={{paddingHorizontal: spacing.xl, paddingTop: spacing.sm}}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          Discover
        </Text>
        <CustomInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search products..."
          icon="search-outline"
          autoCapitalize="none"
        />
      </View>

      {/* Category filter */}
      <View style={{marginBottom: spacing.sm}}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: spacing.xl}}
          data={['all', ...categories]}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <CategoryChip
              label={item === 'all' ? 'All' : item}
              active={selectedCat === item}
              onPress={() => setSelectedCat(item)}
            />
          )}
        />
      </View>

      {/* Sort chips */}
      <View style={styles.sortRow}>
        <Text style={{color: theme.colors.textSecondary, marginRight: 8}}>
          Sort:
        </Text>
        {[
          {key: 'none', label: 'Default'},
          {key: 'low', label: 'Price: Low'},
          {key: 'high', label: 'Price: High'},
        ].map(s => (
          <CategoryChip
            key={s.key}
            label={s.label}
            active={sortBy === s.key}
            onPress={() => setSortBy(s.key)}
          />
        ))}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="search"
          title="No results"
          message="Try different keywords or filters."
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            paddingHorizontal: spacing.xl,
          }}
          contentContainerStyle={{paddingBottom: spacing.xxxl}}
          showsVerticalScrollIndicator={false}
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
  title: {...typography.h1, marginBottom: spacing.lg, marginTop: spacing.sm},
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default SearchScreen;
