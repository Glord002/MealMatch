import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
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
import Colors from "@/constants/colors";

const menuItems = [
  { icon: Bell, label: "Notifications", subtitle: "Manage alerts" },
  { icon: Heart, label: "Favorites", subtitle: "Saved restaurants" },
  { icon: Award, label: "Impact", subtitle: "Your donation stats" },
  { icon: Shield, label: "Privacy", subtitle: "Data & permissions" },
  { icon: Settings, label: "Settings", subtitle: "App preferences" },
  { icon: HelpCircle, label: "Help & Support", subtitle: "FAQ & contact" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={36} color={Colors.dark.black} />
        </View>
        <Text style={styles.name}>MealMatch User</Text>
        <Text style={styles.email}>user@mealmatch.org</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Meals Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Donations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Pickups</Text>
          </View>
        </View>
      </View>

      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>Your Impact</Text>
        <View style={styles.impactRow}>
          <View style={styles.impactItem}>
            <Text style={styles.impactValue}>48 lbs</Text>
            <Text style={styles.impactLabel}>Food Rescued</Text>
          </View>
          <View style={styles.impactItem}>
            <Text style={styles.impactValue}>32 kg</Text>
            <Text style={styles.impactLabel}>CO₂ Saved</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Icon size={20} color={Colors.dark.accent} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={18} color={Colors.dark.textMuted} />
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/")}
        activeOpacity={0.7}
      >
        <LogOut size={18} color={Colors.dark.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
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
