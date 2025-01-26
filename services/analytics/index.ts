/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchData, ServerResponse } from "@/lib/api";

export type ServerResponseOrNull<T> = ServerResponse<T> | null;

export const getDashboardStats = async (): Promise<
  ServerResponseOrNull<any>
> => {
  try {
    return await fetchData<ServerResponse<any>>(
      "/contributor/analytics/stat-two"
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getPlacesWithHighestTask = async (): Promise<
  ServerResponseOrNull<any>
> => {
  try {
    return await fetchData<ServerResponse<any>>(
      "contributor/analytics/stat-three"
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getResponseStats = async (): Promise<
  ServerResponseOrNull<any>
> => {
  try {
    return await fetchData<ServerResponse<any>>(
      "/contributor/analytics/stat-one"
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};
