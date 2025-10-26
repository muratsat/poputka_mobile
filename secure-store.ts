import * as SecureStore from "expo-secure-store";

type Key = "phoneNumber" | "accessToken" | "refreshToken";

export const getItem = async (key: Key) => {
  const value = await SecureStore.getItemAsync(key);
  return value;
};

export const setItem = async (key: Key, value: string) => {
  await SecureStore.setItemAsync(key, value);
};
