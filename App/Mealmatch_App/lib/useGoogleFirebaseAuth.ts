import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";

const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const googleAndroidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const firebaseApiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

const redirectUri = AuthSession.makeRedirectUri({
  scheme: "mealmatch",
  path: "redirect",
});

/**
 * Google OAuth via expo-auth-session, then Firebase `signInWithCredential`.
 * New Google users are created in Firebase automatically on first sign-in.
 */
export function useGoogleFirebaseAuth(onSuccess: () => void) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const [, googleResponse, promptGoogleAsync] = Google.useIdTokenAuthRequest({
    webClientId: googleWebClientId,
    iosClientId: googleIosClientId,
    androidClientId: googleAndroidClientId,
    redirectUri,
  });

  useEffect(() => {
    if (!googleResponse) return;

    if (googleResponse.type === "error") {
      const msg =
        googleResponse.error?.message ??
        googleResponse.params?.error_description ??
        "Google sign-in failed";
      Alert.alert("Google sign-in", msg);
      return;
    }

    if (googleResponse.type !== "success") return;

    const idToken = googleResponse.params.id_token;

    if (!idToken) {
      Alert.alert(
        "Google sign-in",
        "No ID token returned. Check OAuth client IDs in .env (Web client ID is required for Firebase)."
      );
      return;
    }

    setGoogleLoading(true);

    const credential = GoogleAuthProvider.credential(idToken);

    signInWithCredential(auth, credential)
      .then(() => onSuccessRef.current())
      .catch((err: Error) =>
        Alert.alert(
          "Sign in failed",
          err.message ?? "Could not complete Firebase sign-in"
        )
      )
      .finally(() => setGoogleLoading(false));
  }, [googleResponse]);

  const promptGoogle = useCallback(async () => {
    if (Platform.OS === "web") {
      if (!firebaseApiKey) {
        Alert.alert(
          "Google sign-in",
          "Add your Firebase web config (EXPO_PUBLIC_FIREBASE_API_KEY, etc.) to .env for Google sign-in on web."
        );
        return;
      }

      setGoogleLoading(true);

      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        onSuccessRef.current();
      } catch (e: unknown) {
        const code =
          e && typeof e === "object" && "code" in e
            ? String((e as { code: string }).code)
            : "";

        if (
          code === "auth/popup-closed-by-user" ||
          code === "auth/cancelled-popup-request"
        ) {
          return;
        }

        const message =
          e instanceof Error ? e.message : "Google sign-in failed";
        Alert.alert("Google sign-in", message);
      } finally {
        setGoogleLoading(false);
      }

      return;
    }

    if (!googleWebClientId) {
      Alert.alert(
        "Google sign-in",
        "Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env (Firebase Console → Authentication → Google → Web client ID)."
      );
      return;
    }

    await promptGoogleAsync();
  }, [promptGoogleAsync]);

  return {
    googleLoading,
    promptGoogle,
  };
}
