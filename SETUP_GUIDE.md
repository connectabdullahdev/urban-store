# 🚀 Urban-Store Setup Guide (Roman Urdu)

## Bhai, ye guide bilkul **zero se** hai — agar tumne pehle kabhi React Native nahi banaya toh bhi chalega. Har step follow karo, har command copy-paste karo.

---

## 📋 Table of Contents

1. [System Requirements](#1-system-requirements)
2. [Node.js Install karna](#2-nodejs-install-karna)
3. [Java JDK Install karna](#3-java-jdk-install-karna)
4. [Android Studio Setup](#4-android-studio-setup)
5. [Environment Variables Set karna](#5-environment-variables-set-karna)
6. [React Native CLI Install](#6-react-native-cli-install)
7. [Project ko Download/Setup karna](#7-project-ko-downloadsetup-karna)
8. [Dependencies Install](#8-dependencies-install)
9. [Firebase Project banana](#9-firebase-project-banana)
10. [Android mein Firebase set karna](#10-android-mein-firebase-set-karna)
11. [iOS Setup (Mac users only)](#11-ios-setup-mac-users-only)
12. [App ko run karna](#12-app-ko-run-karna)
13. [APK Build karna](#13-apk-build-karna-final-deliverable)
14. [Common Errors & Fixes](#14-common-errors--fixes)

---

## 1. System Requirements

Apne computer pe ye cheezein honi chahiye:

- **Windows 10/11, macOS, ya Linux** — koi bhi chalega
- **RAM:** Kam se kam 8 GB (16 GB behtar hai)
- **Storage:** 15 GB free space
- **Internet:** Tez chahiye — downloads bohot hain

---

## 2. Node.js Install karna

React Native ko Node.js chahiye.

1. [https://nodejs.org](https://nodejs.org) pe jao
2. **LTS version** (18 ya 20) download karo — "Recommended For Most Users" likha hoga
3. Installer chala do, **Next → Next → Finish** kar do
4. Install verify karne ke liye Terminal/CMD khol ke ye command maro:

```bash
node -v
npm -v
```

Agar version numbers aa jayein (jaise `v20.11.0`), toh Node install ho gaya ✅

---

## 3. Java JDK Install karna

Android build ke liye **Java 17** chahiye (exact version ye hi hona chahiye).

### Windows:

1. [Adoptium Temurin JDK 17](https://adoptium.net/temurin/releases/?version=17) pe jao
2. **Windows x64 MSI** download karo
3. Install kar lo, default location chhoro (`C:\Program Files\Eclipse Adoptium\jdk-17...`)

### macOS:

```bash
brew install --cask temurin@17
```

### Linux (Ubuntu):

```bash
sudo apt install openjdk-17-jdk
```

### Verify:

```bash
java -version
```

Output mein `17` hona chahiye.

---

## 4. Android Studio Setup

1. [https://developer.android.com/studio](https://developer.android.com/studio) se Android Studio download karo
2. Installer chalao — **Standard** installation choose karo
3. Install hone ke baad Android Studio kholo
4. **"More Actions" → "SDK Manager"** pe click karo
5. **SDK Platforms** tab mein ye install karo:
   - ✅ **Android 14.0 (API Level 34)** — ye must hai
   - ✅ Android 13.0 (API 33) — optional
6. **SDK Tools** tab pe jao, "Show Package Details" tick karo, aur ye install karo:
   - ✅ Android SDK Build-Tools **34.0.0**
   - ✅ Android SDK Command-line Tools (latest)
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
7. **Apply → OK** karo, download start ho jayega (bohot bari download hai, wait karo)

### Emulator banao:

1. Android Studio → **Device Manager** → **Create Virtual Device**
2. **Pixel 6** choose karo → **Next**
3. **Tiramisu (API 33)** ya higher choose karo → **Next → Finish**
4. Play button daba ke emulator start kar lo

---

## 5. Environment Variables Set karna

Ye step bohot log miss kar dete hain — zaroor karo.

### Windows:

1. Start menu mein search karo: **"Edit the system environment variables"**
2. **Environment Variables** button dabao
3. **User variables** section mein **New** click karo:
   - Variable name: `ANDROID_HOME`
   - Value: `C:\Users\<TumharaUsername>\AppData\Local\Android\Sdk`
4. **Path** variable ko edit karo aur ye 4 entries add karo:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\emulator
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```
5. **OK → OK → OK** — sab windows close karo
6. Naya CMD kholo (purana nahi chalega) aur test karo:
   ```bash
   adb --version
   ```
   Agar version aaya toh ✅

### macOS / Linux:

`~/.zshrc` (Mac) ya `~/.bashrc` (Linux) file khol ke last mein add karo:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk       # Mac
# export ANDROID_HOME=$HOME/Android/Sdk             # Linux
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Save karke terminal mein:

```bash
source ~/.zshrc        # Mac
source ~/.bashrc       # Linux
adb --version
```

---

## 6. React Native CLI Install

```bash
npm install -g react-native-cli
```

Verify:

```bash
npx react-native --version
```

---

## 7. Project ko Download/Setup karna

Project folder ko apne computer mein rakho, chalo suppose karte hain `C:\Projects\UrbanStore` par.

Terminal kholo aur project folder mein jao:

```bash
cd C:\Projects\UrbanStore
# ya Mac/Linux par:
cd ~/Projects/UrbanStore
```

> **NOTE:** Agar tumhare paas sirf `src/` folder aur root files (package.json etc.) hain aur native `android/` `ios/` folders nahi hain, toh ek naya RN project initialize karke uske src ko replace karna hoga. Is ke liye:
>
> ```bash
> # Ek parent folder mein:
> npx react-native@0.73.6 init UrbanStoreTemp
> # Phir UrbanStoreTemp ke android, ios, Gemfile wagaira copy karke apne UrbanStore folder mein daal do
> ```

---

## 8. Dependencies Install

Project folder ke andar:

```bash
npm install
```

Ye sab packages install karega (5-10 min lagenge, internet pe depend hai).

### Agar error aaye:

```bash
npm install --legacy-peer-deps
```

---

## 9. Firebase Project banana

### Step 9.1: Firebase Console

1. [https://console.firebase.google.com](https://console.firebase.google.com) pe jao (Google account se login)
2. **"Add project"** dabao
3. Project name: **`urban-store`** (ya jo bhi chahiye)
4. Google Analytics ko **disable** kar do (optional hai, yahan zaroorat nahi)
5. **Create project** → wait karo → **Continue**

### Step 9.2: Authentication enable karo

1. Left sidebar mein **Build → Authentication** pe click
2. **Get started** button dabao
3. **Sign-in method** tab → **Email/Password** pe click → **Enable** toggle on karo → **Save**

### Step 9.3: Firestore Database enable karo

1. Left sidebar mein **Build → Firestore Database**
2. **Create database**
3. **Start in test mode** select karo (30 din ke liye open, baad mein rules tight karna)
4. Location select karo (jo tumhare paas qareeb ho — e.g., `asia-south1` Pakistan ke liye)
5. **Enable**

### Step 9.4: Firestore Rules (Production ready)

Firestore → **Rules** tab → ye rules paste karo aur **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /orders/{orderId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Isse sirf wohi user apna data padh/likh sakega.

---

## 10. Android mein Firebase set karna

### Step 10.1: App register karo

1. Firebase Console mein, project overview pe **Android icon** dabao (`</>` ke pass)
2. **Android package name:** `com.urbanstore` likho
   - (Ya jo bhi `android/app/src/main/AndroidManifest.xml` mein `package=` likha hai wohi)
3. **App nickname:** `Urban Store Android`
4. Baaki khaali chhor ke **Register app**

### Step 10.2: `google-services.json` download

1. **Download google-services.json** button dabao
2. Ye file `android/app/` folder mein paste karo — exactly yahan:
   ```
   UrbanStore/
     android/
       app/
         google-services.json   ← YAHAN
         build.gradle
   ```

### Step 10.3: Gradle config

File: `android/build.gradle` (project-level)

`buildscript { dependencies { ... } }` block ke andar add karo:

```gradle
classpath("com.google.gms:google-services:4.4.1")
```

File: `android/app/build.gradle` (app-level)

File ke **TOP** pe (first line ke baad):

```gradle
apply plugin: "com.android.application"
apply plugin: "com.google.gms.google-services"    // ← ADD THIS
apply plugin: "com.facebook.react"
```

### Step 10.4: Firebase ko "Next → Continue to console" kar do

Library wali step skip kar do, humne already `@react-native-firebase` install kiya hua hai.

---

## 11. iOS Setup (Mac users only)

Agar tumhare paas Mac nahi hai toh ye step skip karo, Android par hi kaam karna.

### Step 11.1:

```bash
cd ios
pod install
cd ..
```

### Step 11.2: Firebase iOS app register

1. Firebase Console mein Project overview → **Add app → iOS**
2. **Bundle ID:** `org.reactjs.native.example.UrbanStore` (ya jo Xcode mein hai)
3. **GoogleService-Info.plist** download karo
4. Xcode mein `ios/UrbanStore.xcworkspace` kholo
5. `UrbanStore` folder pe right-click → **Add Files to "UrbanStore"**
6. `GoogleService-Info.plist` select karke **"Copy items if needed"** tick karo → **Add**

---

## 12. App ko run karna

### Terminal 1 — Metro bundler:

```bash
npm start
```

Ye window open chhodo.

### Terminal 2 — Android:

```bash
# Pehle emulator start karo (Android Studio → Device Manager → play)
npm run android
```

Pehli baar 5-10 min lagenge (Gradle build). Uske baad app install ho jaayegi.

### iOS (Mac only):

```bash
npm run ios
```

---

## 13. APK Build karna (Final Deliverable)

Submission ke liye **signed release APK** banani hai:

### Step 13.1: Release keystore banao

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore urban-store-release.keystore -alias urban-store-key -keyalg RSA -keysize 2048 -validity 10000
```

Password puchega — koi bhi rakho lekin **yaad rakho** (e.g., `urbanstore123`).

Baaki sawal (naam, organization, etc.) — jo chahe likh do ya enter daba ke skip karo.

### Step 13.2: Gradle properties mein keystore add karo

File: `android/gradle.properties` (last mein add karo):

```properties
URBANSTORE_UPLOAD_STORE_FILE=urban-store-release.keystore
URBANSTORE_UPLOAD_KEY_ALIAS=urban-store-key
URBANSTORE_UPLOAD_STORE_PASSWORD=urbanstore123
URBANSTORE_UPLOAD_KEY_PASSWORD=urbanstore123
```

### Step 13.3: `android/app/build.gradle` mein signing config

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('URBANSTORE_UPLOAD_STORE_FILE')) {
                storeFile file(URBANSTORE_UPLOAD_STORE_FILE)
                storePassword URBANSTORE_UPLOAD_STORE_PASSWORD
                keyAlias URBANSTORE_UPLOAD_KEY_ALIAS
                keyPassword URBANSTORE_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release   // ← ADD
        }
    }
}
```

### Step 13.4: Build!

```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

Windows par:
```bash
cd android
gradlew.bat clean
gradlew.bat assembleRelease
```

**Wait** — 5-10 min lagenge.

### Step 13.5: APK find karo

```
android/app/build/outputs/apk/release/app-release.apk
```

Ye file submit kar dena — phone pe install karne ke liye phone mein copy karke open karo, "Install from unknown sources" allow karna padega.

---

## 14. Common Errors & Fixes

### ❌ "SDK location not found"

`android/local.properties` file banao (agar nahi hai):

```properties
sdk.dir=C:\\Users\\<Username>\\AppData\\Local\\Android\\Sdk
```

Mac:
```properties
sdk.dir=/Users/<Username>/Library/Android/sdk
```

---

### ❌ "Execution failed for task ':app:processDebugGoogleServices'"

Matlab `google-services.json` nahi mila ya galat jagah hai. Check karo `android/app/google-services.json` mein hai.

---

### ❌ Metro bundler port 8081 already in use

```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8081 | xargs kill -9
```

---

### ❌ "Unable to load script from assets 'index.android.bundle'"

```bash
cd android
./gradlew clean
cd ..
npm start --reset-cache
# Phir naya terminal mein:
npm run android
```

---

### ❌ Reanimated error "Failed to create a worklet"

`babel.config.js` mein `'react-native-reanimated/plugin'` **last plugin** hona chahiye. Hamari config mein already hai.

Phir:
```bash
npm start --reset-cache
```

---

### ❌ Firebase "No Firebase App '[DEFAULT]' has been created"

`google-services.json` nahi mila ya Gradle mein plugin apply nahi hua. Step 10 dobara check karo.

---

### ❌ Vector Icons dikhai nahi de rahe

File: `android/app/build.gradle` ke last mein add karo:

```gradle
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
```

iOS: `ios/Podfile` mein:
```ruby
pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'
```

Phir `cd ios && pod install`.

---

## 🎉 Done!

Agar sab step follow kiye toh tumhari app chal rahi hogi:
- ✅ Login / Signup → Firebase se linked
- ✅ Home pe products → FakeStoreAPI se
- ✅ Cart → offline bhi kaam karta hai
- ✅ Wishlist → Firestore mein save hoti hai
- ✅ Dark mode → toggle chalta hai
- ✅ Checkout → order Firestore mein save

---

## 📦 Submission Checklist

- [ ] GitHub repo push kiya (keystore aur `google-services.json` gitignore kiye!)
- [ ] `app-release.apk` signed build banayi
- [ ] `README.md` updated
- [ ] `SETUP_GUIDE.md` attached
- [ ] Demo video/screenshots banayi (optional lekin marks mein fayda)

---

## ⚠️ IMPORTANT: .gitignore

Ye file ensure karo project root mein hai aur secrets include nahi hote:

```
# Firebase
android/app/google-services.json
ios/UrbanStore/GoogleService-Info.plist

# Keystore
android/app/*.keystore
android/gradle.properties

# Node
node_modules/
.env
```

---

**Bhai agar kahin atak jao to Google pe exact error message paste karna, 99% time stack overflow pe solution mil jata hai. Ya ChatGPT/Claude se poocho.**

**All the best! 🚀**
