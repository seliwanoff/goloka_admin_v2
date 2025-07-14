import { fetchData } from "@/lib/api";
import { AxiosResponse } from "axios";

export const getAllResports = async (id?: string): Promise<AxiosResponse> => {
  try {
    return await fetchData(`reports`);
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error; // Throw the error so it can be caught in the useQuery hook
  }
};

export const getAResportByID = async (id?: string): Promise<AxiosResponse> => {
  try {
    return await fetchData(`reports/${id}`);
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error; // Throw the error so it can be caught in the useQuery hook
  }
};
