import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Search, Star, MapPin, ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";
import { restaurants } from "@/mocks/restaurants";
import { Restaurant } from "@/types";

export default function MealsListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = useCallback((status: Restaurant["pickupStatus"]) => {
    switch (status) {
      case "available":
        return Colors.dark.success;
      case "scheduled":
        return Colors.dark.warning;
      case "completed":
        return Colors.dark.textMuted;
    }
  }, []);

  const getStatusLabel = useCallback((status: Restaurant["pickupStatus"]) => {
    switch (status) {
      case "available":
        return "Available";
      case "scheduled":
        return "Scheduled";
      case "completed":
        return "Completed";
    }
  }, []);

  const renderRestaurant = useCallback(
    ({ item, index }: { item: Restaurant; index: number }) => {
      return (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.75}
          onPress={() =>
            router.push({ pathname: "/(tabs)/home/details", params: { id: item.id } })
          }
          testID={`restaurant-${item.id}`}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            contentFit="cover"
          />
          <View style={styles.cardOverlay}>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>
                {item.mealsAvailable} meals
              </Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.ratingRow}>
                <Star
                  size={14}
                  color={Colors.dark.accent}
                  fill={Colors.dark.accent}
                />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <MapPin size={13} color={Colors.dark.textMuted} />
                <Text style={styles.metaText}>{item.distance}</Text>
              </View>
              <Text style={styles.cuisineText}>{item.cuisine}</Text>
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(item.pickupStatus) },
                  ]}
                />
                <Text style={styles.statusText}>
                  {getStatusLabel(item.pickupStatus)}
                </Text>
              </View>
              <View style={styles.viewMealsBtn}>
                <Text style={styles.viewMealsText}>View Meals</Text>
                <ChevronRight size={14} color={Colors.dark.accent} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [router, getStatusColor, getStatusLabel]
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Search size={18} color={Colors.dark.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants or cuisine..."
            placeholderTextColor={Colors.dark.textMuted}
            value={search}
            onChangeText={setSearch}
            testID="search-input"
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Text style={styles.statNumber}>{restaurants.length}</Text>
          <Text style={styles.statLabel}>Restaurants</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statNumber}>
            {restaurants.reduce((a, b) => a + b.mealsAvailable, 0)}
          </Text>
          <Text style={styles.statLabel}>Meals Available</Text>
        </View>
        <View style={[styles.statChip, styles.statChipAccent]}>
          <Text style={[styles.statNumber, { color: Colors.dark.black }]}>
            {restaurants.filter((r) => r.pickupStatus === "available").length}
          </Text>
          <Text style={[styles.statLabel, { color: Colors.dark.black }]}>
            Ready Now
          </Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderRestaurant}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No restaurants found</Text>
          </View>
        }
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  searchWrapper: {
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark.text,
  },
  statsRow: {
    flexDirection: "row" as const,
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  statChip: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statChipAccent: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.dark.textMuted,
    marginTop: 2,
    fontWeight: "500" as const,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden" as const,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  cardOverlay: {
    position: "absolute" as const,
    top: 12,
    right: 12,
  },
  cardBadge: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  cardBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.dark.black,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    flex: 1,
    marginRight: 8,
  },
  ratingRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.dark.text,
  },
  cardMeta: {
    flexDirection: "row" as const,
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },
  metaItem: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  cuisineText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden" as const,
  },
  cardFooter: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  statusRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    fontWeight: "500" as const,
  },
  viewMealsBtn: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 2,
  },
  viewMealsText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.dark.accent,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.dark.textMuted,
  },
});
