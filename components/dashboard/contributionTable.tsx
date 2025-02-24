"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Danger, More, Eye, Setting4, BatteryEmpty1 } from "iconsax-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Calendar, Search } from "lucide-react";
import { Input } from "../ui/input";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Pagination from "../lib/navigation/Pagination";
import { ServerResponseOrNull } from "@/services/analytics";
import { Skeleton } from "../ui/skeleton";
import { EmptyPlaceholder } from "../lib/empty_states/table_empty";
import ReportCardGrid from "../report/reportCard";

const UserTabbedDataDisplay: React.FC<TabbedDataDisplayProps> = ({
  recentUsers,
  isTabHidden,
  onUserTabChange,
  activeUsersTab,
  userReports,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [date, setDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Get active tab from URL or use the provided default
  const [activeUserTab, setActiveUserTab] = useState<string>(
    activeUsersTab || "contributions"
  );

  // Update active tab when activeUsersTab prop changes
  useEffect(() => {
    if (activeUsersTab && activeUsersTab !== activeUserTab) {
      setActiveUserTab(activeUsersTab);
    }
  }, [activeUsersTab]);

  // Handle tab change
  const handleUserTabChange = (value: string) => {
    // const params = new URLSearchParams(searchParams.toString());
    // params.set("userType", value);

    // // Update URL without causing a full page reload
    // router.push(`${pathname}?${params.toString()}`, { scroll: false });

    setActiveUserTab(value);
    if (onUserTabChange) {
      onUserTabChange(value);
    }
  };

  // Prepare data based on active tab
  const getContributionsData = () => {
    return (
      recentUsers?.data?.map((userContribution: any) => ({
        title: userContribution?.title,
        organization: userContribution?.organization,
        amount: userContribution?.total_fee,
        id: userContribution?.id,
        questions: userContribution?.no_of_questions,
        submitted: userContribution?.submitted_at,
        status: userContribution?.status,
        no_of_questions: userContribution?.no_of_questions,
        submitted_at: userContribution?.submitted_at,
        total_fee: userContribution?.total_fee,
      })) || []
    );
  };

  const getReportsData = () => {
    return userReports?.data || [];
  };

  // Filter contribution data based on search term
  const filteredContributions = getContributionsData().filter((item: any) => {
    if (!searchTerm) return true;
    return (
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.organization?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filter report data based on search term
  const filteredReports = getReportsData().filter((item: any) => {
    if (!searchTerm) return true;
    return (
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.organization?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Get current pagination object based on active tab
  const getCurrentPagination = () => {
    if (activeUserTab === "contributions") {
      //@ts-ignore
      return recentUsers?.pagination;
    } else {
      //@ts-ignore
      return userReports?.pagination;
    }
  };

  // Check if data is loading based on active tab
  const isLoading =
    activeUserTab === "contributions" ? !recentUsers?.data : !userReports?.data;

  return (
    <div className="w-full p-6 bg-white rounded-3xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex justify-between gap-4 lg:justify-start">
          {/* -- search section */}
          <div className="relative flex w-full items-center justify-center md:w-[250px]">
            <Search className="absolute left-3 text-gray-500" size={18} />
            <Input
              placeholder={`Search ${
                activeUserTab === "contributions" ? "campaigns" : "reports"
              }...`}
              type="text"
              className="w-full rounded-full bg-gray-50 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-full border bg-white p-1 pr-3 lg:hidden">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F8F8]">
              <Setting4 size={20} />
            </span>
            <span>Filter</span>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
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
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="mt-6">
        {/* Conditional rendering based on active tab */}
        {activeUserTab === "contributions" ? (
          <div className="overflow-x-auto">
            <ContributionsTable
              data={filteredContributions}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div>
            {isLoading ? (
              <ReportsGridSkeleton />
            ) : filteredReports.length === 0 ? (
              <EmptyState message="No reports found. Try adjusting your filters or search terms." />
            ) : (
              <ReportCardGrid reports={filteredReports} />
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        {getCurrentPagination() && (
          <Pagination
            pagination={getCurrentPagination()}
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
  userReports?: ServerResponseOrNull<any> | undefined;
  onUserTabChange?: (tab: string) => void;
  activeUsersTab: string;
}

interface TableProps {
  data: any[];
  isLoading?: boolean;
}

const ContributionsTable: React.FC<TableProps> = ({ data, isLoading }) => {
  const searchParams = useSearchParams();
  const userType =
    searchParams.get("userType") === "organization"
      ? "organization"
      : "contributor";
  const router = useRouter();

  if (isLoading) {
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
      <EmptyState message="No contributions found. Try adjusting your filters or search terms." />
    );
  }

  const reroute = (id: any) => {
    router.push(`/dashboard/campaigns/${id}`);
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
          <TableRow key={`${item.title}-${i}`}>
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
                  item.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : item.status === "running"
                    ? "bg-yellow-100 text-yellow-700"
                    : item.status === "pending"
                    ? "bg-gray-100 text-gray-700"
                    : item.status === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700" // Default fallback
                )}
              >
                {item.status}
              </span>
            </TableCell>
            {/* <TableCell>
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
                    <button className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-[#f01313]">
                      <Danger size="20" color="#f01313" /> Deactivate
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell> */}
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
    <TableCell>
      <Skeleton className="h-6 w-[20px]" />
    </TableCell>
  </TableRow>
);

// Reports Grid Skeleton
const ReportsGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array(6)
      .fill(null)
      .map((_, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-3" />
          <Skeleton className="h-24 w-full mb-3" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
      ))}
  </div>
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
