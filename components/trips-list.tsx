import { api } from "@/api";
import type { components } from "@/api/paths";

type Trip = components["schemas"]["TripResponse"];

export default function TripsList() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    api.useInfiniteQuery(
      "get",
      "/api/trips/",
      {
        params: {
          query: {
            limit: 10
          }
        }
      },
      {
        pageParamName: "cursor_date",
        getNextPageParam: (lastPage) => lastPage.at(-1)?.created_at,
        initialPageParam: undefined
      }
    );

  return;
}
