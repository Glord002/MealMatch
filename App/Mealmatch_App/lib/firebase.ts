import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth, initializeAuth, type Persistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

function getFirebaseConfig(): FirebaseOptions {
  const config: FirebaseOptions = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };

  if (!config.apiKey || !config.projectId) {
    console.warn(
      "[firebase] Missing EXPO_PUBLIC_FIREBASE_* env vars. Copy .env.example to .env and add your Firebase Web config."
    );
  }

  return config;
}

const app = getApps().length ? getApp() : initializeApp(getFirebaseConfig());

function createAuth() {
  if (Platform.OS === "web") {
    return getAuth(app);
  }
  try {
    // `getReactNativePersistence` is exported from the RN build of `@firebase/auth`;
    // `firebase/auth` typings target the web entry and omit it.
    const { getReactNativePersistence } = require("@firebase/auth") as {
      getReactNativePersistence: (
        storage: typeof ReactNativeAsyncStorage
      ) => Persistence;
    };
    return initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

export const auth = createAuth();
export default app;
