import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff, Mail, Lock } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { ROLE_META, roleFromSearchParam } from "@/constants/roles";
import { auth } from "@/lib/firebase";
import { setUserRole } from "@/lib/roleStorage";
import { useGoogleFirebaseAuth } from "@/lib/useGoogleFirebaseAuth";

export default function SignUpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string | string[] }>();
  const role = roleFromSearchParam(params.role);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!role) router.replace("/");
  }, [role, router]);

  const completeAuth = useCallback(async () => {
    if (!role) return;
    await setUserRole(role);
    router.replace("/profile");
  }, [role, router]);

  const { googleLoading, promptGoogle } = useGoogleFirebaseAuth(completeAuth);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (!role) return;
    setEmailLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setUserRole(role);
      router.replace("/profile");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not create account";
      Alert.alert("Sign up failed", message);
    } finally {
      setEmailLoading(false);
    }
  };

  if (!role) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={Colors.dark.accent} size="large" />
      </View>
    );
  }

  const meta = ROLE_META[role];
  const RoleIcon = meta.Icon;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              <View style={styles.header}>
                <View style={styles.logoBadge}>
                  <RoleIcon size={32} color={Colors.dark.black} />
                </View>
                <Text style={styles.title}>{meta.signUpTitle}</Text>
                <Text style={styles.subtitle}>{meta.signUpSubtitle}</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <Mail
                      size={18}
                      color={Colors.dark.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="your@email.com"
                      placeholderTextColor={Colors.dark.textMuted}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      testID="signup-email-input"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <Lock
                      size={18}
                      color={Colors.dark.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="At least 6 characters"
                      placeholderTextColor={Colors.dark.textMuted}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      testID="signup-password-input"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      {showPassword ? (
                        <EyeOff size={18} color={Colors.dark.textMuted} />
                      ) : (
                        <Eye size={18} color={Colors.dark.textMuted} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm password</Text>
                  <View style={styles.inputWrapper}>
                    <Lock
                      size={18}
                      color={Colors.dark.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter password"
                      placeholderTextColor={Colors.dark.textMuted}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirm}
                      testID="signup-confirm-input"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirm(!showConfirm)}
                      style={styles.eyeButton}
                    >
                      {showConfirm ? (
                        <EyeOff size={18} color={Colors.dark.textMuted} />
                      ) : (
                        <Eye size={18} color={Colors.dark.textMuted} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, emailLoading && styles.primaryButtonDisabled]}
                  onPress={handleSignUp}
                  activeOpacity={0.8}
                  disabled={emailLoading}
                  testID="sign-up-button"
                >
                  {emailLoading ? (
                    <ActivityIndicator color={Colors.dark.black} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Create account</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={[
                    styles.googleButton,
                    googleLoading && styles.googleButtonDisabled,
                  ]}
                  onPress={() => {
                    void promptGoogle();
                  }}
                  disabled={googleLoading}
                  activeOpacity={0.85}
                >
                  {googleLoading ? (
                    <ActivityIndicator color={Colors.dark.text} />
                  ) : (
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() =>
                    router.replace({ pathname: "/sign-in", params: { role } })
                  }
                >
                  <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={() => router.replace("/sign-in")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerText}>
                    Already have an account?{" "}
                    <Text style={styles.footerLink}>Sign in</Text>
                  </Text>
                </TouchableOpacity>
                <View style={styles.footerLinks}>
                  <Text style={styles.footerSmall}>Privacy Policy</Text>
                  <Text style={styles.footerDot}>•</Text>
                  <Text style={styles.footerSmall}>Terms of Service</Text>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  centered: { justifyContent: "center", alignItems: "center" },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.dark.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 15, color: Colors.dark.textSecondary, marginTop: 6 },
  form: { gap: 18 },
  inputGroup: { gap: 8 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.dark.textSecondary,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: Colors.dark.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: Colors.dark.text },
  eyeButton: { padding: 4 },
  primaryButton: {
    backgroundColor: Colors.dark.accent,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.dark.black,
  },
  divider: { flexDirection: "row" as const, alignItems: "center", gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.dark.border },
  dividerText: {
    fontSize: 13,
    color: Colors.dark.textMuted,
    fontWeight: "600" as const,
  },
  googleButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: "center",
    justifyContent: "center",
  },
  googleButtonDisabled: { opacity: 0.5 },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.dark.text,
  },
  secondaryButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.dark.textSecondary,
  },
  footer: { alignItems: "center", marginTop: 32, gap: 12 },
  footerText: { fontSize: 14, color: Colors.dark.textSecondary },
  footerLink: { color: Colors.dark.accent, fontWeight: "600" as const },
  footerLinks: { flexDirection: "row" as const, alignItems: "center", gap: 8 },
  footerSmall: { fontSize: 12, color: Colors.dark.textMuted },
  footerDot: { fontSize: 12, color: Colors.dark.textMuted },
});
