import React, { useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Phone, MapPin, Star, Clock, AlertTriangle } from "lucide-react-native";
import Colors from "@/constants/colors";
import { restaurants, meals } from "@/mocks/restaurants";

export default function RestaurantDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const restaurant = useMemo(
    () => restaurants.find((r) => r.id === id),
    [id]
  );

  const restaurantMeals = useMemo(
    () => meals.filter((m) => m.restaurantId === id),
    [id]
  );

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </View>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${restaurant.phone}`).catch(() =>
      Alert.alert("Error", "Could not open phone dialer")
    );
  };

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={{ uri: restaurant.image }}
        style={styles.heroImage}
        contentFit="cover"
      />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Star size={16} color={Colors.dark.accent} fill={Colors.dark.accent} />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
        </View>

        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <MapPin size={18} color={Colors.dark.accent} />
            <View>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{restaurant.address}</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <Clock size={18} color={Colors.dark.accent} />
            <View>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{restaurant.distance}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.callButton}
          onPress={handleCall}
          activeOpacity={0.8}
        >
          <Phone size={18} color={Colors.dark.black} />
          <Text style={styles.callButtonText}>Call {restaurant.phone}</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Available Meals ({restaurantMeals.length})
          </Text>
          {restaurantMeals.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <View style={styles.qtyBadge}>
                  <Text style={styles.qtyText}>×{meal.quantity}</Text>
                </View>
              </View>
              <Text style={styles.mealDesc}>{meal.description}</Text>

              <View style={styles.tagsRow}>
                {meal.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {meal.allergens.length > 0 && (
                <View style={styles.allergenRow}>
                  <AlertTriangle size={13} color={Colors.dark.warning} />
                  <Text style={styles.allergenText}>
                    {meal.allergens.join(", ")}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  errorText: {
    fontSize: 16,
    color: Colors.dark.textMuted,
    textAlign: "center",
    marginTop: 60,
  },
  heroImage: {
    width: "100%",
    height: 220,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 26,
    fontWeight: "800" as const,
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  cuisine: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  infoCards: {
    flexDirection: "row" as const,
    gap: 12,
    marginTop: 20,
  },
  infoCard: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.dark.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.dark.textMuted,
    fontWeight: "500" as const,
  },
  infoValue: {
    fontSize: 13,
    color: Colors.dark.text,
    fontWeight: "600" as const,
    marginTop: 1,
  },
  callButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.dark.accent,
    height: 50,
    borderRadius: 14,
    marginTop: 20,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.dark.black,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  mealHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealName: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    flex: 1,
  },
  qtyBadge: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.dark.black,
  },
  mealDesc: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 6,
    marginTop: 12,
  },
  tag: {
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.dark.textSecondary,
  },
  allergenRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  allergenText: {
    fontSize: 12,
    color: Colors.dark.warning,
    fontWeight: "500" as const,
  },
});
