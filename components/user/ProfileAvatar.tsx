// types.ts
type ProfileData = {
  name: string;
  email: string;
  userType: string;
  phoneNumber: string;
  status: string;
  amountEarned: number;
  contribution: number;
  location: string;
  reports: number;
  imageUrl: StaticImageData;
};

// components/ProfileAvatar.tsx
import Image, { StaticImageData } from "next/image";
import avatar from "../../public/assets/images/avatar.png";

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
  <div className="flex justify-between">
    <span className="text-gray-600 text-sm">{label}</span>
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

// components/ProfileCard.tsx

const ProfileCard = ({ data }: { data: ProfileData }) => {
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
        <button className="w-full px-6 py-2 bg-[#E9B384] text-white rounded-lg hover:bg-[#E9B384]/90 transition">
          Deactivate account
        </button>
        <button className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <MessageIcon />
          Message
        </button>
      </div>
    </div>
  );
};

const ProfileSummary = ({ data }: { data: ProfileData }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm w-[35%] space-y-3">
      <h2 className=" font-semibold mb-6">Profile summary</h2>
      <div className="bg-gray-50 p-6 rounded-xl items-center flex justify-center">
        <div className="mb-2">
          <div className="text-blue-600 text-2xl font-bold">
            ${data.amountEarned.toLocaleString()}
          </div>
          <div className="text-blue-600">Amount earned</div>
        </div>
      </div>
      <div className="flex  gap-4 items-center justify-between w-full ">
        <StatItem label="Contribution" value={data.contribution} />
        <StatItem label="Present location" value={data.location} />
        <StatItem label="Reports" value={data.reports} />
      </div>
    </div>
  );
};

// pages/profile.tsx
export default function ProfilePage() {
  const profileData: ProfileData = {
    name: "Jamiu Muhammed",
    email: "jimohjamiu@gmail.com",
    userType: "Contributor",
    phoneNumber: "08082653737",
    status: "Active",
    amountEarned: 200500,
    contribution: 465,
    location: "Lagos",
    reports: 4,
    imageUrl: avatar,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex gap-4 max-w-7xl mx-auto">
        <ProfileCard data={profileData} />
        <ProfileSummary data={profileData} />
      </div>
    </div>
  );
}
