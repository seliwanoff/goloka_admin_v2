"use client";
import TabbedDataDisplay from "@/components/dashboard/tableData";
import ProfilePage from "@/components/user/ProfileAvatar";
import { getUserById, getUsers } from "@/services/analytics";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Users = () => {
  const {
    data: user,
    error: userError,
    isLoading,
  } = useQuery({
    queryKey: ["user", "2"],
    queryFn: () => getUserById("2"),
    retry: 2,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  console.log(user, "USER");
  return (
    <div>
      <ProfilePage
        user={user?.data}
        isLoading={isLoading} />
      {/* <TabbedDataDisplay
        recentCampaigns={[]}
        isLoading={isLoading}
        recentUsers={users?.data}
      /> */}
    </div>
  );
};

export default Users;
