// types.ts
type ProfileData = {
  id: number;
  name: string;
  email: string;
  userType: string;
  phoneNumber: string;
  status: string;
  amount: number;
  amount_spent: number;
  contributionOrCampaign: number;
  amount_earned: number;
  campaigns_count: number;
  contributions_count: number;
  location: string;
  reports: number;
  reports_count: number;
  imageUrl: string;
  profile_photo: string;
};

// components/ProfileAvatar.tsx
import Image, { StaticImageData } from "next/image";
import avatar from "../../public/assets/images/avatar.png";
import { modifyUser, updateUserStatus } from "@/services/analytics";
import {
  QueryObserverResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import cover from "@/public/assets/cover.png";

const ProfileAvatar = ({
  imageUrl,
  name,
}: {
  imageUrl: string;
  name: string;
}) => (
  <div className="relative w-24 h-24">
    <Image
      src={imageUrl}
      alt={`${name}'s profile picture`}
      fill
      className="rounded-full object-cover"
      sizes="(max-width: 96px) 100vw, 96px"
      priority
    />
  </div>
);

// components/ProfileField.tsx
const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between mt-2">
    <span className="text-gray-600 text-sm">{label}:</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

// components/StatItem.tsx
const StatItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex flex-col items-start">
    <span className="text-sm font-medium text-gray-900">{value}</span>
    <span className="text-gray-500 text-xs">{label}</span>
  </div>
);

// components/MessageIcon.tsx
const MessageIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

interface ProfileCardProps {
  data: ProfileData;
  onStatusChange: (status: string, reason?: string) => Promise<void>;
}

const ProfileCard = ({ data, onStatusChange }: ProfileCardProps) => {
  const [loading, setLoading] = useState(false);
  const [openActivate, setOpenActivate] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");

  const handleStatusChange = async (newStatus: string, reason?: string) => {
    setLoading(true);
    try {
      await onStatusChange(newStatus, reason);
      toast.success(
        `User successfully ${
          newStatus === "active" ? "activated" : "deactivated"
        }`
      );
      window.location.reload();
    } catch (error) {
      toast.error(
        `Failed to ${newStatus === "active" ? "activate" : "deactivate"} user`
      );
    }
    setLoading(false);
  };

  //  console.log(data, "data");

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm flex-1 flex-col w-[65%] items-center justify-between h-full">
      <div className="flex items-center justify-between gap-8 w-full">
        {/* Left section with avatar and buttons */}
        <div className="flex flex-col items-center space-y-4 w-[50%]">
          {/* @ts-ignore */}
          <ProfileAvatar imageUrl={data.imageUrl} name={data.name} />
          <h1 className="text-2xl font-semibold text-blue-600">{data.name}</h1>
        </div>

        {/* Right section with profile info */}
        <div className="flex-1 space-y-8 w-[50%]">
          <div className="">
            <ProfileField label="Email" value={data.email} />
            <ProfileField label="User type" value={data.userType} />
            <ProfileField label="Phone number" value={data.phoneNumber} />
            <ProfileField label="Status" value={data.status} />
          </div>
        </div>
      </div>
      <div className="w-full space-x-3 flex justify-between mt-auto pt-8">
        {data.status === "Active" ? (
          <button
            className="w-full px-6 py-2 bg-[#f69845] text-white rounded-full hover:bg-[#E9B384]/90 transition"
            onClick={() => setOpenDeactivate(true)}
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Deactivate account"
            )}
          </button>
        ) : (
          <button
            className="w-full px-6 py-2 bg-[#bbefd09a] text-[#27AE60] rounded-full hover:bg-[#27AE60]/90 transition hover:text-white"
            onClick={() => setOpenActivate(true)}
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Activate account"
            )}
          </button>
        )}
        {/***
        <button className="w-full px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <MessageIcon />
          Message
        </button>
        */}
      </div>

      {/* Activate Dialog */}
      <Dialog open={openActivate} onOpenChange={setOpenActivate}>
        <DialogContent className="max-w-md p-0 gap-0">
          <DialogHeader className="p-6 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>

            <div className="space-y-2 text-center">
              <DialogTitle className="text-lg font-normal">
                Activate Account
              </DialogTitle>
              <p className="text-gray-600 text-base">
                Are you sure you want to activate
                <br />
                this account?
              </p>
            </div>
          </DialogHeader>

          <div className="flex p-4 gap-3">
            <Button
              variant="outline"
              className="flex-1 text-base py-3 rounded-full border border-[#27AE60]"
              onClick={() => setOpenActivate(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 text-base py-3 font-normal rounded-full bg-[#27AE60] hover:bg-[#27AE60]/90 hover:text-white"
              onClick={() => {
                handleStatusChange("activate");
                setOpenActivate(false);
              }}
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "Activate account"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deactivate Dialog */}
      <Dialog open={openDeactivate} onOpenChange={setOpenDeactivate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Deactivate Account
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Please provide a reason for deactivating this account
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reason</label>
              <Textarea
                placeholder="Explain the reason here"
                className="min-h-[120px] resize-none"
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
              />
            </div>
          </div>

          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full"
            onClick={() => {
              handleStatusChange("deactivate", deactivateReason);
              setOpenDeactivate(false);
              setDeactivateReason("");
            }}
          >
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Deactivate account"
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProfileSummary = ({ data }: { data: ProfileData }) => {
  console.log(data, "datadatadata");
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm w-[35%] space-y-3 relative">
      <div
        className="absolute inset-0 bg-cover bg-center rounded-xl"
        style={{
          backgroundImage: `url(${cover}`,
          // opacity: "0.1",
        }}
      />
      <h2 className=" font-semibold mb-6">Profile summary</h2>
      <div className="bg-gray-50 p-6 rounded-xl items-center flex justify-center">
        <div className="mb-2 text-center">
          <div className="text-blue-600 text-2xl font-bold">
            ₦ {data?.amount?.toLocaleString()}
          </div>
          <div className="text-blue-600">
            {data?.userType === "Organization"
              ? "Amount Spent"
              : "Amount Earned"}
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center justify-between w-full">
        <StatItem
          label={
            data?.userType === "Organization" ? "Campaigns" : "Contributions"
          }
          value={data?.contributionOrCampaign}
        />
        {data?.userType !== "Organization" && (
          <StatItem label="Present Location" value={data?.location || "N/A"} />
        )}
        <StatItem label="Reports" value={data?.reports} />
      </div>
    </div>
  );
};
interface ProfilePageProps {
  user: {
    id: number;
    name: string;
    email: string;
    user_type: string;
    tel: string;
    status: string;
    amount: number;
    amount_spent: number;
    contributionOrCampaign: number;
    amount_earned: number;
    campaigns_count: number;
    contributions_count: number;
    location: string;
    reports: number;
    reports_count: number;
    imageUrl: string;
    profile_photo: string;
  };
  isLoading?: boolean;
  refetch: RefetchType;
}
type RefetchType = () => Promise<QueryObserverResult>;
export default function rofilePage({
  user,
  isLoading,
  refetch,
}: ProfilePageProps) {
  console.log(user, "nnrew users");

  const queryClient = useQueryClient();
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const profileData: ProfileData = {
    id: user?.id,
    name: user?.name,
    email: user?.email,
    userType: user?.user_type,
    phoneNumber: user?.tel,
    status: user?.status,
    amount:
      user?.user_type === "Organization"
        ? user?.amount_spent
        : user?.amount_earned,
    contributionOrCampaign:
      user?.user_type === "Organization"
        ? user?.campaigns_count
        : user?.contributions_count,
    location: user?.user_type === "Contributor" ? user?.location : "N/A",
    reports: user?.reports_count,
    //@ts-ignore
    imageUrl: user?.profile_photo || avatar,
  };

  const handleStatusChange = async (status: string, reason?: string) => {
    try {
      await updateUserStatus(
        user?.id,
        status,
        user.user_type.toLowerCase(),
        reason
      );
      await refetch();
      // Invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: ["user", user?.id] });

      return true;
    } catch (error) {
      console.error("Failed to update status:", error);
      throw error;
    }
  };

  return (
    <div className=" bg-gray-100">
      <div className="flex gap-4 ">
        {/* @ts-ignore */}
        <ProfileCard data={profileData} onStatusChange={handleStatusChange} />
        <ProfileSummary data={profileData} />
      </div>
    </div>
  );
}

const ProfileSkeleton = () => {
  return (
    <div className="flex gap-4 max-w-7xl mx-auto">
      {/* Profile Card Skeleton */}
      <div className="bg-white p-8 rounded-xl shadow-sm flex-1 flex-col w-[65%] items-center justify-between h-full animate-pulse">
        <div className="flex items-center justify-between gap-8 w-full">
          {/* Avatar and Name Skeleton */}
          <div className="flex flex-col items-center space-y-4 w-[50%]">
            <div className="w-24 h-24 rounded-full bg-gray-200" />
            <div className="h-8 w-40 bg-gray-200 rounded" />
          </div>

          {/* Profile Fields Skeleton */}
          <div className="flex-1 space-y-8 w-[50%]">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Buttons Skeleton */}
        <div className="w-full space-x-3 flex justify-between mt-auto pt-8">
          <div className="w-full h-10 bg-gray-200 rounded-lg" />
          <div className="w-full h-10 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Profile Summary Skeleton */}
      <div className="bg-white p-8 rounded-xl shadow-sm w-[35%] space-y-3 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex flex-col items-center">
            <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex gap-4 items-center justify-between w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-start space-y-2">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
    // </div>
  );
};
