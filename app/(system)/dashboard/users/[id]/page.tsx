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
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const Users = () => {
  const searchParams = useSearchParams();
  const { id } = useParams();
    const currentTab = searchParams.get("userType") || "contributor";
  const userType =
    searchParams.get("userType") === "organization"
      ? "organization"
      : "contributor";

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

  const { data: userReport } = useQuery({
    queryKey: ["userReport", id, userType],
    queryFn: () => getUserReports(id as string, { user_type: userType }),
    retry: 2,
    staleTime: 1000 * 60,
  });
  const { data: userCampaign } = useQuery({
    queryKey: ["userContribution", id, userType],
    queryFn: () => getUserContributions(id as string, { user_type: userType }),
    retry: 2,
    staleTime: 1000 * 60,
  });
  // const { data: userReport } = useQuery({
  //   queryKey: ["userReport", id, userType],
  //   queryFn: () => getUserReports(id as string, { user_type: userType }),
  //   retry: 2,
  //   staleTime: 1000 * 60,
  // });
  console.log(userReport, "USERREPORT");
  console.log(user, "USER");
  console.log(userCampaign, "userCampaign");
  return (
    <div>
      <div className="mt-6">
        <CustomBreadCrumbs />
      </div>
      <ProfilePage user={user?.data} isLoading={isLoading} refetch={refetch} />
      <div className="mt-4">
        <UserTabbedDataDisplay
          isTabHidden={true}
          recentCampaigns={[]}
          isLoading={false}
          recentUsers={userCampaign}
          onUserTabChange={()=>{}}
          activeUsersTab={currentTab}
        />
      </div>
    </div>
  );
};

export default Users;
