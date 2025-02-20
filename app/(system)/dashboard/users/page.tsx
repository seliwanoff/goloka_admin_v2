"use client";
import TabbedDataDisplay from "@/components/dashboard/tableData";
import { DashboardWidget } from "@/components/lib/widgets/dashboard_card";
import { getUsers, getUsersStats } from "@/services/analytics";
import { useQuery } from "@tanstack/react-query";
import {
  People,
  Profile2User,
  ProfileDelete,
  ProfileRemove,
  ProfileTick,
} from "iconsax-react";
import React from "react";

const UserPage = () => {
  const {
    data: users,
    error,
    //    isLoading,
  } = useQuery({
    queryKey: ["USERS"],
    queryFn: () =>
      getUsers({
        per_page: 10,
        user_type: "contributor",
      }),
    retry: 2,
  });

  const {
    data: usersStats,
    error: userError,
    isLoading,
  } = useQuery({
    queryKey: ["USERS_STATS"],
    queryFn: () => getUsersStats(),
    retry: 2,
  });

  console.log(usersStats, "usersStats");
  const renderWidgets = () => {
    //   const Loading = isLoading;

    const activeUsers = usersStats?.data?.active_users ?? 0;
    const deactivatedUser = usersStats?.data?.deactivated_accounts ?? 0;
    const deletedUser = usersStats?.data?.deleted_accounts ?? 0;
    const total_user = usersStats?.data?.total_users ?? 0;

    return (
      <>
        <DashboardWidget
          title="Total Users"
          bg="bg-[#079455] bg-opacity-[12%]"
          fg="text-[#079455]"
          // textColor="text-white"
          icon={Profile2User}
          value={activeUsers}
          isLoading={isLoading}
        />

        <DashboardWidget
          title="Active users"
          bg="bg-[#FEC53D] bg-opacity-[12%]"
          fg="text-[#FEC53D]"
          icon={ProfileTick}
          value={deactivatedUser}
          isLoading={isLoading}
        />

        <DashboardWidget
          title="Deactivated user"
          bg="bg-main-100 bg-opacity-[12%]"
          fg="text-main-100"
          icon={ProfileDelete}
          value={deletedUser}
          isLoading={isLoading}
        />

        <DashboardWidget
          title="Total accounts"
          bg="bg-[#EB5757] bg-opacity-[12%]"
          fg="text-[#EB5757]"
          icon={ProfileRemove}
          value={total_user}
          isLoading={isLoading}
        />
      </>
    );
  };
  return (
    <div>
      {/* Stats section */}
      <div className="no-scrollbar col-span-5 mt-4 w-full overflow-x-auto">
        <div className="col-span-5 flex w-max gap-4 lg:grid lg:w-full lg:grid-cols-4 xl:w-full">
          {renderWidgets()}
        </div>
      </div>
      <div className="mt-4">
        <TabbedDataDisplay
          isTabHidden={true}
          recentCampaigns={[]}
          isLoading={isLoading}
          recentUsers={users?.data}
        />
      </div>
    </div>
  );
};

export default UserPage;
