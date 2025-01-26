/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchData, ServerResponse } from "@/lib/api";

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

    return await fetchData<ServerResponse<any>>(
      `recent-users${queryString}`
    );
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