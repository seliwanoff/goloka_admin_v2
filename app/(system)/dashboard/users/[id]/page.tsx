"use client";
import UserTabbedDataDisplay from "@/components/dashboard/contributionTable";
import TabbedDataDisplay from "@/components/dashboard/tableData";
import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import ProfilePage from "@/components/user/ProfileAvatar";
import {
  getUserById,
  getUserContributions,
  getUserReports,
  getUsers,
} from "@/services/analytics";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const Users = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState("contributions");

  const userType =
    searchParams.get("userType") === "organization"
      ? "organization"
      : "contributor";

  // Fetch user data
  const {
    data: user,
    error: userError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", id, userType],
    queryFn: () => getUserById(id as string, { userType }),
    retry: 2,
    staleTime: 1000 * 60,
  });

  // Fetch user reports
  const { data: userReports, isLoading: isReportsLoading } = useQuery({
    queryKey: ["userReport", id, userType, currentTab],
    queryFn: () => getUserReports(id as string, { user_type: userType }),
    retry: 2,
    staleTime: 1000 * 60,
    enabled: currentTab === "reports", // Only fetch when reports tab is active
  });

  // Fetch user contributions
  const { data: userCampaign, isLoading: isCampaignLoading } = useQuery({
    queryKey: ["userContribution", id, userType, currentTab],
    queryFn: () => getUserContributions(id as string, { user_type: userType }),
    retry: 2,
    staleTime: 1000 * 60,
    enabled: currentTab === "contributions" || !currentTab, // Fetch on contributions tab or default
  });

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);


  };



  return (
    <div>
      <div className=" bg-gray-100 p-4">
        <div className="my-4">
          <CustomBreadCrumbs />
        </div>
        <ProfilePage
          user={user?.data}
          isLoading={isLoading}
          refetch={refetch}
        />
        <div className="mt-4">
          <UserTabbedDataDisplay
            isTabHidden={true}
            recentCampaigns={[]}
            isLoading={isCampaignLoading || isReportsLoading}
            recentUsers={userCampaign}
            userReports={userReports}
            onUserTabChange={handleTabChange}
            activeUsersTab={currentTab}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;
