import React from "react";
import Image from "next/image";

interface StaffInfoProps {
  name: string;
  email: string;
  userType: string;
  phoneNumber: string;
  status: "Active" | "Inactive";
  profileImage: string;
}

interface PermissionButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const PermissionButton: React.FC<PermissionButtonProps> = ({
  label,
  active = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm transition-colors ${
        active
          ? "bg-main-100 text-white"
          : "bg-blue-50 text-main-100 hover:bg-blue-100"
      }`}
    >
      {label}
    </button>
  );
};

const StaffInformationPanel: React.FC<StaffInfoProps> = ({
  name,
  email,
  userType,
  phoneNumber,
  status,
  profileImage,
}) => {
  // This would be state in a real implementation
  const activePermissions = ["Access to dashboard", "Access control"];

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl ">
      {/* Staff Information Card */}
      <div className="w-full md:w-2/4 bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-lg text-[#333333] mb-6">Staff information</h2>

        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src={profileImage}
              alt={`${name}'s profile`}
              className="rounded-full object-cover"
              fill
              priority
            />
          </div>
          <h3 className="text-2xl font-medium text-main-100">{name}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Email</span>
            <span className="text-gray-900">{email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">User type</span>
            <span className="text-gray-900">{userType}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Phone number</span>
            <span className="text-gray-900">{phoneNumber}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span className="text-gray-900">{status}</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button className="w-full py-3 rounded-full bg-[#F2EEFB] text-main-100 hover:bg-blue-100 transition-colors">
            Edit account
          </button>
          <button className="w-full py-3 rounded-full bg-green-700 text-[#fff] hover:bg-green-600 transition-colors">
            Activate account
          </button>
          <button className="w-full py-3 rounded-full border border-red-300 text-red-500 hover:bg-red-50 transition-colors">
            Delete account
          </button>
        </div>
      </div>

      {/* Permissions Card */}
      <div className="w-full md:w-3/2 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg text-[#333333] mb-2">Permissions</h2>
        <p className="text-gray-500 text-sm mb-6">
          Select or deselect a permission to make changes <br/>to what certain role
          have access to
        </p>

        <div className="flex flex-wrap gap-3">
          <PermissionButton
            label="Access to dashboard"
            active={activePermissions.includes("Access to dashboard")}
          />
          <PermissionButton label="Invite new staff" />
          <PermissionButton label="View report" />
          <PermissionButton label="View trips" />
          <PermissionButton label="Manage trips" />
          <PermissionButton label="Manage users" />
          <PermissionButton
            label="Access control"
            active={activePermissions.includes("Access control")}
          />
          <PermissionButton label="Permission name" />
          <PermissionButton label="View community" />
          <PermissionButton label="Manage report" />
          <PermissionButton label="Invite new user" />
        </div>
      </div>
    </div>
  );
};

export default function StaffPermissionPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <StaffInformationPanel
        name="Jamiu Muhammed"
        email="jimohjamiu@gmail.com"
        userType="Organization"
        phoneNumber="08082653737"
        status="Active"
        profileImage="/profile-image.jpg"
      />
    </div>
  );
}
