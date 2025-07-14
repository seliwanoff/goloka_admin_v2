"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaSpinner } from "react-icons/fa";
import { CheckCircle, Trash2 } from "lucide-react";
import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
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
  isEditMode: boolean;
  onClick?: () => void;
}

interface ToastProps {
  message: string;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg transition-opacity duration-300">
      {message}
    </div>
  );
};

const PermissionButton: React.FC<PermissionButtonProps> = ({
  label,
  active = false,
  isEditMode,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm transition-colors ${
        active
          ? "bg-main-100 text-white"
          : "bg-blue-50 text-main-100 hover:bg-blue-100"
      } ${
        isEditMode
          ? "cursor-pointer border-2 border-dashed border-gray-300"
          : ""
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
  // State for managing permissions
  const [permissions, setPermissions] = useState<string[]>([
    "Access to dashboard",
    "Access control",
  ]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [openActivate, setOpenActivate] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");

  const handleStatusChange = async (newStatus: string, reason?: string) => {
    setLoading(true);
    try {
      // await onStatusChange(newStatus, reason);
      toast.success(
        `User successfully ${
          newStatus === "active" ? "activated" : "deactivated"
        }`
      );
    } catch (error) {
      toast.error(
        `Failed to ${newStatus === "active" ? "activate" : "deactivate"} user`
      );
    }
    setLoading(false);
  };

  // All available permissions
  const allPermissions = [
    "Access to dashboard",
    "Invite new staff",
    "View report",
    "View trips",
    "Manage trips",
    "Manage users",
    "Access control",
    "Permission name",
    "View community",
    "Manage report",
    "Invite new user",
  ];

  const toggleEditMode = () => {
    if (isEditMode) {
      // Exiting edit mode without saving
      setIsEditMode(false);
      setSelectedPermissions([...permissions]);
    } else {
      // Entering edit mode
      setIsEditMode(true);
      setSelectedPermissions([...permissions]);
    }
  };

  const togglePermission = (permission: string) => {
    if (!isEditMode) return;

    setSelectedPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const savePermissions = () => {
    // Save the permissions
    setPermissions([...selectedPermissions]);

    // Log to console
    console.log("Updated permissions:", selectedPermissions);

    // Show toast
    // setShowToast(true);
    toast.success("Permission updated successfully!");
    setTimeout(() => setShowToast(false), 3000);

    // Exit edit mode
    setIsEditMode(false);
  };

  return (
    <div>
      <div className="my-4">
        <CustomBreadCrumbs />
      </div>
      <div className="flex flex-col md:flex-row gap-6 max-w-7xl ">
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
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-900">{email}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">User type:</span>
              <span className="text-gray-900">{userType}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Phone number:</span>
              <span className="text-gray-900">{phoneNumber}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-gray-900">{status}</span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={toggleEditMode}
              className="w-full py-2 rounded-full bg-[#F2EEFB] text-main-100 hover:bg-blue-100 transition-colors"
            >
              {isEditMode ? "Cancel edit" : "Edit account"}
            </button>
            {false ? (
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
                className="w-full px-6 py-2 bg-[#bbefd09a] text-[#27AE60] border border-[#27ae60] rounded-full hover:bg-[#27AE60]/90 hover:border-[#27AE60]/90 hover:text-[#fff] transition"
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
            <button
              onClick={() => setOpenDeactivate(true)}
              className="w-full py-2 rounded-full border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
            >
              Delete account
            </button>
          </div>
        </div>

        {/* Permissions Card */}
        <div className="w-full md:w-3/2 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg text-[#333333]">Permissions</h2>
            {isEditMode && (
              <button
                onClick={savePermissions}
                className="px-4 py-2 bg-green-700 text-white rounded-full text-sm hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-6">
            {isEditMode
              ? "Click on permissions to select or deselect them"
              : "Select or deselect a permission to make changes"}{" "}
            <br />
            to what certain role have access to
          </p>

          <div className="flex flex-wrap gap-3">
            {allPermissions.map((permission) => (
              <PermissionButton
                key={permission}
                label={permission}
                active={
                  isEditMode
                    ? selectedPermissions.includes(permission)
                    : permissions.includes(permission)
                }
                isEditMode={isEditMode}
                onClick={() => togglePermission(permission)}
              />
            ))}
          </div>
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
                className="flex-1 text-base py-3 font-normal rounded-full bg-[#27AE60] hover:bg-[#27AE60]/90"
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
            

            <DialogHeader className="p-6 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-700" />
                </div>
              </div>

              <div className="space-y-2 text-center">
                <DialogTitle className="text-lg font-normal">
                  Delete account
                </DialogTitle>
                <p className="text-gray-600 text-base">
                  Are you sure you want to Delete
                  <br />
                  this account? this account information will be erased
                </p>
              </div>
            </DialogHeader>

            <div className="flex p-4 gap-3">
              <Button
                variant="outline"
                className="flex-1 text-base py-3 rounded-full border border-[#eb1717]"
                onClick={() => setOpenDeactivate(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 text-base py-3 font-normal rounded-full bg-[#eb1717] hover:bg-[#eb1717]/90"
                onClick={() => {
                  // handleStatusChange("activate");
                  setOpenDeactivate(false);
                }}
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Delete account"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
