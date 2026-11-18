# 🛍️ Urban-Store

A modern, production-grade e-commerce mobile app built with **React Native**, **Redux Toolkit**, **Firebase**, and **RTK Query**.

![React Native](https://img.shields.io/badge/React_Native-0.73-blue)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.2-purple)
![Firebase](https://img.shields.io/badge/Firebase-19.2-orange)

---

## ✨ Features

- **🔐 Authentication** — Firebase email/password login & signup with friendly error messages
- **🏠 Home** — Category filtering, trending products, pull-to-refresh
- **🔎 Search** — Live filter by name/category, price sorting
- **🛒 Cart** — Add / remove / update quantity, live subtotal + tax + shipping calculation, persists offline via AsyncStorage
- **❤️ Wishlist** — Saved items synced to Firestore per-user across devices
- **👤 Profile** — User info, cart/wishlist stats, settings
- **🌙 Dark Mode** — Full light + dark themes, persisted in AsyncStorage, respects system preference
- **📦 Product Details** — Full image, description, rating, add-to-cart
- **💳 Checkout** — Shipping form validation, payment method selection, order saved to Firestore
- **📱 Offline Support** — Cart + wishlist + auth state preserved via redux-persist
- **🎬 Animations** — Screen transitions, item add/remove, heart pulse, button press springs (Reanimated)

---

## 🧱 Tech Stack

| Layer              | Technology                                      |
| ------------------ | ----------------------------------------------- |
| Framework          | React Native 0.73 (Functional Components + Hooks) |
| State Management   | Redux Toolkit + RTK Query                       |
| Persistence        | redux-persist + AsyncStorage                    |
| Navigation         | React Navigation v6 (Native Stack + Bottom Tabs) |
| Backend / Auth     | Firebase Auth + Firestore (@react-native-firebase) |
| Product API        | [FakeStoreAPI](https://fakestoreapi.com)        |
| Animations         | react-native-reanimated 3                       |
| Icons              | react-native-vector-icons (Ionicons)            |
| Styling            | StyleSheet + custom Theme system                |

---

## 📁 Folder Structure

```
UrbanStore/
├── android/                  # Native Android project
├── ios/                      # Native iOS project
├── src/
│   ├── components/           # Reusable UI (Button, Input, ProductCard, CartItem, …)
│   ├── screens/              # All screens
│   │   ├── auth/             # Login, Signup
│   │   ├── HomeScreen.js
│   │   ├── SearchScreen.js
│   │   ├── CartScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── ProductDetailsScreen.js
│   │   ├── CheckoutScreen.js
│   │   └── WishlistScreen.js
│   ├── navigation/           # RootNavigator, AuthStack, AppStack, MainTabs
│   ├── redux/
│   │   ├── store.js          # Store + persist config
│   │   ├── slices/           # authSlice, cartSlice, wishlistSlice
│   │   └── api/              # productsApi (RTK Query)
│   ├── services/             # authService, userService (Firebase)
│   └── theme/                # theme.js, ThemeContext.js
├── App.js                    # Root component
├── index.js                  # Entry point
├── babel.config.js           # with module-resolver aliases
├── package.json
└── SETUP_GUIDE.md            # Step-by-step setup instructions
```

---

## 🚀 Quick Start

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for complete step-by-step instructions from zero, including:

- Installing Node, JDK, Android Studio, Xcode
- Firebase project creation
- `google-services.json` / `GoogleService-Info.plist` placement
- Gradle configuration
- First APK build

### TL;DR for experienced devs:

```bash
# 1. Install dependencies
npm install

# 2. iOS only
cd ios && pod install && cd ..

# 3. Add Firebase config files:
#    - android/app/google-services.json
#    - ios/UrbanStore/GoogleService-Info.plist

# 4. Run
npm run android
# or
npm run ios

# 5. Build release APK
npm run build:android
# APK → android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎨 Design System

The theme uses a **warm coral (#FF6B35)** as the brand accent — distinct from generic blue/purple e-commerce palettes. Spacing, radius, and typography are tokenized in `src/theme/theme.js`.

- **Light mode** — clean whites with soft surface greys
- **Dark mode** — true-near-black (#0F0F10) with warm accents

Toggle in **Profile → Dark mode**, or set to follow system.

---

## 🔥 Firebase Schema

**Collection: `users`**

```
users/{uid}
  ├── email: string
  ├── displayName: string
  ├── createdAt: timestamp
  ├── wishlist: array<Product>
  └── wishlistUpdatedAt: timestamp

users/{uid}/orders/{orderId}
  ├── items: array
  ├── shipping: { fullName, phone, address, city, postal }
  ├── paymentMethod: 'cod' | 'card'
  ├── subtotal, shippingFee, tax, total: number
  ├── status: 'pending' | 'confirmed' | 'delivered'
  └── createdAt: timestamp
```

---

## 📝 Scripts

| Command              | What it does                      |
| -------------------- | --------------------------------- |
| `npm start`          | Start Metro bundler               |
| `npm run android`    | Run on Android emulator / device  |
| `npm run ios`        | Run on iOS simulator              |
| `npm run build:android` | Build release APK              |
| `npm run clean:android` | Clean Gradle cache             |
| `npm run lint`       | ESLint check                      |

---

<div align="center">

Built by **Muhammad Abdullah** · [LinkedIn](https://www.linkedin.com/in/connectabdullahdev) · [GitHub](https://github.com/connectabdullahdev)

</div>
