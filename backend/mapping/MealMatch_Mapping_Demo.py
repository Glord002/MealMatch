
from geopy.geocoders import Nominatim
import requests
import time

geolocator = Nominatim(user_agent="mealmatch-mapping-demo")

def geocode(address):
    location = geolocator.geocode(address)
    if not location:
        return None
    return location.latitude, location.longitude

def get_route(start_lat, start_lon, end_lat, end_lon):
    url = (
        "http://router.project-osrm.org/route/v1/driving/"
        f"{start_lon},{start_lat};{end_lon},{end_lat}"
        "?overview=false"
    )

    response = requests.get(url)
    data = response.json()

    if data.get("code") != "Ok":
        return None

    route = data["routes"][0]
    distance_km = route["distance"] / 1000
    duration_min = route["duration"] / 60

    return distance_km, duration_min

def main():
    print("=== MealMatch Mapping Demo ===\n")

    user_address = input("Enter your location: ")

    restaurants = [
        ("Pizza Place", "11 Clinton St, Plattsburgh, NY"),
        ("Sushi Spot", "8 Margaret St, Plattsburgh, NY"),
        ("Coffee Bar", "37 Court St, Plattsburgh, NY"),
    ]

    user_coords = geocode(user_address)

    if not user_coords:
        print("Could not find your location.")
        return

    user_lat, user_lon = user_coords

    print("\nFinding nearest restaurants...\n")

    results = []

    for name, address in restaurants:
        coords = geocode(address)
        time.sleep(1)

        if not coords:
            continue

        lat, lon = coords
        route = get_route(user_lat, user_lon, lat, lon)

        if not route:
            continue

        distance, duration = route
        results.append((name, distance, duration))

    results.sort(key=lambda x: x[1])

    for i, (name, distance, duration) in enumerate(results, start=1):
        print(f"{i}. {name}")
        print(f"   Distance: {distance:.2f} km")
        print(f"   Drive Time: {duration:.0f} minutes\n")

if __name__ == "__main__":
    main()
