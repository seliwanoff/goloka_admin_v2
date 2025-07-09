"use client";

import TabbedDataDisplay from "@/components/dashboard/tableData";
import { Button } from "@/components/ui/button";
import { Cog, ShieldPlus } from "lucide-react";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStaff, getUsers } from "@/services/analytics";

const Staffs = () => {
  const {
    data: staffs,
    error: usersError,
    isLoading: usersLoading,
  } = useQuery({
    queryKey: ["STAFF"],
    queryFn: () =>
      getStaff({
        per_page: 10,
        page: 1,
        user_type: "contributor",
        search: "",

        // Use the mapped user_type value
      }),
    retry: 2,
    staleTime: 1000 * 60,
  });
 // console.log(staffs);
  return (
    <div>
      <div className="col-span-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-main-100 my-6">Staffs</h2>
        </div>
        <div className="flex items-center gap-4">
          <Button className="h-auto rounded-full bg-white px-8 py-3 text-main-100 hover:bg-blue-50 border border-main-100">
            <span className="mr-3">
              <Cog size="22" color="#144ee2" />{" "}
            </span>
            Edit permission settings
          </Button>
          <Button className="h-auto rounded-full bg-main-100 px-8 py-3 text-white hover:bg-blue-700 space-x-3">
            <span className="mr-3">
              <ShieldPlus size="16" color="#fff" />{" "}
            </span>
            Add new staff
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <TabbedDataDisplay
          isTabHidden={true}
          recentCampaigns={[]}
          isLoading={undefined}
          recentUsers={undefined}
          staffs={staffs?.data}
          onUserTabChange={undefined}
          activeUsersTab={"User"}
          count={2}
        />
      </div>
    </div>
  );
};

export default Staffs;
