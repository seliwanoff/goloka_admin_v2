/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";
import CreateRoleModal from "@/components/lib/modals/add_new_role_modal";
import DesktopSupport from "@/components/support_comps/MobileSupport";
import { getAllRoles, getRoleByStaff, getStaff } from "@/services/analytics";
import { useShowRole } from "@/stores/overlay";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import LoadingComponent from "../../loading";

type PageProps = {};

const PermissionPage: React.FC<PageProps> = ({}) => {
  const { id: staffId } = useParams();
  const { setOpen, open } = useShowRole();

  const {
    data: roles,
    error: usersError,
    isLoading: usersLoading,
  } = useQuery({
    queryKey: ["STAFF", open, setOpen],
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
      {usersLoadings ? (
        <LoadingComponent />
      ) : (
        <DesktopSupport
          roles={roles && roles.data}
          staffpermissions={staffRole?.data?.permissions}
        />
      )}

      <CreateRoleModal roles={roles && roles?.data} />
      {/***
    <MobileSupport />

    */}
    </>
  );
};

export default PermissionPage;
