/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dot, Eye } from "lucide-react";
import { ClipboardText, Message, Note } from "iconsax-react";

import Link from "next/link";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import { toast } from "sonner";

import { useRemoteUserStore } from "@/stores/remoteUser";
import { getCampaignById, updateCampaignStatus } from "@/services/analytics";
import { getStatusColor } from "@/helper";
import { cn } from "@/lib/utils";
import QuestionTable from "@/components/dashboard/questionTable";
import AcceptCampaignDialog from "@/components/campaign/acceptCampaign";
import RejectCampaignDialog from "@/components/campaign/rejectCampaign";

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 ${className}`}></div>
);

const SkeletonLoader: React.FC = () => {
  return (
    <section className="space-y-4 py-8 pt-[34px]">
      <CustomBreadCrumbs />
      <div className="flex justify-between rounded-lg bg-white p-5">
        <div className="grid grid-cols-[56px_1fr] items-center gap-4">
          <SkeletonBox className="h-14 w-14 rounded-lg" />
          <div className="">
            <SkeletonBox className="mb-2 h-4 w-48" />
            <SkeletonBox className="h-4 w-32" />
          </div>
        </div>
        <div className="hidden items-center justify-center space-x-2 md:flex">
          <SkeletonBox className="h-12 w-32 rounded-full" />
          <SkeletonBox className="h-12 w-12 rounded-full" />
        </div>
      </div>
      <div className="grid h-[30%] gap-4 lg:grid-cols-[2fr_1.5fr]">
        <div className="mb-4 h-full w-full rounded-2xl bg-white p-5 md:mb-0">
          <SkeletonBox className="mb-4 h-6 w-48" />
          <div className="mt-6 flex flex-wrap gap-5 md:justify-between">
            <div className="">
              <SkeletonBox className="mb-2 h-4 w-24" />
              <SkeletonBox className="h-4 w-20" />
            </div>
            <div>
              <SkeletonBox className="mb-2 h-4 w-20" />
              <SkeletonBox className="h-4 w-24" />
            </div>
            <div>
              <SkeletonBox className="mb-2 h-4 w-24" />
              <SkeletonBox className="h-4 w-20" />
            </div>
            <div className="md:text-right">
              <SkeletonBox className="mb-2 h-4 w-24" />
              <SkeletonBox className="h-4 w-20" />
            </div>
          </div>
          <div className="mt-8">
            <SkeletonBox className="mb-2 h-4 w-32" />
            <SkeletonBox className="h-16 w-full" />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5">
          <SkeletonBox className="mb-4 h-[85%] w-full rounded-lg" />
          <div className="mt-5 flex gap-5">
            <SkeletonBox className="h-4 w-12" />
            <SkeletonBox className="h-4 w-16" />
          </div>
        </div>
      </div>
    </section>
  );
};

type PageProps = {};

const TaskDetail: React.FC<PageProps> = ({}) => {
  const [isStepper, setIsStepper] = useState<boolean>(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const { id: campaignId } = useParams();
  const [responseId, setResponseId] = useState<string | null>(null);

  const { user } = useRemoteUserStore();
  const USER_CURRENCY_SYMBOL = user?.country?.["currency-symbol"];
  const {
    data: task,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Get task"],
    queryFn: async () => await getCampaignById(campaignId as string),
  });
  console.log(task, "task");

  //@ts-ignore
  const locations = useMemo(() => task?.data?.locations, [task]);
  //@ts-ignore
  const responses = useMemo(() => task?.data?.responses, [task]);

  console.log(responses, "response");

  useEffect(() => {
    const stepperParam = searchParams.get("stepper");
    const stepParam = searchParams.get("step");

    if (stepperParam === "true" && !isStepper) {
      setIsStepper(true);
    }
  }, [searchParams]);

  const isContributeDisabled = () => {
    return (
      //@ts-ignore
      task?.data?.responses?.length > 0 &&
      //@ts-ignore
      task?.data?.allows_multiple_responses === 0 &&
      //@ts-ignore
      !task?.data?.responses.some((response) => response.status === "draft")
    );
  };

  const onViewResponse = () => {
    //@ts-ignore
    if (task?.data?.responses && task.data.responses.length > 0) {
      const latestResponse =
        //@ts-ignore
        task.data.responses[task.data.responses.length - 1];
      router.push(`/dashboard/responses/${latestResponse.id}`);
    }
  };

  console.log(task, "task");
  //@ts-ignore
  const locationData = task?.data?.locations;

  //@ts-ignore
  const endDate = moment(task?.data?.campaign?.ends_at).format("DD MMMM YYYY");
  //@ts-ignore
  const endTime = moment(task?.data?.campaign?.ends_at).format("hh:mm A");
  //@ts-ignore
  const startDate = moment(task?.data?.campaign?.starts_at).format(
    "DD MMMM YYYY"
  );
  //@ts-ignore
  const startTime = moment(task?.data?.campaign?.starts_at).format("hh:mm A");
  //@ts-ignore
  const createDate = moment(task?.data?.campaign?.created_at).format(
    "DD MMMM YYYY"
  );
  //@ts-ignore
  const createTime = moment(task?.data?.campaign?.created_at).format("hh:mm A");
  //@ts-ignore
  const locationx = task?.data?.campaign?.locations;
  if (isLoading) {
    return <SkeletonLoader />;
  }

  const handleAcceptCampaign = async () => {
    setIsAcceptLoading(true);
    const formData = new FormData();
    formData.append("status", "approved");

    try {
      // await console.log(formData, "formData");
      const res = await updateCampaignStatus(campaignId as string, formData);
      if (res) {
        setIsAcceptLoading(false);
        refetch();
        //@ts-ignore
        toast.success(res?.message);
        // console.log(res?.message);
      }
    } catch (error) {
      console.log(error);
      setIsAcceptLoading(false);
      toast.warning(
        //@ts-ignore
        error?.message || "Could not perform this action at the moment"
      );
    }
  };

  const handleRejectSubmit = async (data: {
    title: string;
    description: string;
  }) => {
    setIsRejectLoading(true);
    const formData = new FormData();
    formData.append("status", "rejected");
    formData.append("message", `${data.title}: ${data.description}`);
    console.log(data, "tht");
    try {
      // await console.log(formData, "formData");
      const res = await updateCampaignStatus(campaignId as string, formData);
      if (res) {
        setIsRejectLoading(false);
        refetch();
        //@ts-ignore
        toast.success(res?.message);
        // console.log(res?.message);
      }
    } catch (error) {
      console.log(error);
      setIsRejectLoading(false);
      toast.warning(
        //@ts-ignore
        error?.message || "Could not perform this action at the moment"
      );
    }
  };
  return (
    <>
      <AcceptCampaignDialog
        loading={isAcceptLoading}
        open={isAcceptDialogOpen}
        onOpenChange={setIsAcceptDialogOpen}
        onAccept={handleAcceptCampaign}
      />
      <RejectCampaignDialog
        loading={isRejectLoading}
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        onSubmit={handleRejectSubmit}
      />
      <section className="space-y-4 py-8 pt-[34px]">
        <div className="flex items-center justify-between">
          <CustomBreadCrumbs />

          <div className=" items-center justify-center space-x-2 flex">
            {/* @ts-ignore */}

            <Button
              onClick={() => setIsRejectDialogOpen(true)}
              className="h-auto gap-3 rounded-full px-4 py-2 text-sm text-[#FF4C4C]  bg-[#FFEDED] hover:text-[#ed1d1d]"
            >
              <span>X</span>
              Reject
            </Button>
            <Button className="h-auto gap-3 rounded-full border border-main-100 bg-white px-3 py-2 text-sm text-main-100 ">
              <span>
                <Message size="20" color="#202fd7" />
              </span>
              Review
            </Button>
            {task?.data?.campaign?.status.toLowerCase() !== "approved" && (
            <Button
              onClick={() => setIsAcceptDialogOpen(true)}
              // disabled={isContributeDisabled()}
              className="h-auto gap-3 rounded-full bg-main-100 px-4 py-2 text-sm shadow-lg shadow-blue-50"
            >
              <span>
                <ClipboardText size="20" color="#fff" />
              </span>
              Accept Campaign
            </Button>

)}
          </div>
        </div>

        <>
          {/* ####################################### */}
          {/* -- Header text section */}
          {/* ####################################### */}

          <div className="flex justify-between rounded-lg bg-white p-5">
            <div className="grid grid-cols-[56px_1fr] items-center gap-4">
              <AspectRatio ratio={1 / 1}>
                <Image
                  //@ts-ignore
                  src={task?.data?.campaign?.image_path?.[0]}
                  alt="Task image"
                  className="h-14 w-14 rounded-lg object-cover"
                  width={100}
                  height={100}
                />
              </AspectRatio>

              <div className="">
                <h3 className="font-semibold text-neutral-900">
                  {/* @ts-ignore */}
                  {task?.data?.campaign?.title}
                </h3>
                <p className="text-sm text-[#828282]">
                  {/* @ts-ignore */}
                  By {task?.data?.campaign?.organization}
                </p>
              </div>
            </div>
            <div className="hidden items-center justify-center space-x-2 md:flex">
              <span
                className={cn(
                  "self-end rounded-full px-3 py-2 text-xs font-medium md:self-center md:px-8 md:py-2.5",
                  //@ts-ignore
                  getStatusColor(task?.data?.campaign?.status)
                )}
              >
                {/* @ts-ignore */}
                {task?.data?.campaign?.status}
              </span>
            </div>
          </div>

          {/* -- Details */}
          <div className="grid h-[40%] gap-4 lg:grid-cols-[1fr]">
            <div className="mb-4 h-full w-full rounded-2xl bg-white p-5 md:mb-0">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Campaign Details
              </h3>
              <div className="mt-6 flex flex-wrap gap-5 md:justify-between">
                <div className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
                  <div className="flex items-center">
                    <h4 className="font-medium text-[#101828]">
                      {/* @ts-ignore */}
                      {task?.data?.campaign?.number_of_responses}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-400">Responses</p>
                </div>

                <div className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
                  <h4 className="text-[#101828]">
                    {/* @ts-ignore */}
                    {task?.data?.campaign?.number_of_responses_received}
                  </h4>
                  <p className="text-sm text-gray-400">Expected response</p>
                </div>
                <div className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
                  <div className="flex gap-2 flex-wrap">
                    {locationx?.states && Array.isArray(locationx.states) ? (
                      locationx.states.map((state: any, idx: any) => (
                        <span
                          key={idx}
                          className="px-1 py-0.5 bg-gray-100 rounded-lg text-sm"
                        >
                          {state.label}
                        </span>
                      ))
                    ) : (
                      <div>No locations or states available</div> // Fallback if no locations or states exist
                    )}
                  </div>
                  <p className="text-sm text-gray-400">Locations</p>
                </div>
                <div className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
                  <div className="md:text-left">
                    <h4 className="font-medium text-[#101828]">
                      {USER_CURRENCY_SYMBOL} {/* @ts-ignore */}
                      {task?.data?.campaign?.payment_rate_for_response}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Per response</p>
                  </div>
                </div>
                <div className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
                  <div className="md:text-left">
                    <h4 className="font-medium text-[#101828]">
                      {/* @ts-ignore */}
                      {task?.data?.campaign?.campaign_group}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Campaign</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div>
                  <div className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
                    {/* @ts-ignore */}
                    <div className="flex items-center">
                      <h4 className="font-medium text-[#101828]">
                        {createDate}
                      </h4>
                      <div className="font-medium text-[#101828]">
                        <Dot size={30} />
                      </div>
                      <span className="font-medium text-[#101828]">
                        {createTime}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">Date Created</span>
                </div>
                <div className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
                  <div className="flex items-center">
                    <h4 className="font-medium text-[#101828]">{startDate}</h4>
                    <div className="font-medium text-[#101828]">
                      <Dot size={30} />
                    </div>
                    <span className="font-medium text-[#101828]">
                      {startTime}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">Start on</span>
                </div>
                <div className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
                  <div className="flex items-center">
                    <h4 className="font-medium text-[#101828]">{endDate}</h4>
                    <div className="font-medium text-[#101828]">
                      <Dot size={30} />
                    </div>
                    <span className="font-medium text-[#101828]">
                      {endTime}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">End on</span>
                </div>
              </div>
              <div className="mt-8 w-full">
                <span className="text-sm text-gray-400">Description</span>
                <p className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
                  {/* @ts-ignore */}
                  {task?.data?.campaign?.description}
                </p>
              </div>
            </div>
          </div>

          {/* ####################################### */}
          {/* -- Tasks section */}
          {/* ####################################### */}
          <div className=" mt-8 bg-[#fff]">
            {/* Task list */}
            <div>
              {/* @ts-ignore */}
              <QuestionTable questions={task?.data?.questions} />
            </div>
          </div>
        </>
      </section>
    </>
  );
};

export default TaskDetail;
