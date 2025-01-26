/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import DashboardWidget from "@/components/lib/widgets/dashboard_card";
// import React, { useState } from "react";
import {
  // Calendar,
  ClipboardExport,
  // DocumentUpload,
  // Eye,
  // Note,
  People,
  Profile2User,
  ProfileAdd,
  // Setting4,
  // TrendUp,
  // Wallet3,
} from "iconsax-react";
import { Button } from "@/components/ui/button";

// import Pagination from "@/components/lib/navigation/Pagination";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import {  UserSquare } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { chunkArray} from "@/lib/utils";
// import { format } from "date-fns";
// import { Calendar as CalenderDate } from "@/components/ui/calendar";
// import { responsesTableData } from "@/utils";
// import { useRouter } from "next/navigation";
// import {
//   formatResponseDate,
//   formatResponseTime,
//   // getStatusColor,
//   getStatusText,
//   Status,
// } from "@/helper";
import CampaignChart from "@/components/organization-comps/campaign_chart";
import CampaignSummary from "@/components/organization-comps/campaign_summary";
import TabbedDataDisplay from "@/components/dashboard/tableData";
import { useUserStore } from "@/stores/currentUserStore";
import { useEffect, useState } from "react";
// import TabbedDataDisplay from "@/components/dashboard/tableData";

const Dashboard = () => {
   const currentUser = useUserStore((state) => state.user);
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

        {/* Stats section */}
        <div className="no-scrollbar col-span-5 mt-4 w-full overflow-x-auto">
          <div className="col-span-5 flex w-max gap-4 lg:grid lg:w-full lg:grid-cols-4 xl:w-full">
            <>
              <DashboardWidget
                title="Total Users"
                bg="bg-white bg-opacity-[12%]"
                fg="text-white"
                containerBg="bg-gradient-to-tr from-[#3365E3] to-[#1C387D]"
                textColor="text-white"
                icon={Profile2User}
                value={`200K`}
                footer={
                  <span className="font-medium">345k Presently active</span>
                }
                isAnalytics={false}
                increase={true}
                percents={40}
              />

              <DashboardWidget
                title="Total organization"
                bg="bg-[#FEC53D] bg-opacity-[12%]"
                fg="text-[#FEC53D]"
                icon={People}
                value={"127K"}
                footer="vs last month"
                isAnalytics={true}
                increase={true}
                percents={40}
              />

              <DashboardWidget
                title="Total Contributors"
                bg="bg-main-100 bg-opacity-[12%]"
                fg="text-main-100"
                icon={UserSquare}
                value={"4K"}
                footer="vs last month"
                isAnalytics={true}
                increase={true}
                percents={40}
              />

              <DashboardWidget
                title="Total Campaigns"
                bg="bg-[#079455] bg-opacity-[12%]"
                fg="text-[#079455]"
                icon={ClipboardExport}
                value={"436K"}
                footer="vs last month"
                isAnalytics={true}
                increase={false}
                percents={40}
              />
            </>
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
              <CampaignChart />

              <div className="ml-auto mt-5 flex w-[90%] items-start justify-between gap-2 text-sm">
                <div className="flex items-start gap-6">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-400"></span>
                    <div className="">
                      <span className="text-sm text-[#828282]">
                        Total Revenue
                      </span>
                      <p className="font-semibold text-[#333333]">54</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-main-100"></span>
                    <div className="">
                      <span className="text-sm text-[#828282]">
                        Total Campaign
                      </span>
                      <p className="font-semibold text-[#333333]">569</p>
                    </div>
                  </div>
                </div>
                {/* <div className="text-right">
                <p className="text-sm text-[#828282]">Amount spent</p>
                <h4 className="font-semibold text-[#333333]">$2500</h4>
              </div> */}
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-[14px]">
            <h3 className="mb-10 text-base font-medium">Campaign summary</h3>
            <CampaignSummary />
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
