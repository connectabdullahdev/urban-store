/**
 * AppStack - main app after login
 * Contains MainTabs + push screens (Details, Checkout, Wishlist)
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import ProductDetailsScreen from '@screens/ProductDetailsScreen';
import CheckoutScreen from '@screens/CheckoutScreen';
import WishlistScreen from '@screens/WishlistScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="Wishlist" component={WishlistScreen} />
  </Stack.Navigator>
);

export default AppStack;
