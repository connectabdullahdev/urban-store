/**
 * Urban-Store - E-commerce Mobile App
 * Root App Component
 */

import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

import {store, persistor} from '@redux/store';
import RootNavigator from '@navigation/RootNavigator';
import {ThemeProvider, useTheme} from '@theme/ThemeContext';
import SplashScreen from '@components/SplashScreen';
import {useDispatch} from 'react-redux';
import {setUser, clearUser} from '@redux/slices/authSlice';

// Inner app that has access to theme context
const AppContent = () => {
  const {theme, isDark} = useTheme();
  const [initializing, setInitializing] = useState(true);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        store.dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          }),
        );
      } else {
        store.dispatch(clearUser());
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer theme={theme.navigationTheme}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <RootNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={<SplashScreen />} persistor={persistor}>
          <SafeAreaProvider>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
