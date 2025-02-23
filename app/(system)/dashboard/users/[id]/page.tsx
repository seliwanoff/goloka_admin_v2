"use client";
import TabbedDataDisplay from "@/components/dashboard/tableData";
import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import ProfilePage from "@/components/user/ProfileAvatar";
import { getUserById, getUsers } from "@/services/analytics";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

const Users = () => {
    const { id } = useParams();
  const {
    data: user,
    error: userError,
    isLoading,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id as string),
    retry: 2,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  console.log(user, "USER");
  return (
    <div>
      <div className="mt-6">
        <CustomBreadCrumbs />
      </div>
      <ProfilePage user={user?.data} isLoading={isLoading} />
      {/* <TabbedDataDisplay
        recentCampaigns={[]}
        isLoading={isLoading}
        recentUsers={users?.data}
      /> */}
    </div>
  );
};

export default Users;
