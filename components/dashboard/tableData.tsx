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
import { MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

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

interface Tab {
  id: "campaigns" | "contributors" | "organizations" | "reports";
  label: string;
}

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

export interface Campaign {
  title: string;
  id: string;
  organizer: string;
  imageUrl: string;
  locations: any[];
  date: string;
  status: "Pending" | "Accepted" | "Rejected" | "Reviewed" | "Running";
}

const TabNav: React.FC<{
  tabs: Tab[];
  activeTab: Tab["id"];
  onTabChange: (id: Tab["id"]) => void;
}> = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex gap-2 rounded-full bg-[#F1F1F1] p-3">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={cn(
          "px-6 py-2 rounded-full",
          activeTab === tab.id ? "bg-blue-600 text-white" : "text-[#828282]"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export const CampaignTable: React.FC<{ campaigns: Campaign[] }> = ({
  campaigns,
}) => {
  const router = useRouter();
  const currentPath = usePathname();

  const navigateToCampaign = (id: string) => {
    let targetPath = "";
    if (currentPath?.includes("/dashboard/campaigns")) {
      targetPath = `${currentPath}/${id}`;
    } else {
      targetPath = `/dashboard/campaigns/${id}`;
    }

    router.push(targetPath);
  };

  const getStatusStyle = (status: Campaign["status"]): string => {
    const styles = {
      Pending: "text-orange-500 bg-orange-50 border-orange-200",
      Accepted: "text-green-500 bg-green-50 border-green-200",
      Rejected: "text-red-500 bg-red-50 border-red-200",
      Reviewed: "text-purple-500 bg-purple-50 border-purple-200",
      Running: "text-blue-500 bg-purple-50 border-blue-200",
    };
    return styles[status];
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign title</TableHead>
          <TableHead>Organisation</TableHead>
          <TableHead>Locations</TableHead>
          <TableHead>Date submitted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign, index) => (
          <TableRow key={index}>
            {/* Campaign Title with Routing */}
            <TableCell>
              <button
                onClick={() => navigateToCampaign(campaign.id)}
                className="text-blue-600 hover:underline"
              >
                {campaign.title}
              </button>
            </TableCell>

            {/* Organizer Information */}
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={campaign?.imageUrl}
                    alt={campaign.organizer}
                  />
                  <AvatarFallback>
                    {(() => {
                      if (!campaign?.organizer) return null;

                      const nameParts = campaign.organizer.trim().split(" ");
                      if (nameParts.length === 1) {
                        return nameParts[0][0]?.toUpperCase();
                      } else {
                        return `${nameParts[0][0]}${
                          nameParts[nameParts.length - 1][0]
                        }`.toUpperCase();
                      }
                    })()}
                  </AvatarFallback>
                </Avatar>
                <span>{campaign.organizer}</span>
              </div>
            </TableCell>

            {/* Locations */}
            <TableCell>
              <div className="flex gap-2 flex-wrap">
                {campaign.locations?.flatMap((locationGroup, idx) =>
                  locationGroup.map(
                    (
                      location: {
                        label:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      },
                      locIdx: any
                    ) => (
                      <span
                        key={`${idx}-${locIdx}`}
                        className="px-2 py-1 bg-gray-100 rounded-lg text-sm"
                      >
                        {location.label}
                      </span>
                    )
                  )
                )}
              </div>
            </TableCell>

            {/* Date Submitted */}
            <TableCell>{campaign.date}</TableCell>

            {/* Status */}
            <TableCell>
              <span
                className={`px-4 py-1 rounded-full text-sm border ${getStatusStyle(
                  campaign.status
                )}`}
              >
                {campaign.status}
              </span>
            </TableCell>

            {/* Eye Icon with Tooltip and Routing */}
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigateToCampaign(campaign.id)}
                      // variant="outline"
                    >
                      {" "}
                      <Eye size="20" color="#000" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>view more</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface Withdrawal {
  id: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  bankName: string;
  timestamp: string;
  status: "Pending" | "Completed" | "Failed" | "Processing";
}

export const WithdrawalTable: React.FC<{ withdrawals: Withdrawal[] }> = ({
  withdrawals,
}) => {
  const router = useRouter();
  const currentPath = usePathname();

  const navigateToWithdrawal = (id: string) => {
    let targetPath = "";
    if (currentPath?.includes("/dashboard/withdrawals")) {
      targetPath = `${currentPath}/${id}`;
    } else {
      targetPath = `/dashboard/withdrawals/${id}`;
    }
    router.push(targetPath);
  };

  const getStatusStyle = (status: Withdrawal["status"]): string => {
    const styles = {
      Pending: "text-orange-500 bg-orange-50 border-orange-200",
      Completed: "text-green-500 bg-green-50 border-green-200",
      Failed: "text-red-500 bg-red-50 border-red-200",
      Processing: "text-blue-500 bg-blue-50 border-blue-200",
    };
    return styles[status];
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account Number</TableHead>
          <TableHead>Account Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Bank Name</TableHead>
          <TableHead>Timestamp</TableHead>

          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {withdrawals.map((withdrawal, index) => (
          <TableRow key={index}>
            {/* Account Number with ellipsis */}
            <TableCell className="max-w-[120px]">
              <div className="text-ellipsis overflow-hidden">
                {withdrawal.accountNumber}
              </div>
            </TableCell>

            {/* Account Name with ellipsis */}
            <TableCell className="max-w-[150px]">
              <div className="text-ellipsis overflow-hidden">
                {withdrawal.accountName}
              </div>
            </TableCell>

            {/* Amount */}
            <TableCell>
              $
              {withdrawal.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>

            {/* Bank Name with ellipsis */}
            <TableCell className="max-w-[120px]">
              <div className="text-ellipsis overflow-hidden">
                {withdrawal.bankName}
              </div>
            </TableCell>

            {/* Timestamp */}
            <TableCell>
              {new Date(withdrawal.timestamp).toLocaleString()}
            </TableCell>

            {/* Status */}

            {/* Actions - Eye Icon and Dropdown */}
            <TableCell>
              <div className="flex items-center gap-2">
                <Eye color="#000" size={20} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <MoreVertical size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white p-2 rounded-lg flex flex-col gap-2 shadow"
                  >
                    <DropdownMenuItem>Approve</DropdownMenuItem>
                    <DropdownMenuItem>Reject</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
const DataTable: React.FC<{ data: any[] }> = ({ data }) => {
  const searchParams = useSearchParams();
  const userType =
    searchParams.get("userType") === "organization"
      ? "organization"
      : "contributor";
  //  console.log(userType, "userType");
  const router = useRouter();

  if (!data) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone number</TableHead>
            <TableHead>Date joined</TableHead>
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
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone number</TableHead>
          <TableHead>Date joined</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, i) => (
          <TableRow key={item.name + i}>
            <TableCell
              onClick={() => reroute(item?.id)}
              className="text-main-100 hover:underline cursor-pointer"
            >
              {item.name}
            </TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.phone}</TableCell>
            <TableCell>{item.date}</TableCell>
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

const TabbedDataDisplay: React.FC<TabbedDataDisplayProps> = ({
  recentCampaigns,
  recentUsers,
  isTabHidden,
  onUserTabChange,
  activeUsersTab,
  count,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [date, setDate] = useState<Date>();

  // console.log(pageSize, "pageSize");

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
  //@ts-ignore
  const [activeTab, setActiveTab] = useState<any[]["id"]>(
    getActiveTabFromPath() as string
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUserTab, setActiveUserTab] = useState<string>(() => {
    const userType = searchParams.get("userType");
    return userType || activeUsersTab;
  });
  // console.log(activeUserTab, "activeUserTab");

  useEffect(() => {
    const userType = searchParams.get("userType");
    if (userType && userType !== activeUserTab) {
      setActiveUserTab(userType);
    }
  }, [searchParams, activeUserTab]);

  const tabs: Tab[] = [
    { id: "campaigns", label: "Recent Campaigns" },
    { id: "contributors", label: "Recent Contributors" },
    { id: "organizations", label: "Recent Organizations" },
    { id: "reports", label: "Recent Reports" },
  ];
  const handleUserTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("userType", value);

    // Update URL without causing a full page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setActiveUserTab(value);
    onUserTabChange?.(value);
  };
  const transformedCampaigns =
    recentCampaigns?.map((campaign) => ({
      title: campaign.title,
      id: campaign.id,
      organizer: campaign.organization,
      imageUrl: campaign.image_path?.[0],
      locations: campaign.locations ? [campaign.locations.states] : [],
      date: new Date(campaign.created_at).toLocaleDateString(),
      status: (campaign.status.charAt(0).toUpperCase() +
        campaign.status.slice(1)) as Campaign["status"],
    })) || [];

  const userData =
    recentUsers?.data?.map(
      (recentUser: {
        name: string;
        email: string;
        tel: string;
        created_at: string;
        status: string;
        id: number;
      }) => ({
        name: recentUser?.name,
        email: recentUser?.email,
        id: recentUser?.id,
        phone: recentUser?.tel,
        date: recentUser?.created_at,
        status: recentUser?.status,
      })
    ) || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", currentPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  //console.log(searchParams);

  const handleRowSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());

    setPageSize(size);
    setCurrentPage(1);
    params.set("per_page", size.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    // Reset to first page when changing page size
  };

  //console.log(pageSize, "pageSize");
  const handleSearchTerm = (search: string) => {
    setSearchTerm(search);
    const params = new URLSearchParams(searchParams.toString());

    params.set("search", searchTerm.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="w-full p-6 bg-white rounded-3xl">
      {!isTabHidden ? (
        <div className="mb-6 flex items-center justify-between">
          <TabNav
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
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
                value={searchTerm}
                onChange={(e) => handleSearchTerm(e.target.value)}
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
            <span className="font-medium">Total count</span>

            {activeUserTab !== "organization" ? (
              <h3>
                {(count && count?.data?.total_contributors?.count) || 0}{" "}
                Contributors
              </h3>
            ) : (
              <h3>
                {(count && count?.data?.total_organizations?.count) || 0}{" "}
                Organizations
              </h3>
            )}
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

      {activeTab === "reports" ? (
        <ReportCardGrid
          //@ts-ignore
          reports={myReports}
          isLoading={false}
          onReportClick={() => {}}
          columns={1}
        />
      ) : activeTab === "campaigns" ? (
        <CampaignTable campaigns={transformedCampaigns} />
      ) : (
        <DataTable data={userData} />
      )}

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

export default TabbedDataDisplay;
const userTabs = [
  {
    label: "Contributors",
    value: "contributor",
  },
  {
    label: "Organization",
    value: "organization",
  },
];

interface TabbedDataDisplayProps {
  isTabHidden?: boolean;
  recentCampaigns?: any[];
  isLoading?: boolean;
  recentUsers: ServerResponseOrNull<any> | undefined;
  onUserTabChange?: (tab: string) => void;
  activeUsersTab: string;
  count?: any;
}
