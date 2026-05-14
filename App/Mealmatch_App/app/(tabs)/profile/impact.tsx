import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Colors from "@/constants/colors";

const stats = [
  { value: "24", label: "meals saved" },
  { value: "48 lbs", label: "food accessed" },
  { value: "18 kg", label: "CO₂ equivalent reduced" },
  { value: "12", label: "check-ins" },
];

export default function ImpactScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>Your impact</Text>

      <View style={styles.grid}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.paragraph}>
        Your activity helps reduce food waste and support local community
        partners. For donor accounts, you could later show meals donated,
        pickups completed, organizations helped, and estimated food waste
        reduced.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  grid: {
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.dark.accent,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.dark.textMuted,
    marginTop: 6,
    lineHeight: 18,
  },
  paragraph: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
});
