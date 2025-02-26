"use client";
import StaffInviteModal from "@/components/dashboard/staffInvitationModal";
import StaffDataDisplay from "@/components/dashboard/staffTable";
import { Button } from "@/components/ui/button";
import { getStaff } from "@/services/analytics";
import { useQuery } from "@tanstack/react-query";
import { Cog, ShieldPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Staffs = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const reroute = () => {
    router.push(`/dashboard/staff/permissions`);
  };
  const {
    data: staff,
    error: staffError,
    isLoading: staffLoading,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: () =>
      getStaff({
        per_page: 10,
        page: 1,
        // user_type: user_type,
      }),
    retry: 2,
    staleTime: 1000 * 60,
  });
  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div>
      <div className="col-span-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-main-100 my-6">Staffs</h2>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => reroute()}
            className="h-auto rounded-full bg-white px-8 py-3 text-main-100 hover:bg-blue-50 border border-main-100"
          >
            <span className="mr-3">
              <Cog size="22" color="#144ee2" />{" "}
            </span>
            Edit permission settings
          </Button>
          <Button
            onClick={toggleModal}
            className="h-auto rounded-full bg-main-100 px-8 py-3 text-white hover:bg-blue-700 space-x-3"
          >
            <span className="mr-3">
              <ShieldPlus size="16" color="#fff" />{" "}
            </span>
            Add new staff
          </Button>
        </div>
      </div>
      <StaffInviteModal open={isOpen} setOpen={setIsOpen} />
      <div className="mt-6">
        <StaffDataDisplay isLoading={staffLoading} recentUsers={staff} />
      </div>
    </div>
  );
};

export default Staffs;
