import React, { useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Users, Truck, Heart, UtensilsCrossed } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

const roles = [
  {
    key: "student" as const,
    label: "Students",
    description: "Find free meals near you",
    icon: Users,
    route: "/(tabs)/home" as const,
  },
  {
    key: "distributor" as const,
    label: "Distributors",
    description: "Manage food logistics",
    icon: Truck,
    route: "/(tabs)/map" as const,
  },
  {
    key: "volunteer" as const,
    label: "Volunteers",
    description: "Help deliver meals",
    icon: Heart,
    route: "/(tabs)/home" as const,
  },
  {
    key: "restaurant" as const,
    label: "Restaurants",
    description: "Donate surplus food",
    icon: UtensilsCrossed,
    route: "/sign-in" as const,
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const cardAnim0 = useRef(new Animated.Value(0)).current;
  const cardAnim1 = useRef(new Animated.Value(0)).current;
  const cardAnim2 = useRef(new Animated.Value(0)).current;
  const cardAnim3 = useRef(new Animated.Value(0)).current;
  const cardAnims = useMemo(
    () => [cardAnim0, cardAnim1, cardAnim2, cardAnim3],
    [cardAnim0, cardAnim1, cardAnim2, cardAnim3]
  );

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(
        120,
        cardAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, [fadeAnim, slideAnim, cardAnims]);

  const handleRoleSelect = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0D0D0D", "#141414", "#0D0D0D"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.bgPattern}>
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.bgCircle,
              {
                top: 80 + i * 120,
                left: i % 2 === 0 ? -40 : width - 60,
                opacity: 0.03,
                width: 120 + i * 20,
                height: 120 + i * 20,
              },
            ]}
          />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
              <UtensilsCrossed size={28} color={Colors.dark.black} />
            </View>
          </View>
          <Text style={styles.title}>MealMatch</Text>
          <Text style={styles.subtitle}>
            Connecting surplus food{"\n"}with those who need it
          </Text>
        </Animated.View>

        <View style={styles.rolesContainer}>
          <Animated.Text style={[styles.sectionLabel, { opacity: fadeAnim }]}>
            Select your role
          </Animated.Text>
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <Animated.View
                key={role.key}
                style={{
                  opacity: cardAnims[index],
                  transform: [
                    {
                      translateY: cardAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                    {
                      scale: cardAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={styles.roleCard}
                  activeOpacity={0.7}
                  onPress={() => handleRoleSelect(role.route)}
                  testID={`role-${role.key}`}
                >
                  <View style={styles.roleIconContainer}>
                    <Icon size={22} color={Colors.dark.black} />
                  </View>
                  <View style={styles.roleTextContainer}>
                    <Text style={styles.roleLabel}>{role.label}</Text>
                    <Text style={styles.roleDescription}>
                      {role.description}
                    </Text>
                  </View>
                  <View style={styles.roleArrow}>
                    <Text style={styles.arrowText}>→</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Text style={styles.footerText}>CSC436WB1 • MealMatch</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  bgPattern: { ...StyleSheet.absoluteFillObject },
  bgCircle: {
    position: "absolute" as const,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.dark.accent,
  },
  safeArea: { flex: 1, justifyContent: "space-between" },
  header: { alignItems: "center", paddingTop: 32, paddingHorizontal: 24 },
  logoContainer: { marginBottom: 16 },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.dark.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: Colors.dark.text,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 24,
  },
  rolesContainer: { paddingHorizontal: 20 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.dark.textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: 1.5,
    marginBottom: 14,
    marginLeft: 4,
  },
  roleCard: {
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.dark.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  roleTextContainer: { flex: 1, marginLeft: 16 },
  roleLabel: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  roleDescription: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  roleArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: { color: Colors.dark.textSecondary, fontSize: 16 },
  footer: { alignItems: "center", paddingBottom: 12 },
  footerText: { fontSize: 12, color: Colors.dark.textMuted },
});