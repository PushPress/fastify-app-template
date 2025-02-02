import { getHealthOptions } from "@/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

/**
 * Example hook using @hey-api client codegen with react-query
 * https://heyapi.dev/openapi-ts/plugins/tanstack-query
 */
export function useHookExample() {
  return useQuery({
    ...getHealthOptions(),
  });
}
