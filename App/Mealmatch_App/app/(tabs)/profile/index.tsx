import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect, useRouter, type Href } from "expo-router";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Heart,
  Award,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { ROLE_META, type UserRole } from "@/constants/roles";
import { auth } from "@/lib/firebase";
import { clearUserRole, getUserRole } from "@/lib/roleStorage";

function ProfileMenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>{icon}</View>
        <View style={styles.menuText}>
          <Text style={styles.menuLabel}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <ChevronRight size={20} color={Colors.dark.textMuted} />
    </TouchableOpacity>
  );
}

const PROFILE_MENU: {
  icon: typeof Bell;
  title: string;
  subtitle: string;
  href: Href;
}[] = [
  {
    icon: Bell,
    title: "Notifications",
    subtitle: "Manage alerts",
    href: "/(tabs)/profile/notifications",
  },
  {
    icon: Heart,
    title: "Favorites",
    subtitle: "Saved restaurants",
    href: "/(tabs)/profile/favorites",
  },
  {
    icon: Award,
    title: "Impact",
    subtitle: "Your stats",
    href: "/(tabs)/profile/impact",
  },
  {
    icon: Shield,
    title: "Privacy",
    subtitle: "Data & permissions",
    href: "/(tabs)/profile/privacy",
  },
  {
    icon: Settings,
    title: "Settings",
    subtitle: "App preferences",
    href: "/(tabs)/profile/settings",
  },
  {
    icon: HelpCircle,
    title: "Help & Support",
    subtitle: "FAQ & contact",
    href: "/(tabs)/profile/support",
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [user, setUser] = useState<FirebaseUser | null>(() => auth.currentUser);
  const [role, setRole] = useState<UserRole | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  const refreshRole = useCallback(() => {
    void getUserRole().then(setRole);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshRole();
    }, [refreshRole])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const meta = role ? ROLE_META[role] : null;
  const stats = meta?.stats ?? ROLE_META.student.stats;
  const impact = meta?.impact ?? ROLE_META.student.impact;
  const displayName =
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    "MealMatch user";
  const emailLine = user?.email ?? "Not signed in";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await clearUserRole();
      router.replace("/");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Could not sign out";
      Alert.alert("Sign out", message);
    }
  };

  if (!authReady) {
    return (
      <SafeAreaView style={styles.safeOuter} edges={["top"]}>
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator color={Colors.dark.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeOuter} edges={["top"]}>
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={36} color={Colors.dark.black} />
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{emailLine}</Text>
        {meta ? (
          <View style={styles.roleChip}>
            <Text style={styles.roleChipText}>{meta.label}</Text>
          </View>
        ) : null}
        <Text style={styles.headline}>
          {meta?.profileHeadline ?? "Welcome to MealMatch"}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.v1}</Text>
            <Text style={styles.statLabel}>{stats.l1}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.v2}</Text>
            <Text style={styles.statLabel}>{stats.l2}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.v3}</Text>
            <Text style={styles.statLabel}>{stats.l3}</Text>
          </View>
        </View>
      </View>

      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>{impact.title}</Text>
        <View style={styles.impactRow}>
          <View style={styles.impactItem}>
            <Text style={styles.impactValue}>{impact.v1}</Text>
            <Text style={styles.impactLabel}>{impact.l1}</Text>
          </View>
          <View style={styles.impactItem}>
            <Text style={styles.impactValue}>{impact.v2}</Text>
            <Text style={styles.impactLabel}>{impact.l2}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        {PROFILE_MENU.map((item) => {
          const Icon = item.icon;
          return (
            <ProfileMenuItem
              key={item.title}
              icon={<Icon size={20} color={Colors.dark.accent} />}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => router.push(item.href)}
            />
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => void handleSignOut()}
        activeOpacity={0.7}
      >
        <LogOut size={18} color={Colors.dark.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeOuter: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.dark.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.dark.text,
  },
  email: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  roleChip: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.dark.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  roleChipText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.dark.accent,
    letterSpacing: 0.3,
  },
  headline: {
    fontSize: 14,
    color: Colors.dark.textMuted,
    marginTop: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    marginTop: 20,
    gap: 20,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.dark.accent,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.dark.textMuted,
    marginTop: 2,
    fontWeight: "500" as const,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.dark.border,
  },
  impactCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 18,
    padding: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  impactTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    marginBottom: 14,
  },
  impactRow: {
    flexDirection: "row" as const,
    gap: 12,
  },
  impactItem: {
    flex: 1,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  impactValue: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.dark.accent,
  },
  impactLabel: {
    fontSize: 12,
    color: Colors.dark.textMuted,
    marginTop: 4,
    fontWeight: "500" as const,
  },
  menuSection: {
    marginTop: 14,
    backgroundColor: Colors.dark.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: "hidden" as const,
  },
  menuItem: {
    flexDirection: "row" as const,
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  menuLeft: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    flex: 1,
    marginLeft: 14,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.dark.text,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.dark.error,
  },
});
