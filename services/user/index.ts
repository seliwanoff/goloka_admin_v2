import { queryClient } from "@/components/layout/tanstackProvider";
import { postData } from "@/lib/api";
import { UseQueryResult } from "@tanstack/react-query";
import { ServerResponse } from "http";

export const passwordOTP = async (
  data: any
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["PASSWORD OTP"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>("password/update", data);
    },
  });
};
