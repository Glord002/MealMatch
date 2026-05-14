import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { Clock, CheckCircle, AlertCircle } from "lucide-react-native";
import Colors from "@/constants/colors";
import { restaurants } from "@/mocks/restaurants";
import { Restaurant } from "@/types";


export default function MapScreen() {
  const [selectedPin, setSelectedPin] = useState<Restaurant | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchedLocation, setSearchedLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);


  const fadeAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);


  const showMessage = (message: string) => {
    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert("Map Search", message);
    }
  };


  const handleSearch = async () => {
    if (!searchText.trim()) {
      showMessage("Please enter a location to search.");
      return;
    }


    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchText
        )}&limit=1`
      );


      const data = await response.json();


      if (data.length > 0) {
        setSearchedLocation({
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          name: data[0].display_name,
        });
      } else {
        showMessage("Location not found.");
      }
    } catch (error) {
      showMessage("Search failed. Check your internet connection.");
    }
  };


  const getStatusIcon = (status: Restaurant["pickupStatus"]) => {
    switch (status) {
      case "available":
        return <CheckCircle size={16} color={Colors.dark.success} />;
      case "scheduled":
        return <Clock size={16} color={Colors.dark.warning} />;
      case "completed":
        return <AlertCircle size={16} color={Colors.dark.textMuted} />;
      default:
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
      default:
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
      default:
        return "Unknown Status";
    }
  };


  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />


        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />


        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>


        <style>
          html, body, #map {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            background: #111827;
          }


          .leaflet-popup-content-wrapper {
            border-radius: 12px;
          }


          .popup-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 4px;
          }


          .popup-address {
            font-size: 12px;
            color: #555;
          }


          .popup-meals {
            font-size: 12px;
            margin-top: 4px;
            font-weight: bold;
          }
        </style>
      </head>


      <body>
        <div id="map"></div>


        <script>
          const restaurants = ${JSON.stringify(restaurants)};


          const searchLat = ${
            searchedLocation ? searchedLocation.latitude : "null"
          };
          const searchLng = ${
            searchedLocation ? searchedLocation.longitude : "null"
          };
          const searchName = ${JSON.stringify(searchedLocation?.name || "")};


          const fallbackLat = 44.6995;
          const fallbackLng = -73.4529;


          const firstRestaurantWithCoords = restaurants.find(function(r) {
            return r.latitude && r.longitude;
          });


          const startLat = searchLat || (
            firstRestaurantWithCoords
              ? firstRestaurantWithCoords.latitude
              : fallbackLat
          );


          const startLng = searchLng || (
            firstRestaurantWithCoords
              ? firstRestaurantWithCoords.longitude
              : fallbackLng
          );


          const map = L.map("map").setView([startLat, startLng], 13);


          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
          }).addTo(map);


          if (searchLat && searchLng) {
            L.marker([searchLat, searchLng])
              .addTo(map)
              .bindPopup("<b>Search Result</b><br>" + searchName)
              .openPopup();
          }


          restaurants.forEach(function(r) {
            if (r.latitude && r.longitude) {
              let markerColor = "#22c55e";


              if (r.pickupStatus === "scheduled") {
                markerColor = "#f59e0b";
              }


              if (r.pickupStatus === "completed") {
                markerColor = "#6b7280";
              }


              const customIcon = L.divIcon({
                className: "custom-marker",
                html: \`
                  <div style="
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: \${markerColor};
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                  "></div>
                \`,
                iconSize: [28, 28],
                iconAnchor: [14, 14]
              });


              L.marker([r.latitude, r.longitude], { icon: customIcon })
                .addTo(map)
                .bindPopup(\`
                  <div>
                    <div class="popup-title">\${r.name}</div>
                    <div class="popup-address">\${r.address}</div>
                    <div class="popup-meals">\${r.mealsAvailable} meals available</div>
                  </div>
                \`);
            }
          });
        </script>
      </body>
    </html>
  `;


  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search a location..."
          placeholderTextColor={Colors.dark.textMuted}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />


        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.mapPlaceholder}>
        {Platform.OS === "web" ? (
          // @ts-ignore iframe is only used for Expo Web
          <iframe
            srcDoc={mapHtml}
            title="OpenStreetMap"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        ) : (
          <WebView
            originWhitelist={["*"]}
            source={{ html: mapHtml }}
            style={styles.webView}
            javaScriptEnabled
            domStorageEnabled
          />
        )}
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


  searchContainer: {
    flexDirection: "row" as const,
    marginHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },


  searchInput: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.dark.text,
    fontSize: 14,
  },


  searchButton: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 12,
  },


  searchButtonText: {
    color: Colors.dark.white,
    fontWeight: "700" as const,
    fontSize: 14,
  },


  mapPlaceholder: {
    height: 280,
    backgroundColor: Colors.dark.surface,
    margin: 16,
    borderRadius: 20,
    overflow: "hidden" as const,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },


  webView: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
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

