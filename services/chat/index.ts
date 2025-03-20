import { ServerResponse } from "http";
import { Chat, ChatParams, CreateChatParams } from "./types";
import { fetchData, postDataWithFormData } from "@/lib/api";

export const getChatMessages = async (
  params: ChatParams
): Promise<ServerResponse> => {
  try {
    const query = new URLSearchParams({
      model_type: params.model_type,
      model_id: params.model_id.toString(),
    });

    const apiUrl = `https://staging.goloka.io/api/chats?${query.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chat messages.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw new Error("Failed to fetch chat messages. Please try again later.");
  }
};

export const createChatMessage = async (
  data: CreateChatParams
): Promise<ServerResponse> => {
  try {
    const formData = new FormData();

    if (data.message) formData.append("message", data.message);
    formData.append("model_type", data.model_type);
    formData.append("model_id", data.model_id.toString());

    if (data.image_paths?.length) {
      data.image_paths.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`image_paths[${index}]`, file);
        } else if (typeof file === "string") {
          formData.append(`image_paths[${index}]`, file);
        }
      });
    }

    const apiUrl = "https://staging.goloka.io/api/chats/create";

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to send chat message.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating chat message:", error);
    throw new Error("Failed to send chat message. Please try again later.");
  }
};
