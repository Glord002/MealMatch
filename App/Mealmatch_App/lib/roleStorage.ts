import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserRole } from "@/constants/roles";
import { parseUserRole } from "@/constants/roles";

const STORAGE_KEY = "@mealmatch/user_role";

export async function setUserRole(role: UserRole): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, role);
}

export async function getUserRole(): Promise<UserRole | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return parseUserRole(raw ?? undefined);
}

export async function clearUserRole(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
