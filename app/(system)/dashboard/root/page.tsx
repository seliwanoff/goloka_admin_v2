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
import { useSearchParams } from "next/navigation";
import { getDashboardChartStats, getWidgetData } from "@/services/analytics";
import { useQuery } from "@tanstack/react-query";
import { DashboardWidget } from "@/components/lib/widgets/dashboard_card";
// import TabbedDataDisplay from "@/components/dashboard/tableData";

const Dashboard = () => {
  // Query for dashboard stats
  // const {
  //   data: stats,
  //   error: statsError,
  //   isError: isStatsError,
  // } = useQuery({
  //   queryKey: ["Get dashboard stats"],
  //   queryFn: getWidgetData,
  //   retry: 2, // Retry failed requests 2 times
  // });
  const searchParams = useSearchParams();
  const currentUser = useUserStore((state) => state.user);

  // Initialize with fiat as default currencyType
  const [filters, setFilters] = useState<any>({
    page: parseInt(searchParams?.get("page") || "1"),
    pageSize: 15,
    currencyType: searchParams?.get("currencyType") || "fiat",
    search: searchParams?.get("search") || undefined,
    date: searchParams?.get("date") || undefined,
    time_filter: searchParams?.get("time_filter") || "7_days",
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
        time_filter: filters.time_filter,
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
  // Set initial URL params when component mounts
  // useEffect(() => {
  //   const initialParams: Record<string, string> = {
  //     page: filters.page.toString(),
  //     pageSize: filters.pageSize.toString(),
  //     currencyType: "fiat", // Always set initial currencyType to fiat
  //   };

  //   if (filters.search) initialParams.search = filters.search;
  //   if (filters.date && filters.date !== "select")
  //     initialParams.date = filters.date;

  //   // setSearchParams(initialParams);
  // }, []); // Empty dependency array ensures this only runs once on mount

  //  const updateSearchParams = useCallback(() => {
  //    const updatedParams: Record<string, string> = {
  //      page: filters.page.toString(),
  //      pageSize: filters.pageSize.toString(),
  //      currencyType: filters.currencyType,
  //      time_filter: filters.time_filter,
  //    };

  //    // Add optional parameters
  //    if (filters.search) updatedParams.search = filters.search;
  //    if (filters.date && filters.date !== "select")
  //      updatedParams.date = filters.date;
  //    if (filters.start_date) updatedParams.start_date = filters.start_date;
  //    if (filters.end_date) updatedParams.end_date = filters.end_date;
  //    if (filters.year) updatedParams.year = filters.year;

  //   //  setSearchParams(updatedParams);
  //  }, [filters]);

  // const [filteredData, setFilteredData] = useState<Response[]>(
  //   responseData?.data?.filter(
  //     (item: { status: string }) => item?.status === activeTab,
  //   ),
  // );

  // const [filteredData] = useState<unknown[]>(responsesTableData);
  // const [ setOpenFilter] = useState<boolean>(false);
  // const [date, setDate] = useState<Date>();
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState<number>(10);
  // const pages = chunkArray(filteredData, pageSize);
  // const currentPageData = pages[currentPage - 1] || [];
  // const router = useRouter();
  console.log(widgetStats, "widgetStats");
  console.log(chartStats, "chartStats");
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

  // const getGreeting = () => {
  //   switch (timeOfDay) {
  //     case "morning":
  //       return "Good morning";
  //     case "day":
  //       return "Good day";
  //     case "evening":
  //       return "Good evening";
  //     case "night":
  //       return "Good night";
  //     default:
  //       return "Hello";
  //   }
  // };
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

  // Render widgets with dynamic data
  // const renderWidgets = () => {
  //   // Use loading or default states if data is not yet loaded
  //   const totalUsers = widgetStats?.data?.total_users?.count || "200K";
  //   const activeUsers = widgetStats?.data?.active_users?.count || "345K";
  //   const totalOrgs = widgetStats?.data?.total_organizations || "127K";
  //   const totalContributors =
  //     widgetStats?.data?.total_contributors?.count || "4K";
  //   const totalCampaigns = widgetStats?.data?.total_campaigns?.count;

  //   return (
  //     <>
  //       <DashboardWidget
  //         title="Total Users"
  //         bg="bg-white bg-opacity-[12%]"
  //         fg="text-white"
  //         containerBg="bg-gradient-to-tr from-[#3365E3] to-[#1C387D]"
  //         textColor="text-white"
  //         icon={Profile2User}
  //         value={totalUsers}
  //         footer={
  //           <span className="font-medium">{activeUsers} Presently active</span>
  //         }
  //         isAnalytics={false}
  //         increase={true}
  //         percents={40}
  //       />

  //       <DashboardWidget
  //         title="Total organization"
  //         bg="bg-[#FEC53D] bg-opacity-[12%]"
  //         fg="text-[#FEC53D]"
  //         icon={People}
  //         value={totalOrgs}
  //         footer="vs last month"
  //         isAnalytics={true}
  //         increase={true}
  //         percents={40}
  //       />

  //       <DashboardWidget
  //         title="Total Contributors"
  //         bg="bg-main-100 bg-opacity-[12%]"
  //         fg="text-main-100"
  //         icon={UserSquare}
  //         value={totalContributors}
  //         footer="vs last month"
  //         isAnalytics={true}
  //         increase={true}
  //         percents={40}
  //       />

  //       <DashboardWidget
  //         title="Total Campaigns"
  //         bg="bg-[#079455] bg-opacity-[12%]"
  //         fg="text-[#079455]"
  //         icon={ClipboardExport}
  //         value={totalCampaigns}
  //         footer="vs last month"
  //         isAnalytics={true}
  //         increase={false}
  //         percents={40}
  //       />
  //     </>
  //   );
  // };

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
        footer="vs last month"
        isAnalytics={true}
        increase={orgPercentIncrease > 0}
        percentIncrease={Math.abs(orgPercentIncrease)}
        isLoading={isLoading}
      />

      <DashboardWidget
        title="Total Contributors"
        bg="bg-main-100 bg-opacity-[12%]"
        fg="text-main-100"
        icon={UserSquare}
        value={totalContributors}
        footer="vs last month"
        isAnalytics={true}
        increase={contributorsPercentIncrease > 0}
        percentIncrease={Math.abs(contributorsPercentIncrease)}
        isLoading={isLoading}
      />

      <DashboardWidget
        title="Total Campaigns"
        bg="bg-[#079455] bg-opacity-[12%]"
        fg="text-[#079455]"
        icon={ClipboardExport}
        value={totalCampaigns}
        footer="vs last month"
        isAnalytics={true}
        increase={campaignsPercentIncrease > 0}
        percentIncrease={Math.abs(campaignsPercentIncrease)}
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
            {/* Hi Mohh_Jumah👋 How is your day going */}
            <p className="text-gray-600">
              Here is the summary of what is presently happening on Goloka
            </p>
          </div>
          <Button className="h-auto rounded-full bg-main-100 px-8 py-3 text-white hover:bg-blue-700">
            <span>
              <ProfileAdd size="18" color="#fff" />{" "}
            </span>
            Invite staff
          </Button>
        </div>
        <div className="col-span-5 flex justify-end">
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
                        {chartStats?.data
                          ?.reduce(
                            (sum: any, item: { admin_fee: any }) =>
                              sum + item.admin_fee,
                            0
                          )
                          .toFixed(2) || "0.00"}
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
                        {chartStats?.data
                          ?.reduce(
                            (sum: any, item: { campaign_fee: any }) =>
                              sum + item.campaign_fee,
                            0
                          )
                          .toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white ">
            {/* <h3 className="mb-10 text-base font-medium">Campaign summary</h3> */}
            <CampaignSummary widgetStats={widgetStats} />
          </div>
        </div>
        {/* RECENT RESPONSES */}

        {/* TABLE */}
      </div>
      <TabbedDataDisplay />
    </div>
  );
};

export default Dashboard;

// Define props for the StatusPill component
// interface StatusPillProps {
//   status: Status;
// }

// const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium",
//         getStatusColor(status)
//       )}
//     >
//       {getStatusText(status)}
//     </span>
//   );
// };

// const getStatusColor = (status: Status) => {
//   switch (status?.toLowerCase()) {
//     case "pending":
//       return "bg-orange-400/5 border-orange-400 text-orange-400";
//     case "reviewed":
//       return "bg-violet-500/5 border-violet-500 text-violet-500";
//     case "accepted":
//       return "bg-emerald-600/5 border-emerald-600 text-emerald-600";
//     case "rejected":
//       return "bg-red-500/5 border-red-500 text-red-500";
//     default:
//       return "bg-gray-500/5 border-gray-500 text-gray-500";
//   }
// };

export const responsesTableData = [
  // On Review (with unread)
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 3,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 3,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Reviewed",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 3,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 2,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 2,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Reviewed",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 2,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },

  // Accepted
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Accepted",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Reviewed",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Accepted",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Reviewed",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Accepted",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Accepted",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Accepted",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Accepted",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Accepted",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },

  // Rejected
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Rejected",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Rejected",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Rejected",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Rejected",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Rejected",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Rejected",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Rejected",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Rejected",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Rejected",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Rejected",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },

  // Pending
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
  {
    category: "Agriculture & Food Security",
    company: "Dataphyte",
    status: "Pending",
    price: "$12",
    date: "15/5/2024",
    time: "9:30AM",
    unread: 0,
  },
];
