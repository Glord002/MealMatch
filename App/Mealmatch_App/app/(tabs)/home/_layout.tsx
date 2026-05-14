import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";

export default function HomeMealsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.dark.background },
        headerTintColor: Colors.dark.text,
        headerTitleStyle: { fontWeight: "700" as const },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Available Meals" }}
      />
      <Stack.Screen
        name="details"
        options={{ title: "Restaurant Details" }}
      />
    </Stack>
  );
}
