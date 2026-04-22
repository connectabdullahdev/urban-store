/**
 * MainTabs - bottom tab navigator
 * Home | Search | Cart | Profile
 * Cart tab has live badge showing item count
 */

import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

import HomeScreen from '@screens/HomeScreen';
import SearchScreen from '@screens/SearchScreen';
import CartScreen from '@screens/CartScreen';
import ProfileScreen from '@screens/ProfileScreen';
import {useTheme} from '@theme/ThemeContext';
import {selectCartCount} from '@redux/slices/cartSlice';

const Tab = createBottomTabNavigator();

const CartIcon = ({color, size, focused}) => {
  const count = useSelector(selectCartCount);
  return (
    <View>
      <Icon name={focused ? 'bag' : 'bag-outline'} size={size} color={color} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </View>
  );
};

const MainTabs = () => {
  const {theme} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {fontSize: 11, fontWeight: '600'},
        tabBarIcon: ({color, size, focused}) => {
          let name = 'home-outline';
          if (route.name === 'Home') name = focused ? 'home' : 'home-outline';
          else if (route.name === 'Search')
            name = focused ? 'search' : 'search-outline';
          else if (route.name === 'Profile')
            name = focused ? 'person' : 'person-outline';
          if (route.name === 'Cart') {
            return <CartIcon color={color} size={size} focused={focused} />;
          }
          return <Icon name={name} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {color: '#fff', fontSize: 10, fontWeight: '800'},
});

export default MainTabs;
