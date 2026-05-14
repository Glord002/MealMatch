import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Colors from "@/constants/colors";

const alerts = [
  {
    title: "Pickup reminder",
    body: "Your pickup from Olive Garden is ready between 2:00 PM - 4:00 PM.",
  },
  {
    title: "New match found",
    body: "A nearby shelter can receive your donation today.",
  },
  {
    title: "Donation update",
    body: "Your submitted donation was accepted by a partner organization.",
  },
];

export default function NotificationsScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.lead}>
        Alerts about pickups, donations, and matches will appear here. You can
        add toggles for pickup alerts, donation updates, nearby food, email,
        and push notifications later.
      </Text>

      {alerts.map((item) => (
        <View key={item.title} style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardBody}>{item.body}</Text>
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
    color: Colors.dark.accent,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 22,
  },
});
