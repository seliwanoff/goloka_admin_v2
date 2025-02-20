
'use client'
import TabbedDataDisplay from "@/components/dashboard/tableData";
import ProfilePage from "@/components/user/ProfileAvatar";
import { getUsers } from "@/services/analytics";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Users = () => {
    const {
      data: users,
      error: userError,
      isLoading,
    } = useQuery({
      queryKey: ["USERS"],
      queryFn: () =>
        getUsers({
          per_page: 10,
          user_type: "contributor",
        }),
      retry: 2,
    });

    console.log(users, "hyhy")
  return (
    <div>
      <ProfilePage />
      <TabbedDataDisplay
        recentCampaigns={[]}
        isLoading={isLoading}
        recentUsers={users?.data}
      />
    </div>
  );
};

export default Users;
