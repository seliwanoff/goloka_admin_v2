/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

"use client";
import {
  ClipboardExport,
  People,
  Profile2User,
  ProfileAdd,
} from "iconsax-react";
import { Button } from "@/components/ui/button";

import { UserSquare } from "lucide-react";

import CampaignChart from "@/components/organization-comps/campaign_chart";
import CampaignSummary from "@/components/organization-comps/campaign_summary";
import TabbedDataDisplay from "@/components/dashboard/tableData";
import { useUserStore } from "@/stores/currentUserStore";
import { useCallback, useEffect, useState } from "react";
import Calendar from "@/components/dashboard/calendar";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getAdminReports,
  getDashboardChartStats,
  getDonotStart,
  getRecentCampaigns,
  getRecentUsers,
  getWidgetData,
} from "@/services/analytics";
import { useQuery } from "@tanstack/react-query";
import { DashboardWidget } from "@/components/lib/widgets/dashboard_card";
import TimeFilter from "@/components/dashboard/DaysFilter";
import { se } from "date-fns/locale";

// Define possible tab types (for type safety)
type UserType = "organization" | "contributor";
type ActiveTab = "organizations" | "contributors";
const Dashboard = () => {
  const searchParams = useSearchParams();
  const currentUser = useUserStore((state) => state.user);
  const router = useRouter();
  // Initialize with fiat as default currencyType

  const [selectedDays, setSelectedDays] = useState(null);

  // console.log(currentUser);

  const [filters, setFilters] = useState<any>({
    page: parseInt(searchParams?.get("page") || "1"),
    pageSize: 30,
    currencyType: searchParams?.get("currencyType") || "fiat",

    search: searchParams?.get("search") || undefined,
    date: searchParams?.get("date") || undefined,
    time_filter: searchParams?.get("time_filter") || undefined,
    start_date: searchParams?.get("start_date") || undefined,
    end_date: searchParams?.get("end_date") || undefined,
    year: searchParams?.get("year") || undefined,
  });

  // Fetch widget data with dynamic parameters
  const {
    data: widgetStats,
    error: widgetError,
    isLoading: isWidgetLoading,
  } = useQuery({
    queryKey: ["dashboard-widgets", filters.time_filter, filters.year],
    queryFn: () =>
      getWidgetData({
        time_filter: filters.start_date ? null : filters.time_filter,
        year: filters.year,
        start_date: filters.start_date,
        end_date: filters.end_date,
      }),
    retry: 2,
  });

  // Fetch dashboard chart stats
  const {
    data: chartStats,
    error: chartError,
    isLoading: isChartLoading,
  } = useQuery({
    queryKey: ["dashboard-chart", filters.time_filter, filters.year],
    queryFn: () =>
      getDashboardChartStats({
        time_filter: filters.time_filter,
        year: filters.year,
        start_date: filters.start_date,
        end_date: filters.end_date,
      }),
    retry: 2,
  });

  const {
    data: donotStat,
    error: donotError,
    isLoading: isDonotLoading,
  } = useQuery({
    queryKey: ["donot-stat", filters.time_filter, filters.year],
    queryFn: () =>
      getDonotStart({
        time_filter: filters.time_filter,
        year: filters.year,
        start_date: filters.start_date,
        end_date: filters.end_date,
      }),
    retry: 2,
  });

  const {
    data: recentCampaigns,
    error: campaignsError,
    isLoading: isCampaignsLoading,
  } = useQuery({
    queryKey: ["recent-campaigns"],
    queryFn: () => getRecentCampaigns({ per_page: 10 }),
    retry: 2,
  });

  // Get `userType` from URL (e.g., `?userType=organization`)
  const urlUserType = searchParams.get("userType") as UserType | null;

  // Set initial `activeTab` based on URL (default: "organizations")
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const user = searchParams.get("userType") || ("" as string);

    if (user) {
      setActiveTab(user);
    }
  }, [searchParams]);

  const {
    data: recentUsers,
    error: usersError,
    isLoading: isUsersLoading,
  } = useQuery({
    queryKey: ["recent-users", activeTab],
    queryFn: () =>
      getRecentUsers({
        per_page: 20,
        user_type:
          activeTab === "organizations" ? "organization" : "contributor",
      }),
    retry: 2,
  });
  console.log(activeTab);
  const {
    data: adminReports,
    error: reportsError,
    isLoading: isReportsLoading,
  } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: () => getAdminReports({ per_page: 10 }),
    retry: 2,
  });

  //console.log(selectedDays, "donotStat");
  const [timeOfDay, setTimeOfDay] = useState<string>("day");

  useEffect(() => {
    const getCurrentTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        return "morning";
      } else if (hour >= 12 && hour < 17) {
        return "day";
      } else if (hour >= 17 && hour < 21) {
        return "evening";
      } else {
        return "night";
      }
    };

    setTimeOfDay(getCurrentTimeOfDay());
  }, []);

  const handleDateChange = useCallback(
    (filterType: string, from?: string, to?: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("time_filter", filterType);
      if (from) params.set("start_date", from);
      if (to) params.set("end_date", to);
      window.history.pushState(null, "", `?${params.toString()}`);

      setFilters((prev: any) => ({
        ...prev,
        date: filterType !== "select" ? filterType : undefined,
        time_filter: filterType,
        start_date: from,
        end_date: to,
        page: 1,
      }));
    },
    [searchParams]
  );

  useEffect(() => {
    //@ts-ignore
    setSelectedDays(searchParams?.get("time_filter") || undefined);
  }, [searchParams]);

  const renderWidgets = () => {
    // Check if data is loading
    const isLoading = !widgetStats?.data;

    // Extract data with optional chaining and default values
    const totalUsers = widgetStats?.data?.users?.total ?? 0;
    const activeUsers = widgetStats?.data?.users?.active ?? 0;
    const totalOrgs = widgetStats?.data?.total_organizations?.count ?? 0;
    const orgPercentIncrease =
      widgetStats?.data?.total_organizations?.percentage_increase ?? 0;
    const totalContributors = widgetStats?.data?.total_contributors?.count ?? 0;
    const contributorsPercentIncrease =
      widgetStats?.data?.total_contributors?.percentage_increase ?? 0;
    const totalCampaigns = widgetStats?.data?.total_campaigns?.count ?? 0;
    const campaignsPercentIncrease =
      widgetStats?.data?.total_campaigns?.percentage_increase ?? 0;

    return (
      <>
        <DashboardWidget
          title="Total Users"
          bg="bg-white bg-opacity-[12%]"
          fg="text-white"
          containerBg="bg-gradient-to-tr from-[#3365E3] to-[#1C387D]"
          textColor="text-white"
          icon={Profile2User}
          value={totalUsers}
          footer={
            <span className="font-medium">{activeUsers} Presently active</span>
          }
          link={"/dashboard/users"}
          isAnalytics={false}
          percentIncrease={null}
          isLoading={isLoading}
        />

        <DashboardWidget
          title="Total Organizations"
          bg="bg-[#FEC53D] bg-opacity-[12%]"
          fg="text-[#FEC53D]"
          icon={People}
          value={totalOrgs}
          link={"/dashboard/users?userType=organization&page=1"}
          footer="vs last month"
          isAnalytics={true}
          increase={orgPercentIncrease > 0}
          //@ts-ignore
          percentIncrease={Math.abs(orgPercentIncrease).toFixed(2)}
          isLoading={isLoading}
        />

        <DashboardWidget
          title="Total Contributors"
          bg="bg-main-100 bg-opacity-[12%]"
          fg="text-main-100"
          icon={UserSquare}
          link={"/dashboard/users?userType=contributor&page=1"}
          value={totalContributors}
          footer="vs last month"
          isAnalytics={true}
          increase={contributorsPercentIncrease > 0}
          //@ts-ignore
          percentIncrease={Math.abs(contributorsPercentIncrease).toFixed(2)}
          isLoading={isLoading}
        />

        <DashboardWidget
          title="Total Campaigns"
          bg="bg-[#079455] bg-opacity-[12%]"
          fg="text-[#079455]"
          icon={ClipboardExport}
          value={totalCampaigns}
          footer="vs last month"
          link={"/dashboard/campaigns"}
          isAnalytics={true}
          increase={campaignsPercentIncrease > 0}
          //@ts-ignore
          percentIncrease={Math.abs(campaignsPercentIncrease).toFixed(2)}
          isLoading={isLoading}
        />
      </>
    );
  };

  return (
    <div>
      <div className="grid h-max grid-cols-5 gap-6 py-10">
        {/* Welcome section */}
        <div className="col-span-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">
              Hi &nbsp;
              <span className="text-main-100">{currentUser?.name} 👋</span> How
              is your {timeOfDay} going
            </h1>
            <p className="text-gray-600">
              Here is the summary of what is presently happening on Goloka
            </p>
          </div>
          {/***
          <Button className="h-auto rounded-full bg-main-100 px-8 py-3 text-white hover:bg-blue-700">
            <span>
              <ProfileAdd size="18" color="#fff" />{" "}
            </span>
            Invite staff
          </Button>
          */}
        </div>

        <div className="col-span-6 flex justify-between">
          <TimeFilter
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
            //@ts-ignore
            onChange={handleDateChange}
          />
          <Calendar
            onDateChange={handleDateChange}
            initialFilter={filters.date || ""}
          />
        </div>

        {/* Stats section */}
        <div className="no-scrollbar col-span-5 mt-4 w-full overflow-x-auto">
          <div className="col-span-5 flex w-max gap-4 lg:grid lg:w-full lg:grid-cols-4 xl:w-full">
            {renderWidgets()}
          </div>
        </div>

        {/* CHART */}
        <div className="col-span-5 grid w-full grid-cols-[2fr_1fr] gap-6">
          <div className="flex flex-col justify-evenly rounded-2xl bg-white p-6">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <h3 className="text-base font-medium">
                Revenue against campaign fee
              </h3>
            </div>

            <div className="flex flex-col items-center gap-10">
              {/* @ts-ignore */}
              <CampaignChart chartStats={chartStats} />

              <div className="ml-auto mt-5 flex w-[90%] items-start justify-between gap-2 text-sm">
                <div className="flex items-start gap-6">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-400"></span>
                    <div className="">
                      <span className="text-sm text-[#828282]">
                        Total Revenue
                      </span>
                      <p className="font-semibold text-[#333333]">
                        {chartStats?.data.total_revenue || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-main-100"></span>
                    <div className="">
                      <span className="text-sm text-[#828282]">
                        Total Campaign
                      </span>
                      <p className="font-semibold text-[#333333]">
                        {chartStats?.data.total_campaigns?.count || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white ">
            <CampaignSummary widgetStats={donotStat} />
          </div>
        </div>
        {/* RECENT RESPONSES */}

        {/* TABLE */}
      </div>
      <TabbedDataDisplay
        recentCampaigns={recentCampaigns?.data}
        recentReports={adminReports?.data}
        isLoading={isCampaignsLoading}
        recentUsers={recentUsers?.data}
        activeUsersTab={""}
        count={[]}
      />
    </div>
  );
};

export default Dashboard;
