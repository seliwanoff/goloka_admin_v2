"use client";
import TabbedDataDisplay from "@/components/dashboard/tableData";
import { DashboardWidget } from "@/components/lib/widgets/dashboard_card";
import { getUsers, getUsersCount, getUsersStats } from "@/services/analytics";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Profile2User,
  ProfileDelete,
  ProfileRemove,
  ProfileTick,
} from "iconsax-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const UserPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Get userType directly from URL params
  const currentTab = searchParams.get("userType") || "contributor";

  // Map the URL parameter to the API's expected user_type value
  const user_type =
    currentTab === "organization" ? "organization" : "contributor";

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("per_page")) || 10;
  const search = searchParams.get("search") || "";

  // const pageSize = Number(searchParams.get("pageSize")) || 10;

  // Set default query params if none exist
  useEffect(() => {
    if (!searchParams.get("userType")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("userType", "contributor");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [pathname, router, searchParams]);

  // Users query with pagination support
  const {
    data: users,
    error: usersError,
    isLoading: usersLoading,
  } = useQuery({
    queryKey: ["USERS", currentTab, currentPage, pageSize, search],
    queryFn: () =>
      getUsers({
        per_page: pageSize,
        page: currentPage,
        user_type: user_type,
        search: search,

        // Use the mapped user_type value
      }),
    retry: 2,
    staleTime: 1000 * 60,
  });

  // console.log(usersLoading);

  const {
    data: usersCount,
    error: usersErrorCount,
    isLoading: usersCountLoading,
  } = useQuery({
    queryKey: ["USERS_COUNT", currentTab, currentPage, pageSize, search],
    queryFn: () =>
      getUsersCount({
        per_page: pageSize,
        page: currentPage,
        user_type: user_type,
        search: search,

        // Use the mapped user_type value
      }),
    retry: 2,
    staleTime: 1000 * 60,
  });

  // console.log(usersCount, "Users count");
  // Stats query
  const {
    data: usersStats,
    error: userError,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["USERS_STATS"],
    queryFn: () => getUsersStats(),
    retry: 2,
    staleTime: 1000 * 60,
  });

  const handleUserTabChange = (newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("userType", newTab);
    params.set("page", "1"); // Reset to first page on tab change
    params.set("per_page", "10");
    params.set("search", "");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const renderWidgets = () => {
    const activeUsers = usersStats?.data?.active_users ?? 0;
    const deactivatedUser = usersStats?.data?.deactivated_accounts ?? 0;
    const deletedUser = usersStats?.data?.deleted_accounts ?? 0;
    const total_user = usersStats?.data?.total_users ?? 0;

    //console.log(activeUsers);

    return (
      <>
        <DashboardWidget
          title="Total Users"
          bg="bg-[#079455] bg-opacity-[12%]"
          fg="text-[#079455]"
          icon={Profile2User}
          value={total_user}
          isLoading={statsLoading}
        />

        <DashboardWidget
          title="Active users"
          bg="bg-[#FEC53D] bg-opacity-[12%]"
          fg="text-[#FEC53D]"
          icon={ProfileTick}
          value={activeUsers}
          isLoading={statsLoading}
        />

        <DashboardWidget
          title="Deactivated user"
          bg="bg-main-100 bg-opacity-[12%]"
          fg="text-main-100"
          icon={ProfileDelete}
          value={deactivatedUser}
          isLoading={statsLoading}
        />

        <DashboardWidget
          title="Total accounts"
          bg="bg-[#EB5757] bg-opacity-[12%]"
          fg="text-[#EB5757]"
          icon={ProfileRemove}
          value={total_user}
          isLoading={statsLoading}
        />
      </>
    );
  };

  return (
    <div>
      <div className="no-scrollbar col-span-5 w-full overflow-x-auto">
        <h2 className="text-xl font-semibold text-main-100 my-6">Users</h2>
        <div className="col-span-5 flex w-max gap-4 lg:grid lg:w-full lg:grid-cols-4 xl:w-full">
          {renderWidgets()}
        </div>
      </div>
      <div className="mt-4">
        <TabbedDataDisplay
          isTabHidden={true}
          recentCampaigns={[]}
          isLoading={usersLoading}
          recentUsers={users?.data}
          onUserTabChange={handleUserTabChange}
          activeUsersTab={currentTab}
          count={usersCount}
        />
      </div>
    </div>
  );
};

export default UserPage;
