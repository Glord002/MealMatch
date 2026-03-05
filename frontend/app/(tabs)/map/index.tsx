import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,

} from "react-native";
import { MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react-native";
import Colors from "@/constants/colors";
import { restaurants } from "@/mocks/restaurants";
import { Restaurant } from "@/types";

export default function MapScreen() {
  const [selectedPin, setSelectedPin] = useState<Restaurant | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const getStatusIcon = (status: Restaurant["pickupStatus"]) => {
    switch (status) {
      case "available":
        return <CheckCircle size={16} color={Colors.dark.success} />;
      case "scheduled":
        return <Clock size={16} color={Colors.dark.warning} />;
      case "completed":
        return <AlertCircle size={16} color={Colors.dark.textMuted} />;
    }
  };

  const getStatusColor = (status: Restaurant["pickupStatus"]) => {
    switch (status) {
      case "available":
        return Colors.dark.success;
      case "scheduled":
        return Colors.dark.warning;
      case "completed":
        return Colors.dark.textMuted;
    }
  };

  const getStatusLabel = (status: Restaurant["pickupStatus"]) => {
    switch (status) {
      case "available":
        return "Ready for Pickup";
      case "scheduled":
        return "Pickup Scheduled";
      case "completed":
        return "Pickup Completed";
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapGrid}>
          {[...Array(8)].map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 11}%` }]} />
          ))}
          {[...Array(6)].map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 14}%` }]} />
          ))}
        </View>

        {restaurants.map((r, index) => {
          const pinX = 15 + (index * 17) % 70;
          const pinY = 15 + (index * 23) % 60;
          const isSelected = selectedPin?.id === r.id;
          return (
            <TouchableOpacity
              key={r.id}
              style={[
                styles.mapPin,
                {
                  left: `${pinX}%`,
                  top: `${pinY}%`,
                },
                isSelected && styles.mapPinSelected,
              ]}
              onPress={() => setSelectedPin(isSelected ? null : r)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.pinDot,
                  { backgroundColor: getStatusColor(r.pickupStatus) },
                  isSelected && styles.pinDotSelected,
                ]}
              >
                <MapPin size={isSelected ? 18 : 14} color={Colors.dark.white} />
              </View>
              {isSelected && (
                <View style={styles.pinLabel}>
                  <Text style={styles.pinLabelText}>{r.name}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.mapLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.dark.success }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.dark.warning }]} />
            <Text style={styles.legendText}>Scheduled</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.dark.textMuted }]} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
        </View>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.listTitle}>Pickup Locations</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {restaurants.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={[
                styles.locationCard,
                selectedPin?.id === r.id && styles.locationCardActive,
              ]}
              onPress={() => setSelectedPin(r)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.locationIcon,
                  { borderColor: getStatusColor(r.pickupStatus) },
                ]}
              >
                {getStatusIcon(r.pickupStatus)}
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{r.name}</Text>
                <Text style={styles.locationAddress}>{r.address}</Text>
                <View style={styles.locationMeta}>
                  <Text
                    style={[
                      styles.statusLabel,
                      { color: getStatusColor(r.pickupStatus) },
                    ]}
                  >
                    {getStatusLabel(r.pickupStatus)}
                  </Text>
                  <Text style={styles.distanceText}>{r.distance}</Text>
                </View>
              </View>
              <View style={styles.mealsCount}>
                <Text style={styles.mealsNumber}>{r.mealsAvailable}</Text>
                <Text style={styles.mealsLabel}>meals</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  mapPlaceholder: {
    height: 280,
    backgroundColor: Colors.dark.surface,
    margin: 16,
    borderRadius: 20,
    overflow: "hidden" as const,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    position: "relative" as const,
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineH: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.dark.border,
    opacity: 0.4,
  },
  gridLineV: {
    position: "absolute" as const,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: Colors.dark.border,
    opacity: 0.4,
  },
  mapPin: {
    position: "absolute" as const,
    alignItems: "center",
    zIndex: 10,
  },
  mapPinSelected: {
    zIndex: 20,
  },
  pinDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.dark.surface,
  },
  pinDotSelected: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderColor: Colors.dark.accent,
    borderWidth: 3,
  },
  pinLabel: {
    backgroundColor: Colors.dark.black,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 4,
  },
  pinLabelText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.dark.white,
  },
  mapLegend: {
    position: "absolute" as const,
    bottom: 12,
    left: 12,
    flexDirection: "row" as const,
    gap: 14,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  legendItem: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    fontWeight: "500" as const,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    marginBottom: 14,
  },
  locationCard: {
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  locationCardActive: {
    borderColor: Colors.dark.accent,
  },
  locationIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.surfaceLight,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  locationAddress: {
    fontSize: 12,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  locationMeta: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  distanceText: {
    fontSize: 12,
    color: Colors.dark.textMuted,
  },
  mealsCount: {
    alignItems: "center",
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  mealsNumber: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: Colors.dark.accent,
  },
  mealsLabel: {
    fontSize: 10,
    color: Colors.dark.textMuted,
    fontWeight: "500" as const,
  },
});
