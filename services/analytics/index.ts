/* eslint-disable @typescript-eslint/no-explicit-any */

import { queryClient } from "@/components/layout/tanstackProvider";
import { deleteData, fetchData, postData, ServerResponse } from "@/lib/api";
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

export const getDonotStart = async (params?: {
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
      `/dashboard/donut${queryString}`
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

export const getAllRoles = async (): Promise<ServerResponseOrNull<any>> => {
  try {
    return await fetchData<ServerResponse<any>>("/roles");
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getRoleByStaff = async (
  id: string
): Promise<ServerResponseOrNull<any>> => {
  try {
    return await fetchData<ServerResponse<any>>(`/staffs/${id}`);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createRole = async (
  payload: any
): Promise<ServerResponseOrNull<any>> => {
  try {
    return await postData<ServerResponse<any>>(`/roles/create`, payload);
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
  search?: string;
}): Promise<ServerResponseOrNull<any>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.per_page)
      queryParams.set("per_page", params.per_page.toString());
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.user_type)
      queryParams.set("user_type", params.user_type.toString());
    if (params?.status) queryParams.set("status", params.status.toString());

    if (params?.search) queryParams.set("search", params.search.toString());

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return await fetchData<ServerResponse<any>>(`users${queryString}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUsersCount = async (params?: {
  user_type: string;
  status?: string;
  per_page?: number;
  page?: number;
  search?: string;
}): Promise<ServerResponseOrNull<any>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.per_page)
      queryParams.set("per_page", params.per_page.toString());
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.user_type)
      queryParams.set("user_type", params.user_type.toString());
    if (params?.status) queryParams.set("status", params.status.toString());

    if (params?.search) queryParams.set("search", params.search.toString());

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return await fetchData<ServerResponse<any>>(`transactions/analytics/get`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getWithdrawalRequestCount = async (): Promise<
  ServerResponseOrNull<any>
> => {
  try {
    return await fetchData<ServerResponse<any>>(`transactions/manual/stats`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getFinanceCount = async (): Promise<ServerResponseOrNull<any>> => {
  try {
    return await fetchData<ServerResponse<any>>(`transactions/analytics/get`);
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
  submittted_at?: Date;
}): Promise<ServerResponseOrNull<any>> => {
  //@ts-ignore
  // console.log(params.submittted_at.toISOString() || undefined);
  try {
    const queryParams = new URLSearchParams();

    if (params?.per_page)
      queryParams.set("per_page", params.per_page.toString());
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.status) queryParams.set("status", params.status);
    if (params?.search) queryParams.set("search", params.search);
    if (params?.submittted_at)
      queryParams.set("submitted_at", params.submittted_at.toISOString());

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return await fetchData<ServerResponse<any>>(`campaigns${queryString}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllWithdrawalRequests = async (params?: {
  per_page?: number;
  page?: number;
  status?: string;
  search?: string;
  submitted_at?: any;
}): Promise<ServerResponseOrNull<any>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.per_page)
      queryParams.set("per_page", params.per_page.toString());
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.status) queryParams.set("status", params.status);
    if (params?.search) queryParams.set("search", params.search);
    if (params?.submitted_at) queryParams.set("date", params.submitted_at);

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return await fetchData<ServerResponse<any>>(
      `transactions/manual${queryString}`
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllFinance = async (params?: {
  per_page?: number;
  page?: number;
  type?: string;
  search?: string;
  submitted_at?: any;
}): Promise<ServerResponseOrNull<any>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.per_page)
      queryParams.set("per_page", params.per_page.toString());
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.type) queryParams.set("type", params.type);
    if (params?.search) queryParams.set("search", params.search);
    if (params?.submitted_at) queryParams.set("date", params.submitted_at);

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return await fetchData<ServerResponse<any>>(`transactions${queryString}`);
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

interface UserParams {
  user_type?: "contributor" | "organization";
  per_page?: number;
  page?: number;
  search?: string;
  status?: string;
}

// export const getUserById = async (
//   id: string,
//   user_type: string
// ): Promise<UseQueryResult<any>> => {
//   return await queryClient.fetchQuery({
//     queryKey: ["user by", id], // Include id in queryKey for proper caching
//     queryFn: async () => {
//       try {
//         const response = await fetchData<any>(`users/${id}/?${user_type}`);
//         if (!response) {
//           throw new Error("No data received from server");
//         }

//         return response;
//       } catch (error) {
//         if (error instanceof AxiosError) {
//           throw new Error(
//             error.response?.data?.message || "Failed to fetch campaign data"
//           );
//         }
//         throw new Error(
//           error instanceof Error
//             ? error.message
//             : "An unexpected error occurred"
//         );
//       }
//     },
//     staleTime: 5 * 60 * 1000,
//   });
// };
// export const getUserReports = async (id: string, params?: {
//   per_page?: number;
//   page?: number;
//   search?: string;
//   status?: string;
// }): Promise<UseQueryResult<any>> => {
//   return await queryClient.fetchQuery({
//     queryKey: ["userReport", id],
//     queryFn: async () => {
//       try {
//         const response = await fetchData<any>(
//           `users/${id}/reports?user_type=contributor`
//         );
//         if (!response) {
//           throw new Error("No data received from server");
//         }

//         return response;
//       } catch (error) {
//         if (error instanceof AxiosError) {
//           throw new Error(
//             error.response?.data?.message || "Failed to fetch campaign data"
//           );
//         }
//         throw new Error(
//           error instanceof Error
//             ? error.message
//             : "An unexpected error occurred"
//         );
//       }
//     },
//     staleTime: 5 * 60 * 1000,
//   });
// };

// export const getUserReports = async (
//   id: string,
//   params?: {
//     per_page?: number;
//     page?: number;
//     search?: string;
//     status?: string;
//     usertype?: string;
//   }
// ) => {
//   // Remove the UseQueryResult return type
//   try {
//     const response = await fetchData<any>(
//       `users/${id}/reports?${params?.usertype}`
//     );
//     if (!response) {
//       throw new Error("No data received from server");
//     }

//     return response;
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       throw new Error(
//         error.response?.data?.message || "Failed to fetch campaign data"
//       );
//     }
//     throw new Error(
//       error instanceof Error ? error.message : "An unexpected error occurred"
//     );
//   }
// };
// export const modifyUser = async (
//   id: string,
//   type: string
// ): Promise<UseQueryResult<any>> => {
//   return await queryClient.fetchQuery({
//     queryKey: ["modify by", id, type],
//     queryFn: async () => {
//       try {
//         const response = await fetchData<any>(
//           `users/${id}/${type}/?user_type=contributor`
//         );
//         if (!response) {
//           throw new Error("No data received from server");
//         }

//         return response;
//       } catch (error) {
//         if (error instanceof AxiosError) {
//           throw new Error(
//             error.response?.data?.message || "Failed to fetch campaign data"
//           );
//         }
//         throw new Error(
//           error instanceof Error
//             ? error.message
//             : "An unexpected error occurred"
//         );
//       }
//     },
//     staleTime: 5 * 60 * 1000,
//   });
// };

export const getUserById = async (
  id: string,
  params: { userType: string }
): Promise<UseQueryResult<any>> => {
  return await queryClient.fetchQuery({
    queryKey: ["user by", id, params.userType],
    queryFn: async () => {
      try {
        const queryString = new URLSearchParams({
          user_type: params.userType,
        }).toString();

        const response = await fetchData<any>(`users/${id}?${queryString}`);
        if (!response) {
          throw new Error("No data received from server");
        }

        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            error.response?.data?.message || "Failed to fetch user data"
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

export const getStaffById = async (
  id: string
): Promise<UseQueryResult<any>> => {
  return await queryClient.fetchQuery({
    queryKey: ["user by", id],
    queryFn: async () => {
      try {
        const response = await fetchData<any>(`staffs/${id}`);
        if (!response) {
          throw new Error("No data received from server");
        }

        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            error.response?.data?.message || "Failed to fetch user data"
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

export const deleteMember = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    return await deleteData(`/staffs/${id}/delete`);
  } catch (error) {
    console.error("Error fetching delete member:", error);
    throw error;
  }
};

export const inviteStaffMember = async (
  data: any
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["invite staff "],
    queryFn: async () => {
      return await postData<ServerResponse<any>>(`/staffs/create`, data);
    },
  });
};

export const assignPermissions = async (
  id: any,
  data: any
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["invite staff "],
    queryFn: async () => {
      return await postData<ServerResponse<any>>(
        `staffs/${id}/permissions/assign`,
        data
      );
    },
  });
};

export const deactivateAMember = async (
  id: any
): Promise<AxiosResponse<any>> => {
  try {
    return await postData(`/staffs/${id}/deactivate`);
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};

export const activateAmember = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    return await postData(`/staffs/${id}/activate`);
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};

export const getUserReports = async (id: string, params: UserParams) => {
  try {
    const queryString = new URLSearchParams({
      ...(params.user_type && { user_type: params.user_type }),
      ...(params.per_page && { per_page: params.per_page.toString() }),
      ...(params.page && { page: params.page.toString() }),
      ...(params.search && { search: params.search }),
      ...(params.status && { status: params.status }),
    }).toString();

    const response = await fetchData<any>(`users/${id}/reports?${queryString}`);

    if (!response) {
      throw new Error("No data received from server");
    }

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user reports"
      );
    }
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};
export const getStaff = async ( params: any) => {
  try {
    const queryString = new URLSearchParams({

      ...(params.per_page && { per_page: params.per_page.toString() }),
      ...(params.page && { page: params.page.toString() }),
      ...(params.search && { search: params.search }),
      ...(params.status && { status: params.status }),
    }).toString();

    const response = await fetchData<any>(
      `staffs?${queryString}`
    );

    if (!response) {
      throw new Error("No data received from server");
    }

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch staff information"
      );
    }
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};
export const getUserContributions = async (id: string, params: UserParams) => {
  try {
    const queryString = new URLSearchParams({
      ...(params.user_type && { user_type: params.user_type }),
      ...(params.per_page && { per_page: params.per_page.toString() }),
      ...(params.page && { page: params.page.toString() }),
      ...(params.search && { search: params.search }),
      ...(params.status && { status: params.status }),
    }).toString();

    const response = await fetchData<any>(
      `users/${id}/contributions?${queryString}`
    );

    if (!response) {
      throw new Error("No data received from server");
    }

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user contributions"
      );
    }
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};

export const modifyUser = async (
  id: string,
  type: string,
  userType: string
): Promise<UseQueryResult<any>> => {
  return await queryClient.fetchQuery({
    queryKey: ["modify by", id, type, userType],
    queryFn: async () => {
      try {
        const queryString = new URLSearchParams({
          user_type: userType,
        }).toString();

        const response = await fetchData<any>(
          `users/${id}/${type}?${queryString}`
        );

        if (!response) {
          throw new Error("No data received from server");
        }

        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            error.response?.data?.message || "Failed to modify user"
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

export const updateCampaignStatus = async (
  userId: string,
  data: FormData
): Promise<UseQueryResult<AxiosResponse<any>>> =>
  await queryClient.fetchQuery({
    queryKey: ["campaign_status"],
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
export const updateUserStatus = async (
  userId: number,
  status: string,
  userType: string,
  reason?: string
) => {
  const formData = new FormData();
  if (reason) {
    formData.append("reason", reason);
  }

  try {
    const response = await postData<ServerResponse<any>>(
      `users/${userId}/${status}?user_type=${userType}`,
      formData
    );
    return response;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};
