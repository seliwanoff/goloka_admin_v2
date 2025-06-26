"use client";
import TabbedDataDisplay, {
  CampaignTable,
  WithdrawalTable,
} from "@/components/dashboard/tableData";
import Pagination from "@/components/lib/navigation/Pagination";
import { DashboardWidget } from "@/components/lib/widgets/dashboard_card";
import {
  getAllCampaigns,
  getAllWithdrawalRequests,
  getUsers,
  getUsersCount,
  getUsersStats,
  getWithdrawalRequestCount,
} from "@/services/analytics";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  CardReceive,
  CardTick1,
  MoneyTime,
  Receipt21,
  Setting4,
} from "iconsax-react";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Profile2User,
  ProfileDelete,
  ProfileRemove,
  ProfileTick,
} from "iconsax-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import InvoiceModal from "@/components/lib/modals/invoice-modal";
import { useInvoiceOverlay } from "@/stores/overlay2";
import ConfirmPayoutModal from "@/components/lib/modals/confirm_payout_modal";
import { markTransactionAsPaid } from "@/services/auth";
import { toast } from "sonner";
import { useShowPayoutModal } from "@/stores/overlay";

const renderTable = (tdata: any[]) => {
  return <WithdrawalTable withdrawals={tdata} />;
};

const WithdrawalRequestsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>();

  const currentTab = searchParams.get("type") || "requests";

  const user_type = currentTab === "paid" ? "paid" : "pending";

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("per_page")) || 10;
  const [activeTab, setActiveTab] = useState("pending");

  const search = searchParams.get("search") || "";

  const { setOpenFilter, id, openFilter } = useShowPayoutModal();

  useEffect(() => {
    if (!searchParams.get("type")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("type", "requests");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [pathname, router, searchParams]);

  // Users query with pagination support

  const {
    data: withdrawalCount,
    error: withdrawalErrorCount,
    isLoading: withdrawalCountLoading,
  } = useQuery({
    queryKey: [
      "WITHDRAWAL_COUNT",
      currentTab,
      currentPage,
      pageSize,
      search,
      openFilter,
      search,
    ],
    queryFn: () => getWithdrawalRequestCount(),
    retry: 2,
    staleTime: 1000 * 60,
  });

  // Stats query

  const {
    data: WithdrawalRequests,
    error: withdrawalError,
    isLoading: isWithdrawalLoading,
  } = useQuery({
    queryKey: [
      "recent-withdrawal-requests",
      currentPage,
      pageSize,
      activeTab,
      openFilter,
      search,
      date,
    ],
    queryFn: () =>
      getAllWithdrawalRequests({
        per_page: pageSize,
        page: currentPage,
        status: activeTab === "paid" ? "successful" : "pending",
        search: search,
        //@ts-ignore
        submitted_at: date ? format(date, "yyyy-MM-dd") : undefined,
      }),
    retry: 2,
  });

  //  console.log(WithdrawalRequests);

  const handleSearch = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", searchTerm);
    params.set("page", "1"); // Reset to first page on search
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    //setCurrentPage(page);
  };

  const handleRowSizeChange = (size: number) => {
    // setPageSize(size);
    //setCurrentPage(1); // Reset to first page when changing page size
  };
  const renderWidgets = () => {
    const paid_count = withdrawalCount?.data?.paid_requests ?? 0;
    const pending_count = withdrawalCount?.data?.pending_requests ?? 0;
    const total_count = withdrawalCount?.data?.total_requests ?? 0;

    return (
      <>
        <DashboardWidget
          title="Total Requests"
          bg="bg-[#3365E31F] bg-opacity-[12%]"
          fg="text-[#3365E3]"
          icon={CardReceive}
          value={total_count}
          isLoading={withdrawalCountLoading}
        />

        <DashboardWidget
          title="Pending Requests"
          bg="bg-[#FEC53D] bg-opacity-[12%]"
          fg="text-[#FEC53D]"
          icon={MoneyTime}
          value={pending_count}
          isLoading={withdrawalCountLoading}
        />

        <DashboardWidget
          title="Paid Requests"
          bg="bg-[#674AE8] bg-opacity-[12%]"
          fg="text-[#674AE8]"
          icon={CardTick1}
          value={paid_count}
          isLoading={withdrawalCountLoading}
        />
      </>
    );
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleProceed = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await markTransactionAsPaid(id);
      toast.success("Transaction marked as paid successfully");
      setOpenFilter(false);
    } catch (error) {
      console.error("Error marking transaction as paid:", error);
      toast.error("Failed to mark transaction as paid. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Update URL when date changes
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);

    const newParams = new URLSearchParams(searchParams.toString());
    if (selectedDate) {
      newParams.set("date", selectedDate.toISOString());
    } else {
      newParams.delete("date");
    }
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  return (
    <section className="mt-5">
      {/* COUNT */}
      <div className="col-span-5 flex w-max gap-4 lg:grid lg:w-full lg:grid-cols-4 xl:w-full my-6">
        {renderWidgets()}
      </div>
      {/* TABLE OPTIONS */}
      <div className="rounded-2xl bg-white p-[14px]">
        {/* OPTIONS */}
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <div className="flex justify-between gap-4 lg:justify-start">
              {/* -- search section */}
              <div className="relative flex w-[250px] items-center justify-center md:w-[250px]">
                <Search className="absolute left-3 text-gray-500" size={18} />
                <Input
                  placeholder="Search Name, bank or account number"
                  type="text"
                  className="w-full rounded-full bg-gray-50 pl-10"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div className="hidden lg:flex lg:gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-10 w-[240px] justify-start gap-3 rounded-full px-4 text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon size={16} className="opacity-70" />
                      {date ? format(date, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="rounded-md border p-2"
                      classNames={{
                        months: "flex flex-col space-y-4 sm:space-y-0",
                        month: "space-y-4",
                        caption:
                          "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                          "absolute top-1" // Position nav buttons
                        ),
                        nav_button_previous: "left-1",
                        nav_button_next: "right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell:
                          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: cn(
                          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                          "[&:has([aria-selected])]:bg-accent",
                          "first:[&:has([aria-selected])]:rounded-l-md",
                          "last:[&:has([aria-selected])]:rounded-r-md"
                        ),
                        day: cn(
                          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        ),
                        day_selected: cn(
                          "bg-primary text-primary-foreground",
                          "hover:bg-primary hover:text-primary-foreground",
                          "focus:bg-primary focus:text-primary-foreground"
                        ),
                        day_today: "bg-accent text-accent-foreground",
                        day_outside: "text-muted-foreground opacity-50",
                        day_disabled: "text-muted-foreground opacity-50",
                        day_range_middle:
                          "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        day_hidden: "invisible",
                      }}
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

            {/* FILTER TABS */}
            <div>
              <Tabs
                value={activeTab}
                onValueChange={(val) => {
                  setActiveTab(val);
                  //  setactiveTab(val);
                }}
                className="w-full md:w-max"
              >
                <TabsList
                  className={cn(
                    "w-full justify-start rounded-full bg-[#F1F1F1] px-1 py-6 sm:w-auto md:justify-center"
                  )}
                >
                  {tabs.map((tab: any, index: number) => (
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
        </div>

        {/* TABLE DATA */}
        <div className="">{renderTable(WithdrawalRequests?.data || [])}</div>

        {/* Pagination
        <div className="mt-6">

          {Campaigns?.pagination && (
            <Pagination
              //@ts-ignore

              pagination={Campaigns.pagination}
              onPageChange={handlePageChange}
              onRowSizeChange={handleRowSizeChange}
            />
          )}
        </div>
         */}
      </div>
      <InvoiceModal />
      <ConfirmPayoutModal action={handleProceed} isLoading={isLoading} />
    </section>
  );
};

export default WithdrawalRequestsPage;

const tabs = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Paid",
    value: "paid",
  },
];

const datas = [
  {
    id: "1",
    accountNumber: "1234567890",
    accountName: "John Doe",
    amount: 1500.75,
    bankName: "Chase Bank",
    timestamp: "2023-05-15T09:30:45Z",
    status: "Pending",
  },
  {
    id: "2",

    accountNumber: "9876543210",
    accountName: "Jane Smith",
    amount: 2450.2,
    bankName: "Bank of America",
    timestamp: "2023-05-15T10:15:22Z",
    status: "Pending",
  },
  {
    id: "3",

    accountNumber: "4567891230",
    accountName: "Robert Johnson",
    amount: 500.0,
    bankName: "Wells Fargo",
    timestamp: "2023-05-15T11:45:10Z",
    status: "Pending",
  },
  {
    id: "4",

    accountNumber: "7890123456",
    accountName: "Emily Davis",
    amount: 3200.5,
    bankName: "Citibank",
    timestamp: "2023-05-15T13:20:33Z",
    status: "Pending",
  },
  {
    id: "5",
    accountNumber: "2345678901",
    accountName: "Michael Brown",
    amount: 125.99,
    bankName: "US Bank",
    timestamp: "2023-05-15T14:55:18Z",
    status: "Pending",
  },
  {
    id: "6",
    accountNumber: "8901234567",
    accountName: "Sarah Wilson",
    amount: 750.25,
    bankName: "TD Bank",
    timestamp: "2023-05-15T16:30:42Z",
    status: "Pending",
  },
  {
    id: "7",
    accountNumber: "3456789012",
    accountName: "David Taylor",
    amount: 1800.0,
    bankName: "Capital One",
    timestamp: "2023-05-15T18:05:27Z",
    status: "Pending",
  },
  {
    id: "8",
    accountNumber: "9012345678",
    accountName: "Jessica Martinez",
    amount: 950.6,
    bankName: "PNC Bank",
    timestamp: "2023-05-15T19:40:15Z",
    status: "Pending",
  },
  {
    id: "9",
    accountNumber: "5678901234",
    accountName: "Daniel Anderson",
    amount: 2750.3,
    bankName: "HSBC",
    timestamp: "2023-05-15T21:15:08Z",
    status: "Pending",
  },
  {
    id: "10",
    accountNumber: "6789012345",
    accountName: "Lisa Thomas",
    amount: 420.75,
    bankName: "Barclays",
    timestamp: "2023-05-15T22:50:39Z",
    status: "Pending",
  },
];
