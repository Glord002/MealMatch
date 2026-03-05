export type UserRole = "student" | "distributor" | "volunteer" | "restaurant";

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  distance: string;
  rating: number;
  mealsAvailable: number;
  image: string;
  latitude: number;
  longitude: number;
  pickupStatus: "available" | "scheduled" | "completed";
  phone: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  tags: string[];
  allergens: string[];
  quantity: number;
  restaurantId: string;
}

export interface DonationForm {
  restaurantName: string;
  contactName: string;
  phone: string;
  email: string;
  foodType: string;
  quantity: string;
  description: string;
  tags: string[];
  allergens: string[];
  pickupTime: string;
}