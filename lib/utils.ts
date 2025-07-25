/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import clsx from "clsx";
import Img from "@/public/assets/images/reviewer.jpg";
import { twMerge } from "tailwind-merge";
import React from "react";
import { baseURL } from "./axiosInstance";

// Define the type for tokens
type TokenType = {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
};

// Function to merge class names with Tailwind and clsx
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(...inputs));
}

// Function to merge and construct various Tailwind classes into one
export const classMerge = (...classes: (string | boolean)[]): string =>
  classes.filter(Boolean).join(" ");

export const serverRoute = (route: string): string => `${baseURL}/${route}`;

export const tokenExtractor = (): {
  authHeader: string;
  tokenData: any;
} | null => {
  const token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const token_type = localStorage.getItem("token_type");

  if (!token || !token_type) return null;

  try {
    const parsedToken = JSON.parse(token) as string;
    const parsedRefresh_token = JSON.parse(refresh_token as string) as string;
    const parsedTokenType = JSON.parse(token_type) as string;

    const tokenData = {
      token_type: parsedTokenType,
      access_token: parsedToken,
      refresh_token: parsedRefresh_token,
    };

    return {
      authHeader: `${parsedTokenType} ${parsedToken}`,
      tokenData,
    };
  } catch (error) {
    console.error("Failed to parse token from local storage", error);
    return null;
  }
};

export function chunkArray<T>(array: T[], size: number) {
  //console.log(array);
  let result = [];
  for (let i = 0; i < array?.length; i += size) {
    let chunk = array?.slice(i, i + size);
    result.push(chunk);
  }
  return result;
}

export const responseStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case "draft":
      return "bg-violet-500 border border-violet-500 bg-opacity-5 text-violet-500";
    case "pending":
      return "bg-orange-400 border border-orange-400 bg-opacity-5 text-orange-400";
    case "approved":
      return "bg-emerald-700 border border-emerald-700 bg-opacity-5 text-emerald-700";
    case "rejected":
      return "bg-[#FF0000] border border-[#FF0000] bg-opacity-5 text-[#FF0000]";
  }
};

export const walletStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-orange-400 border border-orange-400 bg-opacity-5 text-orange-400";
    case "successful":
      return "bg-emerald-700 border border-emerald-700 bg-opacity-5 text-emerald-700";
    case "failed":
      return "bg-[#FF0000] border border-[#FF0000] bg-opacity-5 text-[#FF0000]";
  }
};

export const myReports = [
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report4 title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report 2 title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
];
export const supportTabs = [
  {
    label: "Super Admin",
    value: "super_admin",
  },
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Manager",
    value: "manager",
  },

  /***
  {
    label: "Help center",
    value: "help",
  },

  // {
  //   label: "Chat with Goloka",
  //   value: "chat",
  // },
  {
    label: "Report an issue",
    value: "report",
  },
  */
];
export const personalFirstName = [
  {
    name: "firstName",
    label: "Full name",
    type: "text",
    required: true,
    err_message: "Input your full name",
    placeholder: "Input full name",
  },
];

export const personalInfo = [
  {
    label: "Email address",
    type: "email",
    required: true,
    err_message: "Input your email address",
    name: "email",
    placeholder: "Input email address",
    disabled: true,
  },
  {
    label: "Phone number",
    type: "phone",
    required: true,
    err_message: "Input your phone number",
    name: "phoneNo",
    placeholder: "Input phone number",
  },

  /***
  {
    label: "Date of birth",
    type: "date",
    required: true,
    err_message: "Pick your date of birth",
    name: "dateOfBirth",
    placeholder: "Pick date of birth",
  },
  {
    label: "Gender",
    type: "select",
    required: true,
    err_message: "Select your gender",
    name: "gender",
    placeholder: "Select your gender",
  },

  */
];
