import { fetchClient } from "@/api";
import { getItemAsync, setItemAsync } from "expo-secure-store";

const rotateToken = async (refreshToken: string) => {
  const { response, data } = await fetchClient.POST("/api/auth/token/refresh", {
    body: { refresh_token: refreshToken }
  });

  if (response.ok && data) {
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    return { accessToken, refreshToken };
  }

  return null;
};

export const isAuthenticated = async () => {
  const accessToken = await getItemAsync("accessToken");
  const refreshToken = await getItemAsync("refreshToken");

  if (!accessToken || !refreshToken) return false;

  const { response } = await fetchClient.GET("/api/auth/token/verify");
  if (response.ok) return true;

  const rotatedTokens = await rotateToken(refreshToken);
  if (!rotatedTokens) return false;

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    rotatedTokens;

  await setItemAsync("accessToken", newAccessToken);
  await setItemAsync("refreshToken", newRefreshToken);

  return true;
};
