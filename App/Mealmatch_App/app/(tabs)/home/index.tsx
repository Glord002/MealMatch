import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import {
  HeartHandshake,
  MapPin,
  Building2,
  Users,
  Clock,
  BarChart3,
  Truck,
  Route,
  ShieldCheck,
} from "lucide-react-native";
import Colors from "@/constants/colors";

export default function MealsListScreen() {
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
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <View style={styles.logoCircle}>
            <HeartHandshake size={34} color={Colors.dark.accent} />
          </View>

          <Text style={styles.brand}>MealMatch</Text>

          <Text style={styles.heroTitle}>
            Elevating food recovery into a smarter community network
          </Text>

          <Text style={styles.heroText}>
            MealMatch is a coordination platform that helps restaurants, grocery
            stores, and event organizers route surplus food to nearby shelters,
            food banks, and outreach teams — quickly, clearly, and with the trust
            this work deserves.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/(tabs)/donate")}
            >
              <Text style={styles.primaryButtonText}>Donate Food</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("/(tabs)/map")}
            >
              <Text style={styles.secondaryButtonText}>
                Explore Food Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.snapshotCard}>
          <Text style={styles.sectionTitle}>Operational Snapshot</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>1,280+</Text>
              <Text style={styles.statLabel}>meals redirected this week</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>
                active community partner locations
              </Text>
            </View>

            <View style={styles.statBoxAccent}>
              <Text style={styles.statNumberDark}>{"< 20 min"}</Text>
              <Text style={styles.statLabelDark}>
                average match response window
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Built for real-world handoffs</Text>
          <Text style={styles.sectionText}>
            A premium interface designed for donors, partner organizations, and
            community support teams working together on the ground.
          </Text>

          <View style={styles.twoCardRow}>
            <View style={styles.infoCard}>
              <Building2 size={24} color={Colors.dark.accent} />
              <Text style={styles.cardTitle}>Donors</Text>
              <Text style={styles.cardText}>
                Restaurants, grocers, caterers, and event hosts with surplus to
                share.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Users size={24} color={Colors.dark.success} />
              <Text style={styles.cardTitle}>Recipients</Text>
              <Text style={styles.cardText}>
                Shelters, food banks, and outreach partners serving people every
                day.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why MealMatch works</Text>

          <FeatureCard
            icon={<Clock size={22} color={Colors.dark.accent} />}
            title="Premium matching flow"
            text="Fast coordination between donors and nearby nonprofits keeps good food moving without administrative friction."
          />

          <FeatureCard
            icon={<ShieldCheck size={22} color={Colors.dark.success} />}
            title="A trusted community network"
            text="Restaurants, grocery stores, outreach teams, and support organizations operate on a shared platform built around how this work actually happens."
          />

          <FeatureCard
            icon={<BarChart3 size={22} color={Colors.dark.warning} />}
            title="Elegant impact reporting"
            text="Clear dashboards and summaries make outcomes easy to share with funders, stakeholders, and the wider community."
          />
        </View>

        <View style={styles.missionCard}>
          <Text style={styles.sectionTitle}>Our Mission</Text>

          <Text style={styles.missionQuote}>
            Good food should circulate with dignity, not end up wasted.
          </Text>

          <Text style={styles.sectionText}>
            MealMatch reframes food donation as a coordinated, location-aware
            service. The platform exists to reduce waste, simplify outreach, and
            strengthen the connections between donors and the organizations who
            serve their communities every day.
          </Text>

          <MiniPoint
            title="Reliable logistics"
            text="Pickup windows, addresses, and contacts stay visible to everyone involved."
          />

          <MiniPoint
            title="Better local coordination"
            text="Nearby matches keep food moving while it is still useful."
          />

          <MiniPoint
            title="Presentation-ready impact"
            text="Clean summaries make outcomes easy to explain and easy to trust."
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionText}>
            Three steps from surplus inventory to direct community support.
          </Text>

          <StepCard
            number="01"
            title="Donors post available food."
            text="Businesses and community donors enter the food type, quantity, timing, and pickup details in under a minute."
          />

          <StepCard
            number="02"
            title="The platform matches locally."
            text="MealMatch uses location-based logic to connect each donation with nearby partners ready to receive it."
          />

          <StepCard
            number="03"
            title="Pickup and support happen fast."
            text="A streamlined workflow coordinates safe handoff, reduces waste, and creates real local impact."
          />
        </View>

        <View style={styles.mapCard}>
          <View style={styles.mapIconCircle}>
            <MapPin size={28} color={Colors.dark.accent} />
          </View>

          <Text style={styles.sectionTitle}>The MealMatch Mapping System</Text>

          <Text style={styles.sectionText}>
            Location-based matching connects donors with nearby shelters, food
            banks, and outreach partners in real time.
          </Text>

          <MapFlowItem
            icon={<Building2 size={20} color={Colors.dark.accent} />}
            title="Donor Hub"
            text="Restaurants and grocers posting surplus food"
          />

          <MapFlowItem
            icon={<Route size={20} color={Colors.dark.warning} />}
            title="Routing Layer"
            text="Location data aligns pickup windows with distance"
          />

          <MapFlowItem
            icon={<Truck size={20} color={Colors.dark.success} />}
            title="Recipient Network"
            text="Shelters, banks, and support partners nearby"
          />

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => router.push("/(tabs)/map")}
          >
            <Text style={styles.mapButtonText}>
              Live radius matching — interactive map coming soon.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Impact you can stand behind</Text>

          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "MealMatch makes our extra prepared food feel valuable again. The
              handoff process is simple and professional."
            </Text>
            <Text style={styles.quoteAuthor}>— Cafe partner</Text>
          </View>

          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "The location-first flow helps us see nearby options fast —
              exactly what a real community platform needs."
            </Text>
            <Text style={styles.quoteAuthor}>— Shelter coordinator</Text>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIcon}>{icon}</View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureText}>{text}</Text>
      </View>
    </View>
  );
}

function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.stepCard}>
      <Text style={styles.stepNumber}>{number}</Text>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepText}>{text}</Text>
      </View>
    </View>
  );
}

function MiniPoint({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.miniPoint}>
      <View style={styles.miniDot} />
      <View style={styles.miniTextWrap}>
        <Text style={styles.miniTitle}>{title}</Text>
        <Text style={styles.miniText}>{text}</Text>
      </View>
    </View>
  );
}

function MapFlowItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.mapFlowItem}>
      <View style={styles.mapFlowIcon}>{icon}</View>
      <Text style={styles.mapFlowTitle}>{title}</Text>
      <Text style={styles.mapFlowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },

  heroCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  brand: {
    fontSize: 18,
    fontWeight: "900" as const,
    color: Colors.dark.accent,
    marginBottom: 8,
  },

  heroTitle: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900" as const,
    color: Colors.dark.text,
    marginBottom: 14,
  },

  heroText: {
    fontSize: 15,
    lineHeight: 23,
    color: Colors.dark.textSecondary,
  },

  buttonRow: {
    flexDirection: "row" as const,
    gap: 12,
    marginTop: 22,
    flexWrap: "wrap" as const,
  },

  primaryButton: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 14,
  },

  primaryButtonText: {
    color: Colors.dark.black,
    fontSize: 14,
    fontWeight: "900" as const,
  },

  secondaryButton: {
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  secondaryButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "800" as const,
  },

  snapshotCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 22,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900" as const,
    color: Colors.dark.text,
    marginBottom: 10,
  },

  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.dark.textSecondary,
  },

  statsGrid: {
    gap: 12,
    marginTop: 8,
  },

  statBox: {
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 16,
    padding: 16,
  },

  statBoxAccent: {
    backgroundColor: Colors.dark.accent,
    borderRadius: 16,
    padding: 16,
  },

  statNumber: {
    fontSize: 26,
    fontWeight: "900" as const,
    color: Colors.dark.accent,
  },

  statNumberDark: {
    fontSize: 26,
    fontWeight: "900" as const,
    color: Colors.dark.black,
  },

  statLabel: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },

  statLabelDark: {
    fontSize: 13,
    color: Colors.dark.black,
    marginTop: 4,
    fontWeight: "700" as const,
  },

  twoCardRow: {
    flexDirection: "row" as const,
    gap: 12,
    marginTop: 16,
  },

  infoCard: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "900" as const,
    color: Colors.dark.text,
    marginTop: 12,
    marginBottom: 6,
  },

  cardText: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.dark.textSecondary,
  },

  featureCard: {
    flexDirection: "row" as const,
    backgroundColor: Colors.dark.surface,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: "900" as const,
    color: Colors.dark.text,
    marginBottom: 5,
  },

  featureText: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.dark.textSecondary,
  },

  missionCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 22,
    padding: 18,
    marginTop: 28,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  missionQuote: {
    fontSize: 19,
    lineHeight: 27,
    fontWeight: "900" as const,
    color: Colors.dark.accent,
    marginBottom: 12,
  },

  miniPoint: {
    flexDirection: "row" as const,
    alignItems: "flex-start",
    marginTop: 14,
  },

  miniDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.dark.accent,
    marginTop: 6,
    marginRight: 10,
  },

  miniTextWrap: {
    flex: 1,
  },

  miniTitle: {
    fontSize: 14,
    fontWeight: "900" as const,
    color: Colors.dark.text,
  },

  miniText: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },

  stepCard: {
    flexDirection: "row" as const,
    backgroundColor: Colors.dark.surface,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  stepNumber: {
    fontSize: 18,
    fontWeight: "900" as const,
    color: Colors.dark.accent,
    marginRight: 14,
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 15,
    fontWeight: "900" as const,
    color: Colors.dark.text,
    marginBottom: 5,
  },

  stepText: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.dark.textSecondary,
  },

  mapCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 22,
    padding: 18,
    marginTop: 28,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  mapIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  mapFlowItem: {
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
  },

  mapFlowIcon: {
    marginBottom: 8,
  },

  mapFlowTitle: {
    fontSize: 15,
    fontWeight: "900" as const,
    color: Colors.dark.text,
  },

  mapFlowText: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.dark.textSecondary,
    marginTop: 3,
  },

  mapButton: {
    marginTop: 16,
    backgroundColor: Colors.dark.background,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  mapButtonText: {
    color: Colors.dark.accent,
    fontSize: 13,
    fontWeight: "900" as const,
    textAlign: "center" as const,
  },

  quoteCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  quoteText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.dark.text,
    fontWeight: "600" as const,
  },

  quoteAuthor: {
    fontSize: 13,
    color: Colors.dark.textMuted,
    marginTop: 10,
  },
});