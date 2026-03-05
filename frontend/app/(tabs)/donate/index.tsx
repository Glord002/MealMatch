import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Store,
  UserCircle,
  Phone,
  Mail,
  UtensilsCrossed,
  Package,
  Clock,
  Check,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { foodTags, allergensList } from "@/mocks/restaurants";

export default function DonateScreen() {
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [contactName, setContactName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [foodType, setFoodType] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [pickupTime, setPickupTime] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  };

  const handleSubmit = () => {
    if (!restaurantName || !contactName || !foodType || !quantity) {
      Alert.alert("Missing Fields", "Please fill in all required fields");
      return;
    }
    console.log("Donation submitted:", {
      restaurantName,
      contactName,
      phone,
      email,
      foodType,
      quantity,
      description,
      pickupTime,
      selectedTags,
      selectedAllergens,
    });
    Alert.alert("Success", "Your food donation has been submitted!", [
      {
        text: "OK",
        onPress: () => {
          setRestaurantName("");
          setContactName("");
          setPhone("");
          setEmail("");
          setFoodType("");
          setQuantity("");
          setDescription("");
          setPickupTime("");
          setSelectedTags([]);
          setSelectedAllergens([]);
        },
      },
    ]);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerCard}>
            <View style={styles.headerIcon}>
              <UtensilsCrossed size={24} color={Colors.dark.black} />
            </View>
            <Text style={styles.headerTitle}>Donate Surplus Food</Text>
            <Text style={styles.headerSubtitle}>
              Help reduce waste and feed those in need
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Restaurant Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Restaurant Name *</Text>
              <View style={styles.inputWrapper}>
                <Store size={16} color={Colors.dark.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter restaurant name"
                  placeholderTextColor={Colors.dark.textMuted}
                  value={restaurantName}
                  onChangeText={setRestaurantName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Person *</Text>
              <View style={styles.inputWrapper}>
                <UserCircle size={16} color={Colors.dark.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor={Colors.dark.textMuted}
                  value={contactName}
                  onChangeText={setContactName}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Phone</Text>
                <View style={styles.inputWrapper}>
                  <Phone size={16} color={Colors.dark.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={16} color={Colors.dark.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Food Information</Text>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Food Type *</Text>
                <View style={styles.inputWrapper}>
                  <UtensilsCrossed size={16} color={Colors.dark.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Pasta"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={foodType}
                    onChangeText={setFoodType}
                  />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Quantity *</Text>
                <View style={styles.inputWrapper}>
                  <Package size={16} color={Colors.dark.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Servings"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe the food being donated..."
                  placeholderTextColor={Colors.dark.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Preferred Pickup Time</Text>
              <View style={styles.inputWrapper}>
                <Clock size={16} color={Colors.dark.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 2:00 PM - 4:00 PM"
                  placeholderTextColor={Colors.dark.textMuted}
                  value={pickupTime}
                  onChangeText={setPickupTime}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Food Tags</Text>
            <View style={styles.chipContainer}>
              {foodTags.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.chip, isActive && styles.chipActive]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.7}
                  >
                    {isActive && (
                      <Check size={13} color={Colors.dark.black} />
                    )}
                    <Text
                      style={[
                        styles.chipText,
                        isActive && styles.chipTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergens</Text>
            <View style={styles.chipContainer}>
              {allergensList.map((allergen) => {
                const isActive = selectedAllergens.includes(allergen);
                return (
                  <TouchableOpacity
                    key={allergen}
                    style={[
                      styles.chip,
                      styles.allergenChip,
                      isActive && styles.allergenChipActive,
                    ]}
                    onPress={() => toggleAllergen(allergen)}
                    activeOpacity={0.7}
                  >
                    {isActive && (
                      <Check size={13} color={Colors.dark.black} />
                    )}
                    <Text
                      style={[
                        styles.chipText,
                        isActive && styles.allergenChipTextActive,
                      ]}
                    >
                      {allergen}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
            testID="submit-donation"
          >
            <Text style={styles.submitButtonText}>Submit Donation</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.dark.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.dark.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.dark.textSecondary,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: Colors.dark.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  textAreaWrapper: {
    height: 90,
    alignItems: "flex-start",
    paddingTop: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark.text,
  },
  textArea: {
    height: 66,
  },
  row: {
    flexDirection: "row" as const,
    gap: 12,
  },
  chipContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  chip: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  chipActive: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.dark.textSecondary,
  },
  chipTextActive: {
    color: Colors.dark.black,
  },
  allergenChip: {
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  allergenChipActive: {
    backgroundColor: Colors.dark.warning,
    borderColor: Colors.dark.warning,
  },
  allergenChipTextActive: {
    color: Colors.dark.black,
  },
  submitButton: {
    backgroundColor: Colors.dark.accent,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.dark.black,
  },
});