import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Colors from "@/constants/colors";

const saved = [
  { name: "Olive Garden", detail: "Saved restaurant — 12 meals available" },
  { name: "Chipotle", detail: "Saved restaurant — 15 meals available" },
  { name: "Thai Orchid", detail: "Saved restaurant — 10 meals available" },
];

export default function FavoritesScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.lead}>
        Saved restaurants and food support locations. This can later connect to
        the places you mark as favorites in the app.
      </Text>

      {saved.map((item) => (
        <View key={item.name} style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}>{item.detail}</Text>
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
  name: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: Colors.dark.textMuted,
    lineHeight: 20,
  },
});
