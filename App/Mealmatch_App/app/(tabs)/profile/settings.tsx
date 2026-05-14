import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Colors from "@/constants/colors";

const rows = [
  { label: "Account type", value: "Student / Donor / Partner Organization" },
  { label: "Theme", value: "Dark mode" },
  { label: "Default search radius", value: "5 miles" },
  { label: "Pickup preferences", value: "Show available pickups first" },
  { label: "Language", value: "English" },
];

export default function SettingsScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.lead}>
        App preferences. Switches and dropdowns for each option can be wired up
        later.
      </Text>

      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text style={styles.rowLabel}>{row.label}</Text>
          <Text style={styles.rowValue}>{row.value}</Text>
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
  row: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.dark.textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.dark.text,
  },
});
