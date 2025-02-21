/* eslint-disable @typescript-eslint/no-explicit-any */

import { queryClient } from "@/components/layout/tanstackProvider";
import { fetchData, postData, ServerResponse } from "@/lib/api";
import { useContributorStore } from "@/stores/contributors";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export type ServerResponseOrNull<T> = ServerResponse<T> | null;

export const getDashboardChartStats = async (params?: {
  year?: string;
  time_filter?: string;
  start_date?: string;
  end_date?: string;
}): Promise<ServerResponseOrNull<any>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.year) queryParams.set("year", params.year);
    if (params?.time_filter) queryParams.set("time_filter", params.time_filter);
    if (params?.start_date) queryParams.set("start_date", params.start_date);
    if (params?.end_date) queryParams.set("end_date", params.end_date);

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return await fetchData<ServerResponse<any>>(
      `dashboard/chart${queryString}`
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getWidgetData = async (params?: {
  year?: string;
  time_filter?: string;
  start_date?: string;
  end_date?: string;
}): Promise<ServerResponseOrNull<any>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.year) queryParams.set("year", params.year);
    if (params?.time_filter) queryParams.set("time_filter", params.time_filter);
    if (params?.start_date) queryParams.set("start_date", params.start_date);
    if (params?.end_date) queryParams.set("end_date", params.end_date);

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return await fetchData<ServerResponse<any>>(
      `dashboard/analytics${queryString}`
    );
  } catch (error) {
    console.error(error);
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
export const getUsersStats = async (): Promise<ServerResponseOrNull<any>> => {
  try {
    return await fetchData<ServerResponse<any>>("/users/stats");
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getRecentCampaigns = async (params?: {
  per_page?: number;
  page?: number;
}): Promise<ServerResponseOrNull<any>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.per_page)
      queryParams.set("per_page", params.per_page.toString());
    if (params?.page) queryParams.set("page", params.page.toString());

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return await fetchData<ServerResponse<any>>(
      `recent-campaigns${queryString}`
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getUsers = async (params?: {
  user_type: string;
  status?: string;
  per_page?: number;
  page?: number;
}): Promise<ServerResponseOrNull<any>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.per_page)
      queryParams.set("per_page", params.per_page.toString());
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.user_type) queryParams.set("user_type", params.user_type.toString());
    if (params?.status) queryParams.set("status", params.status.toString());

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return await fetchData<ServerResponse<any>>(`users${queryString}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getRecentUsers = async (params?: {
  user_type?: string;
  per_page?: number;
  page?: number;
}): Promise<ServerResponseOrNull<any>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.user_type) queryParams.set("user_type", params.user_type);
    if (params?.per_page)
      queryParams.set("per_page", params.per_page.toString());
    if (params?.page) queryParams.set("page", params.page.toString());

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return await fetchData<ServerResponse<any>>(`recent-users${queryString}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAdminReports = async (params?: {
  per_page?: number;
  page?: number;
}): Promise<ServerResponseOrNull<any>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.per_page)
      queryParams.set("per_page", params.per_page.toString());
    if (params?.page) queryParams.set("page", params.page.toString());

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return await fetchData<ServerResponse<any>>(`reports${queryString}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllCampaigns = async (params?: {
  per_page?: number;
  page?: number;
  status?: string;
  search?: string;
  submitted_at?: Date;
}): Promise<ServerResponseOrNull<any>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.per_page)
      queryParams.set("per_page", params.per_page.toString());
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.status) queryParams.set("status", params.status);
    if (params?.search) queryParams.set("search", params.search);
    if (params?.submitted_at)
      queryParams.set("submitted_at", params.submitted_at.toISOString());

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return await fetchData<ServerResponse<any>>(`campaigns${queryString}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// export const getCampaignById = async (
//   Id: string
// ): Promise<UseQueryResult<AxiosResponse<any>>> =>
//   await queryClient.fetchQuery({
//     queryKey: ["Task by TaskId"],
//     queryFn: async () => {
//       try {
//         return await fetchData(`campaigns/${Id}/questions`);
//       } catch (error) {
//         // return null;
//         console.log(error);
//       }
//     },
//   });

export const getCampaignById = async (
  id: string
): Promise<UseQueryResult<any>> => {
  return await queryClient.fetchQuery({
    queryKey: ["campaign by TaskId", id], // Include id in queryKey for proper caching
    queryFn: async () => {
      try {
        const response = await fetchData<any>(`campaigns/${id}/questions`);
        if (!response) {
          throw new Error("No data received from server");
        }

        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            error.response?.data?.message || "Failed to fetch campaign data"
          );
        }
        throw new Error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};
export const getUserById = async (
  id: string
): Promise<UseQueryResult<any>> => {
  return await queryClient.fetchQuery({
    queryKey: ["user by", id], // Include id in queryKey for proper caching
    queryFn: async () => {
      try {
        const response = await fetchData<any>(`users/${id}/?user_type=contributor`);
        if (!response) {
          throw new Error("No data received from server");
        }

        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            error.response?.data?.message || "Failed to fetch campaign data"
          );
        }
        throw new Error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

// export const updateCampaignStatus = async (
//   Id: string
// ): Promise<UseQueryResult<AxiosResponse<any>>> =>
//   await queryClient.fetchQuery({
//     queryKey: ["Task by TaskId"],
//     queryFn: async () => {
//       try {
//         return await fetchData(`campaigns/${Id}/questions`);
//       } catch (error) {
//         // return null;
//         console.log(error);
//       }
//     },
//   });

// ~ =============================================>
// ~ ======= Update a user by its id  -->
// ~ =============================================>
// export const updateCampaignStatus = async (
//   userId: string,
// ): Promise<ServerResponseOrNull<any>> => {
//   try {
//     return await updateDataById<ServerResponse<any>>(
//       `campaigns/${userId}/status-update`,
//     );
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

// export const updateCampaignStatus = async (
//   userId: string,
//   data: FormData
// ): Promise<ServerResponseOrNull<any>> => {
//   try {
//     return await updateDataById<ServerResponse<any>>(
//       `campaigns/${userId}/status-update`,
//       data
//     );
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

export const updateCampaignStatus = async (
  userId: string,
  data: FormData
): Promise<UseQueryResult<AxiosResponse<any>>> =>
  await queryClient.fetchQuery({
    queryKey: ["ResetPassword"],
    queryFn: async () => {
      try {
        return await postData<ServerResponse<any>>(
          `campaigns/${userId}/status-update`,
          data
        );
      } catch (error) {
        console.error("Error updating campaigns:", error);
        throw error;
      }
    },
  });
