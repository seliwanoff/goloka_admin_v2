import { queryClient } from "@/components/layout/tanstackProvider";
import { fetchData } from "@/lib/api";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const getAResponse = async (
  Id: string
): Promise<UseQueryResult<AxiosResponse<any[]>>> =>
  await queryClient.fetchQuery({
    queryKey: ["get a Response"],
    queryFn: async () => {
      try {
        return await fetchData(`/reported-response/${Id}`);
      } catch (error) {
        return null;
      }
    },
  });
