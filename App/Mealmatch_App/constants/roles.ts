import type { ComponentType } from "react";
import { Users, Truck, Heart, UtensilsCrossed } from "lucide-react-native";

export type UserRole = "student" | "distributor" | "volunteer" | "restaurant";

export const USER_ROLES: UserRole[] = [
  "student",
  "distributor",
  "volunteer",
  "restaurant",
];

export type RoleIconProps = { size?: number; color?: string };

export function parseUserRole(value: string | undefined): UserRole | null {
  if (!value) return null;
  return USER_ROLES.includes(value as UserRole) ? (value as UserRole) : null;
}

/** Expo Router search params may be string | string[]. */
export function roleFromSearchParam(
  param: string | string[] | undefined
): UserRole | null {
  if (param == null) return null;
  const s = Array.isArray(param) ? param[0] : param;
  return parseUserRole(s);
}

type ProfileStats = {
  v1: string;
  l1: string;
  v2: string;
  l2: string;
  v3: string;
  l3: string;
};

type ProfileImpact = {
  title: string;
  v1: string;
  l1: string;
  v2: string;
  l2: string;
};

export const ROLE_META: Record<
  UserRole,
  {
    label: string;
    signInTitle: string;
    signUpTitle: string;
    signInSubtitle: string;
    signUpSubtitle: string;
    profileHeadline: string;
    stats: ProfileStats;
    impact: ProfileImpact;
    Icon: ComponentType<RoleIconProps>;
  }
> = {
  student: {
    label: "Student",
    signInTitle: "Student Sign In",
    signUpTitle: "Student Sign Up",
    signInSubtitle: "Sign in to find free meals near you",
    signUpSubtitle: "Create an account to discover meals nearby",
    profileHeadline: "Finding free meals near you",
    Icon: Users,
    stats: {
      v1: "24",
      l1: "Meals saved",
      v2: "8",
      l2: "Favorites",
      v3: "12",
      l3: "Check-ins",
    },
    impact: {
      title: "Your impact",
      v1: "48 lbs",
      l1: "Food accessed",
      v2: "18 kg",
      l2: "CO₂ equivalent",
    },
  },
  distributor: {
    label: "Distributor",
    signInTitle: "Distributor Sign In",
    signUpTitle: "Distributor Sign Up",
    signInSubtitle: "Sign in to manage food logistics",
    signUpSubtitle: "Create an account to coordinate deliveries",
    profileHeadline: "Managing food logistics",
    Icon: Truck,
    stats: {
      v1: "142",
      l1: "Deliveries",
      v2: "18",
      l2: "Active routes",
      v3: "6",
      l3: "Partners",
    },
    impact: {
      title: "Logistics impact",
      v1: "2.1k mi",
      l1: "Distance covered",
      v2: "340",
      l2: "Meals moved",
    },
  },
  volunteer: {
    label: "Volunteer",
    signInTitle: "Volunteer Sign In",
    signUpTitle: "Volunteer Sign Up",
    signInSubtitle: "Sign in to help deliver meals",
    signUpSubtitle: "Create an account to join delivery runs",
    profileHeadline: "Helping deliver meals",
    Icon: Heart,
    stats: {
      v1: "36",
      l1: "Runs",
      v2: "24",
      l2: "Hours",
      v3: "89",
      l3: "People helped",
    },
    impact: {
      title: "Volunteer impact",
      v1: "120 lbs",
      l1: "Food delivered",
      v2: "14",
      l2: "Communities",
    },
  },
  restaurant: {
    label: "Restaurant",
    signInTitle: "Restaurant Sign In",
    signUpTitle: "Restaurant Sign Up",
    signInSubtitle: "Sign in to manage your food donations",
    signUpSubtitle: "Create an account to donate surplus food",
    profileHeadline: "Donating surplus food",
    Icon: UtensilsCrossed,
    stats: {
      v1: "24",
      l1: "Meals saved",
      v2: "5",
      l2: "Donations",
      v3: "12",
      l3: "Pickups",
    },
    impact: {
      title: "Your impact",
      v1: "48 lbs",
      l1: "Food rescued",
      v2: "32 kg",
      l2: "CO₂ saved",
    },
  },
};
