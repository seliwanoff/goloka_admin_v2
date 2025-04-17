"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { chunkArray, cn, myReports } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, CloseCircle, Message, Sms } from "iconsax-react";
import {
  EllipsisVertical,
  Eye,
  LocateFixedIcon,
  LocateIcon,
  MapPin,
  MoveLeft,
  OctagonAlert,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Calendar as CalenderDate } from "@/components/ui/calendar";

import Image from "next/image";
import Pagination from "@/components/lib/navigation/Pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  // SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { BsThreeDots } from "react-icons/bs";
import ReportCardGrid from "@/components/report/reportCard";
import { useQuery } from "@tanstack/react-query";
import { getAllResports, getAResportByID } from "@/services/report";
import ChatWidget from "@/lib/widgets/response-chat-widget";
import { useUserStore } from "@/stores/currentUserStore";
import { useRouter } from "next/navigation";

const Report = () => {
  const [date, setDate] = useState<Date>();
  // const [reports, setReports] = useState<IReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const currentUser = useUserStore((state) => state.user);

  const router = useRouter();

  // console.log(currentUser);
  const {
    data: reports,
    error: userError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["report", currentPage, pageSize],
    queryFn: () => getAllResports(),
    retry: 2,
    staleTime: 1000 * 60,
  });

  //@ts-ignore
  const pages = chunkArray(reports?.data, pageSize);
  //console.log(pages);
  const currentPageData = pages[currentPage - 1] || [];
  const [open, setOpen] = useState<boolean>(false);
  const [openMessage, setOpenMessage] = useState<boolean>(false);

  const [selected, setSelected] = useState<IReport | any>();
  //  console.log(reports);
  const handleOpenReport = (data: any) => {
    //  console.log(index);
    setSelected(data);
    setOpen(true);
  };
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEE, d, yyyy - HH:mm"); // Adjust format as needed
  };

  useEffect(() => {
    if (selected !== undefined) {
      const getAReport = async () => {
        const res = await getAResportByID(selected?.id);
        console.log(res);
      };
      getAReport();
    }
  }, [selected]);

  // console.log(selected);

  return (
    <>
      <section className="mt-4 w-full rounded-2xl bg-white p-6">
        {/* SEARCH AND DATE */}
        <div className="flex gap-2">
          <div className="relative flex w-[250px] items-center justify-center md:w-[300px]">
            <Search className="absolute left-3 text-gray-500" size={18} />
            <Input
              placeholder="Search task, organization"
              type="text"
              className="w-full rounded-full bg-gray-50 pl-10"
            />
          </div>
          {/* DATE */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-min justify-start gap-3 rounded-full px-3 pr-1 text-center text-sm font-normal"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick date</span>}
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

        {/* REPORT LISTS */}

        <ReportCardGrid
          reports={currentPageData}
          isLoading={false}
          //@ts-ignore
          onReportClick={handleOpenReport}
          columns={1}
        />

        <div>
          {" "}
          <div className="mt-6">
            {/* <Pagination

              onPageChange={setCurrentPage}
pagination={}
              onRowSizeChange={setPageSize}
            /> */}
          </div>
        </div>

        {/* SHEET */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="border-none">
            <div className="absolute left-0 top-0 z-10 w-full bg-main-100 p-4">
              <h3 className="text-sm text-white">Report #1838942022 </h3>
              <p className="text-sm text-white">{selected?.date}</p>

              <span
                onClick={() => setOpen(false)}
                className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer rounded-full text-white"
              >
                <CloseCircle variant="Bold" size={24} />
              </span>
            </div>
            <div className="mt-16"></div>
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base">{selected?.title}</SheetTitle>
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-500"
                >
                  Completed{" "}
                </Badge>
              </div>
              <SheetDescription className="mt-5 text-sm text-[#333333]">
                {selected?.description}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8">
              <h3 className="mb-5 text-base text-[#4F4F4F]">Campaign</h3>

              <div className="flex items-center justify-between  p-4 border  border-[#F2F2F2] rounded-[16px]">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-medium text-[#4F4F4F]">
                      {selected?.campaign?.title}
                    </h4>
                    <p className="text-xs text-[#4F4F4F]">
                      {selected?.campaign?.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <MapPin size={20} />
                      <span>location</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="mb-5 text-base text-[#4F4F4F]">Response</h3>

              <div className="flex items-center justify-between  p-4 border  border-[#F2F2F2] rounded-[16px]">
                <div
                  className="flex items-center gap-2 bg-[#3365E30F] p-2 justify-center text-[#3365E3] text-[14px] font-medium cursor-pointer w-full"
                  onClick={() =>
                    router.push(`report/response/${selected?.response_id}`)
                  }
                >
                  <Eye size={20} />
                  <span className="text-[#3365E3]">View all response</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-5 text-base text-[#4F4F4F]">
                Reported {selected?.reported?.type}
              </h3>

              <div className="flex items-center justify-between rounded-[50px] bg-[#F8F8F8] p-3.5">
                <div className="flex items-center gap-2">
                  <Image
                    src={selected?.profile_photo}
                    alt={selected?.name}
                    className="h-8 w-8 rounded-full"
                    width={100}
                  />
                  <div>
                    <h4 className="text-sm font-medium text-[#4F4F4F]">
                      {selected?.reported?.name}
                    </h4>
                    <p className="text-xs text-[#4F4F4F]"></p>
                  </div>
                </div>

                <Popover>
                  <PopoverTrigger>
                    <span className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#DFDFDF] text-[#828282]">
                      <BsThreeDots />
                    </span>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" className="w-min p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[#101828]">
                        <span className="text-[#828282]">
                          <Message />
                        </span>
                        Message
                      </div>
                      <div className="flex items-center gap-3 text-[#101828]">
                        <span className="text-[#828282]">
                          <Sms />
                        </span>
                        Email
                      </div>
                      <div className="flex items-center gap-3 text-[#EB5757]">
                        <span className="text-[#EB5757]">
                          <Message />
                        </span>
                        Deactivate
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-5 text-base text-[#4F4F4F]">Reported by</h3>

              <div className="flex items-center justify-between rounded-[50px] bg-[#F8F8F8] p-3.5">
                <div className="flex items-center gap-2">
                  <Image
                    src={selected?.profile_photo}
                    alt={selected?.name}
                    className="h-8 w-8 rounded-full"
                    width={100}
                  />
                  <div>
                    <h4 className="text-sm font-medium text-[#4F4F4F]">
                      {selected?.reporter?.name}
                    </h4>
                    <p className="text-xs text-[#4F4F4F]">{selected?.date}</p>
                  </div>
                </div>
                <Sheet open={openMessage} onOpenChange={setOpenMessage}>
                  <SheetTrigger asChild className="flex gap-2">
                    <Button className="h-auto rounded-[50px] bg-[#EBF0FC] text-[#3365E3] hover:bg-[#EBF0FC] focus:ring-0">
                      Message
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="border-0 p-0 md:max-w-md lg:max-w-xl">
                    <SheetHeader className="absolute right-0 top-0 z-10 w-full bg-main-100 p-5">
                      <div className="flex items-center gap-5">
                        <div
                          onClick={() => setOpen(false)}
                          className="cursor-pointer text-[#fff]"
                        >
                          <MoveLeft />
                        </div>
                        {/* <Image
                            src={profileImg}
                            alt="chat-user"
                            className="h-12 w-12 rounded-full object-cover object-center"
                          /> */}
                        <SheetTitle className="font-normal text-white">
                          Messages
                        </SheetTitle>
                        {/* <SheetDescription className="text-white">
                            24
                          </SheetDescription> */}
                      </div>
                      {/* CUSTOM CLOSE */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <span className="absolute right-4 mt-0 flex h-8 w-8 -translate-y-[calc(50%_-_20px)] cursor-pointer items-center justify-center rounded-full bg-white text-main-100">
                            <EllipsisVertical size={20} />
                          </span>
                        </PopoverTrigger>
                        <PopoverContent className="max-w-fit cursor-pointer rounded-md text-[#EB5757] shadow-lg hover:bg-slate-200">
                          <div className="item-center flex gap-3 text-[#EB5757]">
                            <OctagonAlert />
                            <p className="text-[#EB5757]">Report user</p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </SheetHeader>

                    {/* CHAT WIDGET */}
                    <div className="mt-24">
                      <ChatWidget
                        modelType="report"
                        status={""}
                        modelId={+selected?.id}
                        //@ts-ignore
                        currentUserId={currentUser?.id}
                      />
                    </div>

                    {/* CHAT MESSAGE INPUT */}
                    {/* <SheetFooter className="absolute bottom-0 left-0 w-full border-t md:flex-row md:justify-start md:p-4">
                        <form id="chat-box" className="block w-full">
                          <div className="flex w-full items-center gap-6">
                            <Input
                              type="text"
                              name="message"
                              id="message"
                              aria-label="Message"
                              placeholder="Input your message"
                              className="form-input h-[50px] rounded-full border border-[#DAD8DF] bg-[#F5F5F5] focus:ring-main-100 focus:ring-offset-0 focus-visible:outline-none"
                            />
                            <Button className="h-[50px] items-center gap-2 rounded-full bg-main-100 px-5 font-medium text-white">
                              <span className="">
                                <Send2 size="24" />
                              </span>
                              Send
                            </Button>
                          </div>
                        </form>
                      </SheetFooter> */}
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </section>
    </>
  );
};

export default Report;

interface IReport {
  title: string;
  description: string;
  photo: any;
  name: string;
  date: string;
}
