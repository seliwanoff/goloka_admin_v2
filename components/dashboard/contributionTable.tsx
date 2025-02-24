/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { usePathname, useRouter } from "next/navigation";
import { Danger, More, Eye, Setting4, BatteryEmpty1 } from "iconsax-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { chunkArray, cn, myReports } from "@/lib/utils";
import ReportCardGrid from "../report/reportCard";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Calendar, Search } from "lucide-react";
import { Input } from "../ui/input";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Pagination from "../lib/navigation/Pagination";
import { ServerResponseOrNull } from "@/services/analytics";
import { Skeleton } from "../ui/skeleton";
import { EmptyPlaceholder } from "../lib/empty_states/table_empty";

const UserTabbedDataDisplay: React.FC<TabbedDataDisplayProps> = ({
  recentUsers,
  isTabHidden,
  onUserTabChange,
  activeUsersTab,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [date, setDate] = useState<Date>();

  const getActiveTabFromPath = () => {
    const pathSegments = pathname?.split("/").filter(Boolean);
    if (
      !pathSegments?.length ||
      pathSegments[pathSegments.length - 1] === "root"
    ) {
      return "campaigns";
    }

    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment || "campaigns";
  };

  const [activeUserTab, setActiveUserTab] = useState<string>(
   "contributions");
  console.log(activeUserTab, "activeUserTab");

//   useEffect(() => {
//     const userType = searchParams.get("userType");
//     if (userType && userType !== activeUserTab) {
//       setActiveUserTab(userType);
//     }
//   }, [searchParams, activeUserTab]);

  const handleUserTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("userType", value);

    // Update URL without causing a full page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setActiveUserTab(value);
    onUserTabChange?.(value);
  };

  const userData =
    recentUsers?.data?.map(
      (userContribution: {
        title: string;
        organization: string;
        total_fee: string;
        no_of_questions: string;
        submitted_at: string;
        status: string;
        id: number;
      }) => ({
        title: userContribution?.title,
        organization: userContribution?.organization,
        amount: userContribution?.total_fee,
        id: userContribution?.id,
        questions: userContribution?.no_of_questions,
        submitted: userContribution?.submitted_at,
        status: userContribution?.status,
      })
    ) || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="w-full p-6 bg-white rounded-3xl">
      {!isTabHidden ? (
        <div className="mb-6 flex items-center justify-between">

          <Button variant="link" className="text-blue-600">
            See all
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex justify-between gap-4 lg:justify-start">
            {/* -- search section */}
            <div className="relative flex w-[250px] items-center justify-center md:w-[250px]">
              <Search className="absolute left-3 text-gray-500" size={18} />
              <Input
                placeholder="Search task, organization"
                type="text"
                className="w-full rounded-full bg-gray-50 pl-10"
              />
            </div>

            <div className="hidden lg:flex lg:gap-4">
              {/* DATE */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-min justify-start gap-3 rounded-full px-3 pr-1 text-center text-sm font-normal"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Select date</span>}
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F8F8]">
                      <Calendar size={20} color="#828282" className="m-0" />
                    </span>{" "}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalenderDate
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* -- filter icon */}
            <div
              // onClick={() => setOpenFilter(true)}
              className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-full border bg-white p-1 pr-3 lg:hidden"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F8F8]">
                <Setting4 size={20} />
              </span>
              <span>Filter</span>
            </div>
          </div>

          <div>
            <Tabs
              value={activeUserTab}
              onValueChange={handleUserTabChange}
              className="w-full md:w-max"
            >
              <TabsList
                className={cn(
                  "w-full justify-start rounded-full bg-[#F1F1F1] px-1 py-6 sm:w-auto md:justify-center"
                )}
              >
                {userTabs.map((tab: any, index: number) => (
                  <TabsTrigger
                    value={tab?.value}
                    key={index}
                    className={cn(
                      "flex-grow rounded-full py-2.5 text-sm font-normal data-[state=active]:bg-blue-700 data-[state=active]:text-white sm:flex-grow-0"
                    )}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}{" "}
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}

      <ContributionsTable data={userData} />

      {/* Pagination */}
      <div className="mt-6">
        {/* @ts-ignore */}
        {recentUsers?.pagination && (
          <Pagination
            //@ts-ignore

            pagination={recentUsers.pagination}
            onPageChange={handlePageChange}
            onRowSizeChange={handleRowSizeChange}
          />
        )}
      </div>
    </div>
  );
};

export default UserTabbedDataDisplay;
const userTabs = [
  {
    label: "Contributions",
    value: "contributions",
  },
  {
    label: "Reports",
    value: "reports",
  },
];

interface TabbedDataDisplayProps {
  isTabHidden?: boolean;
  recentCampaigns?: any[];
  isLoading?: boolean;
  recentUsers: ServerResponseOrNull<any> | undefined;
  onUserTabChange?: (tab: string) => void;
  activeUsersTab: string;
}

const ContributionsTable: React.FC<{ data: any[] }> = ({ data }) => {
  const searchParams = useSearchParams();
  const userType =
    searchParams.get("userType") === "organization"
      ? "organization"
      : "contributor";
  console.log(userType, "userType");
  const router = useRouter();

  if (!data) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign Title</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Status</TableHead>
            {/* <TableHead>Status</TableHead> */}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <TableRowSkeleton key={index} />
            ))}
        </TableBody>
      </Table>
    );
  }

  if (!data?.length) {
    return (
      <EmptyState message="No users found. Try adjusting your filters or search terms." />
    );
  }

  const reroute = (data: any) => {
    router.push(`/dashboard/users/${data}?userType=${userType}`);
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign Title</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Questions</TableHead>
          <TableHead>Date Submitted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, i) => (
          <TableRow key={item.title + i}>
            <TableCell
              onClick={() => reroute(item?.id)}
              className="text-main-100 hover:underline cursor-pointer"
            >
              {item.title}
            </TableCell>
            <TableCell>{item.organization}</TableCell>
            <TableCell>{item.total_fee}</TableCell>
            <TableCell>{item.no_of_questions}</TableCell>
            <TableCell>{item.submitted_at}</TableCell>
            <TableCell>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm",
                  item.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : item.status === "Deactivate"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-red-100 text-red-700"
                )}
              >
                {item.status}
              </span>
            </TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="focus:outline-none">
                    <More size="20" color="#000" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-0">
                  <div className="flex flex-col text-sm">
                    <button
                      onClick={() => reroute(item?.id)}
                      className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Eye size="20" color="#000" /> View Profile
                    </button>
                    <button
                      // onClick={}
                      className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-[#f01313]"
                    >
                      <Danger size="20" color="#f01313" /> Deactivate
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const TableRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-6 w-[200px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-[150px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-[120px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-[100px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-[80px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-[40px]" />
    </TableCell>
  </TableRow>
);

// Empty state component
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <EmptyPlaceholder
      icon={BatteryEmpty1}
      title="No data available"
      description={message}
    />
  </div>
);
