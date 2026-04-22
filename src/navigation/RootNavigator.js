/**
 * RootNavigator - decides Auth flow vs Main app
 */

import React from 'react';
import {useSelector} from 'react-redux';
import {selectIsLoggedIn} from '@redux/slices/authSlice';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const RootNavigator = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return isLoggedIn ? <AppStack /> : <AuthStack />;
};

export default RootNavigator;
