import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Home } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.subtitle}>
        The page you are looking for does not exist.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/")}
        activeOpacity={0.8}
      >
        <Home size={18} color={Colors.dark.black} />
        <Text style={styles.buttonText}>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  code: {
    fontSize: 64,
    fontWeight: "800" as const,
    color: Colors.dark.accent,
    letterSpacing: -2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  button: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 32,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.dark.black,
  },
});