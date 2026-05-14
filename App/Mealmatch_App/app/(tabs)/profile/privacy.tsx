import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Colors from "@/constants/colors";

const sections = [
  {
    title: "Location permission",
    body: "MealMatch uses your location to find nearby food support and donation partners.",
  },
  {
    title: "Contact information",
    body: "Your contact details are only used to coordinate pickups and donation handoffs.",
  },
  {
    title: "Data control",
    body: "You can update or delete your profile information anytime.",
  },
];

export default function PrivacyScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.lead}>
        How we handle your data and permissions. Later you can add actions like
        manage location permission, delete account, and download my data.
      </Text>

      {sections.map((s) => (
        <View key={s.title} style={styles.card}>
          <Text style={styles.cardTitle}>{s.title}</Text>
          <Text style={styles.cardBody}>{s.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: 20, paddingBottom: 40 },
  lead: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    lineHeight: 22,
  },
});
