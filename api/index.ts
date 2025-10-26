import { env } from "@/constants/env";
import { getItem } from "@/secure-store";
import createFetchClient, { Middleware } from "openapi-fetch";
import type { paths } from "./paths";


const languageMiddleware: Middleware = {
  async onRequest({ request }) {
     const accessToken = await getItem("accessToken")

    request.headers.set("Authorization", `Bearer ${accessToken}`);

    return request;
  }
};

export const fetchClient = createFetchClient<paths>({
  baseUrl: env.EXPO_PUBLIC_API_URL,
  cache: "no-cache"
});

fetchClient.use(languageMiddleware);
