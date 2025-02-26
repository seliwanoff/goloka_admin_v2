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
import { Calendar, Edit, Search, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Pagination from "../lib/navigation/Pagination";
import { ServerResponseOrNull } from "@/services/analytics";
import { Skeleton } from "../ui/skeleton";
import { EmptyPlaceholder } from "../lib/empty_states/table_empty";

const StaffDataDisplay: React.FC<TabbedDataDisplayProps> = ({
  recentUsers,
  isLoading,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [date, setDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Prepare data based on active tab
  const getStaffData = () => {
    return (
      recentUsers?.data?.map((staff: any) => ({
        name: staff?.name,
        email: staff?.email,
        phone: staff?.tel,
        role: staff?.roles[0],
        date: staff?.created_at,
        status: staff?.status,
      })) || []
    );
  };

  // Filter contribution data based on search term
  const filteredStaff = getStaffData().filter((item: any) => {
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

  console.log(filteredStaff, "htkktkk");
  return (
    <div className="w-full p-6 bg-white rounded-3xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex justify-between gap-4 lg:justify-start">
          {/* -- search section */}
          <div className="relative flex w-full items-center justify-center md:w-[250px]">
            <Search className="absolute left-3 text-gray-500" size={18} />
            <Input
              placeholder={`Search staff...`}
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
      </div>

      <div className="mt-6">
        <div className="overflow-x-auto">
          <StaffTable data={filteredStaff} isLoading={isLoading} />
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        {/* @ts-ignore */}
        {recentUsers?.pagination && (
          <Pagination
            //@ts-ignore
            pagination={recentUsers?.pagination}
            onPageChange={handlePageChange}
            onRowSizeChange={handleRowSizeChange}
          />
        )}
      </div>
    </div>
  );
};

export default StaffDataDisplay;

interface TabbedDataDisplayProps {
  isTabHidden?: boolean;
  recentCampaigns?: any[];
  isLoading?: boolean;
  recentUsers: ServerResponseOrNull<any> | undefined;
  userReports?: ServerResponseOrNull<any> | undefined;
  onUserTabChange?: (tab: string) => void;
  activeUsersTab?: string;
}

interface TableProps {
  data: any[];
  isLoading?: boolean;
}

const StaffTable: React.FC<TableProps> = ({ data, isLoading }) => {
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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date Joined</TableHead>
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
    router.push(`/dashboard/staff/${id}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Date Joined</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, i) => (
          <TableRow key={`${item.email}-${i}`}>
            <TableCell
              onClick={() => reroute(item?.email)}
              className="text-main-100 hover:underline cursor-pointer"
            >
              {item.name}
            </TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.phone}</TableCell>
            <TableCell>{item.role}</TableCell>
            <TableCell>{item.date}</TableCell>
            {/* <TableCell>{item.status}</TableCell> */}
            <TableCell>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm border",
                  item.status.toLowerCase() === "active"
                    ? "bg-green-100 text-green-700 border-green-700"
                    : item.status.toLowerCase() === "deactivated"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-700"
                    : item.status.toLowerCase() === "pending"
                    ? "bg-gray-100 text-gray-700 border-gray-700"
                    : item.status.toLowerCase() === "deleted"
                    ? "bg-red-100 text-red-700 border-red-700"
                    : "bg-gray-100 text-gray-700 border-gray-700" // Default fallback
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
                      onClick={() => reroute(item?.email)}
                      className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Eye size="20" color="#000" />
                      View Profile
                    </button>
                    <button
                      onClick={() => reroute(item?.id)}
                      className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Edit size="20" color="#000" />
                      Edit details
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-[#f01313]">
                      <Danger size="20" color="#f01313" /> Deactivate
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-[#f01313]">
                      <Trash2 size="20" color="#f01313" /> Delete
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
    <TableCell>
      <Skeleton className="h-6 w-[20px]" />
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
