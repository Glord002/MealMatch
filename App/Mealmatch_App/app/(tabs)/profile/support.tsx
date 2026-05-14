import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import Colors from "@/constants/colors";

const faq = [
  {
    q: "How does MealMatch work?",
    a: "MealMatch connects surplus food from donors with nearby shelters, food banks, and community partners.",
  },
  {
    q: "How do I donate food?",
    a: "Go to the Donate tab, enter food details, quantity, and pickup time, then submit.",
  },
  {
    q: "How do pickups work?",
    a: "Once a donation is matched, pickup details are shared with the receiving partner.",
  },
];

const SUPPORT_EMAIL = "support@mealmatch.org";

export default function SupportScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>FAQ</Text>

      {faq.map((item) => (
        <View key={item.q} style={styles.card}>
          <Text style={styles.question}>{item.q}</Text>
          <Text style={styles.answer}>{item.a}</Text>
        </View>
      ))}

      <Text style={[styles.sectionTitle, styles.contactHeading]}>Contact</Text>
      <TouchableOpacity
        onPress={() => void Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
        activeOpacity={0.7}
      >
        <Text style={styles.email}>{SUPPORT_EMAIL}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.dark.text,
    marginBottom: 14,
  },
  contactHeading: {
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  question: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  answer: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    lineHeight: 22,
  },
  email: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.dark.accent,
  },
});
