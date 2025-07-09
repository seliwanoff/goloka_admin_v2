/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";
import CreateRoleModal from "@/components/lib/modals/add_new_role_modal";
import DesktopSupport from "@/components/support_comps/MobileSupport";
import { getAllRoles, getRoleByStaff, getStaff } from "@/services/analytics";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

type PageProps = {};

const SupportPage: React.FC<PageProps> = ({}) => {
  const { id: staffId } = useParams();

  const {
    data: roles,
    error: usersError,
    isLoading: usersLoading,
  } = useQuery({
    queryKey: ["STAFF"],
    queryFn: () => getAllRoles(),
    retry: 2,
    staleTime: 1000 * 60,
  });

  const {
    data: staffRole,

    isLoading: usersLoadings,
  } = useQuery({
    queryKey: ["STAFF Roles"],
    queryFn: () => getRoleByStaff(staffId as string),
    retry: 2,
    staleTime: 1000 * 60,
  });

  //console.log(staffRole);
  return (
    <>
      {/* DESKTOP */}
      {
        <DesktopSupport
          roles={roles && roles.data}
          staffpermissions={staffRole?.data?.permissions}
        />
      }

      <CreateRoleModal roles={roles && roles?.data} />
      {/*** 
    <MobileSupport /> 

    */}
    </>
  );
};

export default SupportPage;
