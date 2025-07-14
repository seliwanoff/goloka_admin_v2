"use client";
import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import React, { useState } from "react";
import Image from "next/image";
import Task1 from "@/public/assets/images/tasks/task1.png";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { cn, responseStatus } from "@/lib/utils";
import Logo from "@/public/assets/images/thumb.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@react-hook/media-query";
import FileItem from "@/components/ui/FileItem";
import LocationFile from "@/components/ui/location";
import GoogleMapLocationModal from "@/components/lib/modals/google_map_response";
import FileReaderModal from "@/components/lib/modals/fileReader";

import { Dot, EllipsisVertical, MoveLeft, OctagonAlert, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Send2 } from "iconsax-react";
//import ChatWidget from "@/components/lib/widgets/response-chat-widget";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getStatusColor } from "@/helper";
//import { getReportById, getTaskById } from "@/services/contributor";
import moment from "moment";
import profileImg from "@/public/assets/images/chat-user-profile.png";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  // PopoverClose,
} from "@/components/ui/popover";
//import Map from "@/components/map/map";
import { useUserStore } from "@/stores/currentUserStore";
import Link from "next/link";
import { useGoogleMap, useMediaViewer, useShowReport } from "@/stores/overlay2";
import MultipleChoices from "@/components/ui/multiple-choices";
import CheckboxList from "@/components/ui/checkboxOption";
import DynamicSelect from "@/components/ui/dropdownOption";
import AudioPlayer from "@/components/ui/audioPlayer";
import RadioSelection from "@/components/ui/radio-select";
import RadioGroupWrapper from "@/components/ui/boolean";
import { getAResponse } from "@/services/response";
//import ReportModal from "@/components/lib/modals/report_modal";

interface QuestionOptions {
  id: number;
  label: string;
  value: string;
}

interface Question {
  id: number;
  type: string;
  label: string;
  name: string;
  placeholder: string;
  required: number;
  options: QuestionOptions[] | null;
  attributes: any;
  order: number;
}

interface AnswerItem {
  id: number;
  question: Question;
  value: string | string[] | number | object;
}

interface TableDataProps {
  answers?: AnswerItem[];
}

const ResponseDetails = () => {
  const params = useParams();
  const responseId = params?.id;
  const [activeTab, setActiveTab] = useState("questions");
  const [open, setOpen] = useState(false);
  const [openMessagesAdmin, setOpenMessagesAdmin] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  // const response = getAResponse(responseId as string);
  const currentUser = useUserStore((state) => state.user);
  const {
    data: response,
    isLoading: isResponseLoading,
    refetch: refetchResponse,
  } = useQuery({
    queryKey: ["Get response"],
    queryFn: async () => await getAResponse(responseId as string),
  });

  const res = response?.data;

  const {
    data: report,
    isLoading: isReportLoading,
    refetch: refetchReport,
  } = useQuery<Report, Error>({
    //@ts-ignore
    queryKey: ["report", res?.id],
    //@ts-ignore//
    queryFn: async () => {
      //@ts-ignore
      if (!res?.id) {
        throw new Error("Response ID is required");
      }
      //@ts-ignore
      return await getReportById(res.id);
    },
    //@ts-ignore
    enabled: !!res?.id,
    retry: false,
  });
  // console.log(report);

  // console.log(res);
  const { shows, setShows, setType, setUrl } = useMediaViewer();
  const { show, setShow, setCoordinates, setMethod } = useGoogleMap();
  const { setShowReport, setReportId } = useShowReport();

  const handleFileClick = (url: any, type: any) => {
    //alert(`Clicked on`);
    setType(type);
    setUrl(url);
    setShows(true);
  };
  const renderQuestionInput = (
    type: string,
    value: any,
    preview?: any,
    id?: number,
    options?: any
  ) => {
    switch (type) {
      case "text":
        return (
          <div className="text-[14px]]font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "line":
        return (
          <LocationFile
            imageUrl={JSON.parse(value)}
            onClick={() => {
              setMethod("line");
              setCoordinates(JSON.parse(value));
              setShow(true);
            }}
          />
        );
      case "location":
        return (
          <LocationFile
            imageUrl={JSON.parse(value)}
            onClick={() => {
              setCoordinates([JSON.parse(value)]);
              setShow(true);
            }}
          />
        );
      case "area":
        return (
          <LocationFile
            imageUrl={JSON.parse(value)}
            onClick={() => {
              setMethod("polygon");
              setCoordinates(JSON.parse(value));
              setShow(true);
            }}
          />
        );
      case "textarea":
        return (
          <div className="text-[14px]] w-full font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "select":
        return (
          <MultipleChoices
            label="Select option"
            placeholder="Type something..."
            preview={preview}
            tab="response"
            initialOptions={(() => {
              try {
                const parsedValue = value ? JSON.parse(value) : [];

                // Ensure parsedValue is always an array
                const normalizedArray = Array.isArray(parsedValue)
                  ? parsedValue
                  : [parsedValue]; // Wrap single object in array

                return normalizedArray.map((option) =>
                  typeof option === "object" && option !== null
                    ? { ...option, value: option.value }
                    : { value: option }
                );
              } catch (error) {
                console.error("Error parsing options:", error);
                return [];
              }
            })()}
          />
        );
      case "radio":
        return (
          <RadioSelection
            tab="response"
            initialOptions={(() => {
              try {
                const parsedValue = value ? JSON.parse(value) : [];

                const normalizedArray = Array.isArray(parsedValue)
                  ? parsedValue
                  : [parsedValue];

                return normalizedArray.map((option) =>
                  typeof option === "object" && option !== null
                    ? { ...option, value: option.value }
                    : { value: option }
                );
              } catch (error) {
                console.error("Error parsing options:", error);
                return [];
              }
            })()}
            preview={preview}
          />
        );
      case "checkbox":
        return (
          <CheckboxList
            tab="response"
            initialOptions={(() => {
              try {
                const parsedValue = value ? JSON.parse(value) : [];
                return Array.isArray(parsedValue)
                  ? parsedValue.map((option) =>
                      typeof option === "object" && option !== null
                        ? { ...option, value: option.value }
                        : { value: option }
                    )
                  : [];
              } catch (error) {
                console.error("Error parsing options:", error);
                return [];
              }
            })()}
            preview={preview}
          />
        );
      case "MultipleDrop":
        return (
          <DynamicSelect
            label=" "
            name="country"
            control={""}
            initialOptions={(() => {
              try {
                return options ? options : [];
              } catch (error) {
                console.error("Error parsing options:", error);
                return [];
              }
            })()}
            placeholder="Enter option"
            onChange={(value: any) => {
              // handleAnswerChange(id, value);
            }}
            rules={{ required: "Country is required" }}
            // errors={errors}
          />
        );
      case "video":
        return (
          <FileItem
            imageUrl=""
            fileName="video"
            fileSize="20"
            onClick={() => handleFileClick(JSON.parse(value), "video")}
          />
        );
      case "photo":
        return (
          <FileItem
            imageUrl={JSON.parse(value)}
            fileName="photo"
            fileSize="20"
            onClick={() => handleFileClick(JSON.parse(value), "image")}
          />
        );

      case "file":
        return (
          <FileItem
            imageUrl={JSON.parse(value)}
            fileName="file"
            fileSize="20"
            onClick={() => handleFileClick(JSON.parse(value), "document")}
          />
        );
      case "email":
        return (
          <div className="text-[14px]] font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "url":
        return (
          <Link
            href={`${JSON.parse(value)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {JSON.parse(value)}
          </Link>
        );
      case "password":
        return (
          <div className="text-[14px]] font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "tel":
        return (
          <div className="text-[14px]] font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "number":
        return (
          <div className="text-[14px]] font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "audio":
        return <AudioPlayer src={JSON.parse(value)} />;
      case "boolean":
        return (
          <RadioGroupWrapper
            options={(() => {
              try {
                const parsedOptions = options ? JSON.parse(options) : [];
                return Array.isArray(parsedOptions)
                  ? parsedOptions.map((option) =>
                      typeof option === "object" && option !== null
                        ? {
                            ...option,
                            value: option.value ?? option.label ?? option,
                          }
                        : { label: option, value: option }
                    )
                  : [
                      { label: "True", value: "true" },
                      { label: "False", value: "false" },
                    ];
              } catch (error) {
                console.error("Error parsing options:", error);
                return [
                  { label: "True", value: "true" },
                  { label: "False", value: "false" },
                ];
              }
            })()}
            selectedValue={JSON.parse(value)}
            onChange={() => alert()}
          />
        );
      case "time":
        return (
          <div className="text-[14px]] w-full font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "date":
        return (
          <div className="text-[14px]] w-full font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );

      default:
        return null;
    }
  };

  const {
    data: task,
    isLoading: isTaskLoading,
    refetch: refetchTask,
  } = useQuery({
    //@ts-ignore
    queryKey: ["Get task", res?.campaign_id],
    //@ts-ignore
    queryFn: async () => await getTaskById(res?.campaign_id as string),
    //@ts-ignore
    enabled: !!res?.campaign_id,
    retry: false,
  });

  if (isResponseLoading || isTaskLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <Image
          src={Logo}
          alt="goloka logo"
          width={100}
          height={160}
          className="animate-pulse"
        />
        <p className="animate-pulse font-serif text-lg font-bold text-main-100">
          Loading...
        </p>
      </div>
    );
  }

  //@ts-ignore
  const answers = response?.data?.answers;
  //@ts-ignore
  const Date = moment(task?.data?.ends_at).format("DD MMMM YYYY");
  //@ts-ignore
  const Time = moment(task?.data?.ends_at).format("hh:mm A");
  //@ts-ignore
  const locationData = task?.data?.locations;

  const MessageComponentWithAdmin = () => {
    return (
      <div className="col-span-2 md:col-span-1 md:place-self-end">
        {isDesktop ? (
          <>
            <Sheet open={openMessagesAdmin} onOpenChange={setOpenMessagesAdmin}>
              <SheetTrigger asChild className="relative flex justify-end">
                <Button className="h-full w-[180px] gap-3 rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314]">
                  Chat with admin{" "}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                    {/* @ts-ignore */}
                    {/***res?.unread_messages_count **/}1{" "}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent className="border-0 p-0 md:max-w-md lg:max-w-xl">
                <SheetHeader className="absolute right-0 top-0 z-10 w-full bg-main-100 p-5">
                  <div className="flex items-center gap-5">
                    <div
                      onClick={() => setOpenMessagesAdmin(false)}
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
                      Message
                    </SheetTitle>
                    {/* <SheetDescription className="text-white">
                  24
                </SheetDescription> */}
                  </div>
                  {/* CUSTOM CLOSE */}
                  {/** @ts-ignore */}
                  {!report?.data[0]?.has_message && (
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
                  )}
                </SheetHeader>

                {/* CHAT WIDGET */}
                <div className="mt-24">
                  {/***
                  <ChatWidget
                    modelType="report"
                    //@ts-ignore
                    modelId={+report?.data[0].id}
                    status={task?.data?.status}
                    //@ts-ignore
                    currentUserId={currentUser?.id as number}
                  />
                  */}
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <>
            <Drawer
              open={openMessagesAdmin}
              onOpenChange={setOpenMessagesAdmin}
            >
              <DrawerTrigger asChild>
                <Button className="h-full w-full gap-3 place-self-end rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314] focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[150px]">
                  Message{" "}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                    {/* @ts-ignore */}
                    {/***res?.unread_messages_count () **/}
                  </span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="overflow-hidden border-0 focus-visible:outline-none">
                <DrawerHeader className="absolute left-0 top-0 z-10 w-full bg-main-100 p-5 text-left">
                  <DrawerTitle className="font-normal text-white">
                    {" "}
                    Messages
                  </DrawerTitle>
                  <DrawerDescription className="text-white">
                    24
                  </DrawerDescription>
                  <span
                    onClick={() => setOpenMessagesAdmin(false)}
                    className="absolute right-4 mt-0 flex h-8 w-8 translate-y-[24px] cursor-pointer items-center justify-center rounded-full bg-white text-main-100"
                  >
                    <X size={20} />
                  </span>
                </DrawerHeader>
                <div className="mt-24" />
                {/*
                <ChatWidget
                  modelType="response"
                  //@ts-ignore
                  modelId={+responseId}
                  status={task?.data?.status}
                  //@ts-ignore
                  currentUserId={20}
                />
                */}
              </DrawerContent>
            </Drawer>
          </>
        )}
      </div>
    );
  };
  return (
    <>
      <section className="space-y-4 py-8 pt-[34px]">
        <CustomBreadCrumbs />

        <GoogleMapLocationModal />

        <FileReaderModal />

        <div className="flex items-center justify-between rounded-lg bg-white p-5">
          <div className="grid grid-cols-[56px_1fr] items-center gap-4">
            <AspectRatio ratio={1 / 1}>
              <Image
                //@ts-ignore
                src={task?.data?.image_path[0]}
                alt="Task image"
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg object-cover"
              />
            </AspectRatio>

            <div className="">
              <h3 className="font-semibold text-neutral-900">
                {/* @ts-ignore */}
                {res?.campaign_title}
              </h3>
              {/* @ts-ignore */}
              <p className="text-sm text-[#828282]">By {res?.organization}</p>
            </div>
          </div>

          <span
            className={cn(
              "self-end rounded-full px-3 py-2 text-xs font-medium md:self-center md:px-8 md:py-2.5",
              //@ts-ignore
              getStatusColor(res?.status)
            )}
          >
            {res?.status}
          </span>
        </div>

        <div className="rounded-2xl bg-white p-4 lg:p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="grid w-full grid-cols-2 gap-4 md:gap-y-8"
          >
            <TabsList
              className={cn(
                "col-span-2 w-full rounded-full bg-[#F1F1F1] px-1 py-6 md:col-span-1 md:w-[300px]"
              )}
            >
              <TabsTrigger
                value="questions"
                className={cn(
                  "flex-grow rounded-full py-2.5 text-sm font-normal text-[#828282] data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                )}
              >
                Questions
              </TabsTrigger>
              <TabsTrigger
                value="task-details"
                className={cn(
                  "flex-grow rounded-full py-2.5 text-sm font-normal text-[#828282] data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                )}
              >
                Task details
              </TabsTrigger>
            </TabsList>

            {/* MESSAGE CHAT SHEET */}
            <div className="col-span-2 md:col-span-1 md:place-self-end">
              {isDesktop ? (
                <div className="flex w-full gap-[7px]">
                  {/* @ts-ignore */}
                  {report?.data[0]?.has_message && (
                    <MessageComponentWithAdmin />
                  )}

                  {res?.status.toString() === "rejected" && (
                    <Sheet open={open} onOpenChange={setOpen}>
                      <SheetTrigger asChild className="flex gap-2">
                        <Button className="h-full w-[150px] gap-3 rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314]">
                          Messages{" "}
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                            {/* @ts-ignore */}
                            {res?.unread_messages_count}
                          </span>
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
                          {/**
                          <ChatWidget
                            modelType="response"
                            status={res?.status}
                            modelId={+responseId}
                            currentUserId={currentUser?.id as number}
                          />
                          */}
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
                  )}
                  {res?.status.toString() === "rejected" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <span className="mt-0 flex h-8 w-8 -translate-y-[calc(50%_-_20px)] cursor-pointer items-center justify-center rounded-full bg-[#F0F0F0] text-[#828282]">
                          <EllipsisVertical size={20} className="rotate-90" />
                        </span>
                      </PopoverTrigger>

                      <PopoverContent className="max-w-fit cursor-pointer rounded-md text-[#EB5757] shadow-lg hover:bg-slate-200">
                        <div
                          className="item-center flex gap-3 text-[#EB5757]"
                          onClick={() => {
                            setShowReport(true);
                            //@ts-ignore
                            setReportId(res?.campaign_id);
                          }}
                        >
                          <OctagonAlert />
                          <p className="text-[#EB5757]">Report user</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {/** @ts-ignore */}
                  {report?.data[0]?.has_message && (
                    <Drawer open={open} onOpenChange={setOpen}>
                      <DrawerTrigger asChild>
                        <Button className="h-full w-full gap-3 place-self-end rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314] focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[150px]">
                          Message with admin
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                            {/* @ts-ignore */}
                            {res?.unread_messages_count}
                          </span>
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="overflow-hidden border-0 focus-visible:outline-none">
                        <DrawerHeader className="absolute left-0 top-0 z-10 w-full bg-main-100 p-5 text-left">
                          <DrawerTitle className="font-normal text-white">
                            {" "}
                            Messages
                          </DrawerTitle>
                          <DrawerDescription className="text-white">
                            24
                          </DrawerDescription>
                          <span
                            onClick={() => setOpen(false)}
                            className="absolute right-4 mt-0 flex h-8 w-8 translate-y-[24px] cursor-pointer items-center justify-center rounded-full bg-white text-main-100"
                          >
                            <X size={20} />
                          </span>
                        </DrawerHeader>
                        <div className="mt-24" />
                        {/*
                        <ChatWidget
                          modelType="report"
                          //@ts-ignore
                          modelId={+report?.data[0]?.id}
                          status={task?.data?.status}
                          currentUserId={currentUser?.id as number}
                        />
                        */}
                        {/* <DrawerFooter className="border-t">
                        <form id="chat-box">
                          <div className="flex items-center gap-6">
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
                      </DrawerFooter> */}
                      </DrawerContent>
                    </Drawer>
                  )}

                  {res?.status.toString() === "rejected" && (
                    <div className="relative flex w-full items-center gap-3">
                      <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerTrigger asChild>
                          <Button className="relative h-full w-full gap-3 place-self-end rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314] focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[150px]">
                            Message{" "}
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                              {/* @ts-ignore */}
                              {res?.unread_messages_count}
                            </span>
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="relative overflow-hidden focus-visible:outline-none">
                          <DrawerHeader className="absolute left-0 top-0 z-10 w-full bg-main-100 p-5 text-left">
                            <DrawerTitle className="font-normal text-white">
                              {" "}
                              Messages
                            </DrawerTitle>
                            <DrawerDescription className="text-white">
                              24
                            </DrawerDescription>
                            <span
                              onClick={() => setOpen(false)}
                              className="absolute right-4 mt-0 flex h-8 w-8 translate-y-[24px] cursor-pointer items-center justify-center rounded-full bg-white text-main-100"
                            >
                              <X size={20} />
                            </span>
                          </DrawerHeader>
                          <div className="mt-24" />
                          {/*

                          <ChatWidget
                            modelType="response"
                            modelId={+responseId}
                            status={res?.status}
                            currentUserId={currentUser?.id as number}
                          />
                          */}

                          {/* <DrawerFooter className="border-t">
                        <form id="chat-box">
                          <div className="flex items-center gap-6">
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
                      </DrawerFooter> */}
                        </DrawerContent>
                      </Drawer>
                      {/**@ts-ignore */}
                      {!report?.data[0]?.has_message && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <span className="mt-0 flex h-8 w-8 -translate-y-[calc(50%_-_20px)] cursor-pointer items-center justify-center rounded-full bg-[#F0F0F0] text-[#828282]">
                              <EllipsisVertical
                                size={20}
                                className="rotate-90"
                              />
                            </span>
                          </PopoverTrigger>

                          <PopoverContent className="max-w-fit cursor-pointer rounded-md text-[#EB5757] shadow-lg hover:bg-slate-200">
                            <div
                              className="item-center flex gap-3 text-[#EB5757]"
                              onClick={() => {
                                setShowReport(true);
                                //@ts-ignore
                                setReportId(res?.campaign_id);
                              }}
                            >
                              <OctagonAlert />
                              <p className="text-[#EB5757]">Report user</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* TAB CONTENT */}
            <TabsContent value="questions" className="col-span-2">
              {/* MOBILE VIEW */}
              <div className="md:hidden">
                {answers?.map((answer: AnswerItem, index: number) => (
                  <div
                    key={`${answer.id}-${index}`}
                    className="space-y-3 border-t border-[#E5E5EA] pb-4 pt-4 first:border-0"
                  >
                    <div className="text-sm">
                      <h3 className="mb-1.5 text-sm text-[#828282]">
                        Question
                      </h3>
                      <p className="text-sm text-[#333333]">
                        {answer.question.label}
                      </p>
                    </div>
                    <div className="text-sm">
                      <h3 className="mb-1.5 text-sm text-[#828282]">Answer</h3>
                      {answer?.question?.type &&
                        renderQuestionInput(
                          answer.question.type,
                          JSON.stringify(answer?.value),
                          "preview"
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP VIEW */}

              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-0 bg-[#FBFBFB]">
                      <TableHead className="">Questions</TableHead>
                      <TableHead>Answers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {answers?.map((answer: AnswerItem, index: number) => (
                      <TableRow
                        key={index}
                        className="cursor-pointer"
                        // onClick={() => router.push(`campaigns/${data.id}`)}
                      >
                        <TableCell className="w-1/2 text-sm">
                          {answer?.question.label}
                        </TableCell>
                        <TableCell className="w-1/2 text-sm">
                          {answer?.question?.type &&
                            renderQuestionInput(
                              answer.question.type,
                              JSON.stringify(answer?.value),
                              "preview"
                            )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="task-details" className="col-span-2 w-full">
              {/* -- Details */}
              <div className="grid h-[30%] gap-4 lg:grid-cols-[2fr_1.5fr]">
                <div className="mb-4 h-full w-full rounded-2xl bg-white p-5 md:mb-0">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Task Details
                  </h3>
                  <div className="mt-6 flex flex-wrap gap-5 md:justify-between">
                    <div className="">
                      <div className="flex items-center">
                        <h4 className="font-medium text-[#101828]">{Date}</h4>
                        <div className="font-medium text-[#101828]">
                          <Dot size={30} />
                        </div>
                        <span className="font-medium text-[#101828]">
                          {Time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">Task Ends on</p>
                    </div>
                    <div>
                      <h4 className="text-[#101828]">
                        {/* @ts-ignore */}{" "}
                        {task?.data?.payment_rate_for_response}{" "}
                      </h4>
                      <p className="text-sm text-gray-400">Per response</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#101828]">Multiple</h4>
                      <p className="text-sm text-gray-400">Response type </p>
                    </div>
                    <div className="md:text-left">
                      <h4 className="font-medium text-[#101828]">
                        {/* @ts-ignore */}
                        {task?.data?.type}{" "}
                      </h4>
                      <p className="text-sm text-gray-400">Campaign</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <span className="text-sm text-gray-400">Description</span>
                    <p className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
                      {/* @ts-ignore */}
                      {task?.data?.description}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <div className="mt-5 flex gap-5">
                    <div className="text-sm font-semibold text-[#101828]">
                      {/* @ts-ignore */}
                      {task?.data?.no_of_questions}{" "}
                      <span className="font-normal text-[#828282]">
                        Questions
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-[#101828]">
                      {/* @ts-ignore */}
                      {task?.data?.number_of_responses_received}{" "}
                      <span className="font-normal text-[#828282]">
                        {/* @ts-ignore */}
                        0f {task?.data?.number_of_responses} responses
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/***** REPORT MODAL */}
    </>
  );
};

export default ResponseDetails;
/***
const formatValue = (value: any): JSX.Element | string => {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== null && item !== undefined)
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return formatObjectPairs(item);
        }
        return formatSpecialValues(String(item));
      })
      .filter((item) => item !== "")
      .join(" | ");
  } else if (typeof value === "object" && value !== null) {
    return formatObjectPairs(value);
  }
  return formatSpecialValues(value?.toString() || "");
};
*/

const formatObjectPairs = (obj: any): string => {
  if (!obj || typeof obj !== "object") return "";

  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${formatSpecialValues(value as string)}`)
    .join(", ");
};
const formatSpecialValues = (value: string): React.ReactNode => {
  if (typeof value === "string" && value.startsWith("http")) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        {value}
      </a>
    );
  } else if (typeof value === "string" && value.includes("@")) {
    return (
      <a href={`mailto:${value}`} className="text-blue-500 underline">
        {value}
      </a>
    );
  }
  return value;
};
