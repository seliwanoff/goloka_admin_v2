"use client";

import DeleteDialog from "@/components/lib/modals/delete_modal";
import DisableModal from "@/components/lib/modals/disable_contributor_modal";
import DisableContributorModal from "@/components/lib/modals/disable_contributor_modal";
import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  activateAmember,
  assignPermissions,
  deactivateAMember,
  deleteMember,
  getAllRoles,
  getStaffById,
  getUserById,
} from "@/services/analytics";

import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import cover from "@/public/assets/cover.png";
import { FaSpinner } from "react-icons/fa";

const StaffProfile = () => {
  const [member, setMember] = useState({});
  const [openRemoved, setOpenRemoved] = useState(false);

  const [openDisable, setOpenDisable] = useState(false);

  const { id: staffId } = useParams();

  const router = useRouter();

  const {
    data: user,
    error: userError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", staffId],
    queryFn: () => getStaffById(staffId as string),
    retry: 2,
    staleTime: 1000 * 60,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    ///getMember();
  }, [, openDisable, openRemoved]);

  const handeDeleteMember = async () => {
    try {
      await deleteMember(staffId);
      toast.success("Staff(s) removed");
      //@ts-ignore
      //queryClient.invalidateQueries(["user", staffId as string]);
      // queryClient.invalidateQueries({ queryKey: ["user"] });

      //   getTeamByEachId();
      // getMember();

      router.push("/dashboard/staffs");
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
      // setShow(false);
    } finally {
      setOpenRemoved(false);
    }
  };

  const handleDisableContributor = async () => {
    try {
      await deactivateAMember(staffId);
      toast.success("Staff deactivated");
      //@ts-ignore
      queryClient.invalidateQueries(["user", staffId as string]);
      //     getTeamByEachId();
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
      // setShow(false);
    } finally {
      setOpenDisable(false);
    }
  };
  const handleActivate = async () => {
    try {
      await activateAmember(staffId);
      //@ts-ignore
      queryClient.invalidateQueries(["user", staffId as string]);
      toast.success("Staff activated");
      // getMember();
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
    } finally {
      setOpenDisable(false);
    }
  };

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSavePermissions = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await assignPermissions(staffId, { permissions: selectedPermissions });

      toast.success("Permission assigned succesfully.");
    } catch (e) {
      console.log(e);
      toast.error("Error assign permission");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="mt-5">
      <div className="mb-8 flex items-center justify-between">
        <CustomBreadCrumbs />
        <div className="inline-flex items-center gap-2">
          <Button
            variant="outline"
            className="items-center gap-2 rounded-[50px] border-main-100 bg-main-100 font-Satoshi text-white"
            onClick={handleSavePermissions}
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Save change"}
          </Button>
        </div>
      </div>
      <div className="mt-5">
        <div className="grid w-full grid-cols-6 gap-4">
          <div className="col-span-2 rounded-[16px] bg-white p-[14px]">
            <h3 className="text-xl font-medium leading-5 text-[#333]">
              Staff information
            </h3>

            <div className="mt-12 flex w-full flex-col gap-[42px]">
              <div className="flex w-full flex-col items-center justify-center gap-5">
                <Image
                  src={(user && user.data.profile_photo) || cover}
                  alt=""
                  width={"100"}
                  height={"100"}
                  className="h-[100px] w-[100px] overflow-hidden rounded-full object-center"
                />

                <span className="bg-gradient-to-r from-[#3365E3] to-[#001C62] bg-clip-text font-poppins text-2xl font-bold text-transparent">
                  {/** @ts-ignore */}
                  {user && user.data.name}
                </span>
              </div>

              <div className="flex w-full flex-col gap-[15px]">
                <div className="flex w-full items-center justify-between">
                  <span className="font-poppins text-sm font-normal text-[#4F4F4F]">
                    Email
                  </span>

                  <span className="font-poppins text-sm font-medium text-[#101828]">
                    {/** @ts-ignore */}
                    {user && user.data.email}
                  </span>
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="font-poppins text-sm font-normal text-[#4F4F4F]">
                    Role
                  </span>

                  <span className="font-poppins text-sm font-medium text-[#101828]">
                    {user?.data?.roles
                      ? user.data.roles
                          .map((role: any) =>
                            role
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (char: any) =>
                                char.toUpperCase()
                              )
                          )
                          .join(", ") // Join multiple roles with comma
                      : "No role assigned"}
                  </span>
                </div>

                <div className="flex w-full items-center justify-between">
                  <span className="font-poppins text-sm font-normal text-[#4F4F4F]">
                    Status
                  </span>

                  <span className="font-poppins text-sm font-medium text-[#101828]">
                    {/** @ts-ignore */}
                    {user && user.data.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {/** @ts-ignore */}
                {user && user.data.status === "Active" && (
                  <Button
                    variant="outline"
                    className="items-center gap-2 rounded-[50px] border-0 bg-[#F2994A14] font-Satoshi font-medium text-[#F2994A]"
                    onClick={() => setOpenDisable(true)}
                  >
                    Deactivate account
                  </Button>
                )}

                {/** @ts-ignore */}
                {user && user.data.status === "Deactivated" && (
                  <Button
                    variant="outline"
                    className="items-center gap-2 rounded-[50px] border-main-100 font-Satoshi font-medium text-main-100"
                    onClick={handleActivate}
                  >
                    Activate account
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="items-center gap-2 rounded-[50px] border-[#EB5757] bg-white font-Satoshi text-[#EB5757]"
                  onClick={() => setOpenRemoved(true)}
                >
                  Delete account
                </Button>
              </div>
            </div>
          </div>
          <div className="col-span-4 rounded-[16px] bg-white p-[14px]">
            <div className="mt-3 flex flex-col gap-2">
              <h3 className="text-xl font-medium leading-5 text-[#333]">
                Permissions
              </h3>

              <span className="font-poppins text-sm font-normal leading-6 text-[#4F4F4F]">
                Select or deselect a permission to make changes <br /> to what
                certain role have access to
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              {user?.data?.permissions?.map((data: string, index: number) => (
                <div
                  key={index}
                  onClick={() => togglePermission(data)}
                  className={`cursor-pointer rounded-[67px] px-4 py-2 text-center text-sm font-normal ${
                    selectedPermissions.includes(data)
                      ? "bg-[#F8F8F8] text-[#4F4F4F] " // Selected style
                      : " bg-[#3366FF] text-white" // Default style
                  }`}
                >
                  {data
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/^\w/, (c: string) => c.toUpperCase())}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DeleteDialog
        title={"Delete Member"}
        open={openRemoved}
        setOpen={setOpenRemoved}
        buttonText="Remove contributor"
        content={
          "Are you sure you want to delete this member? you can’t activate their account again"
        }
        action={handeDeleteMember}
      />

      <DisableModal
        title={"Deactivate member"}
        buttonText="Deactivate"
        open={openDisable}
        setOpen={setOpenDisable}
        content={"Are you sure you want to deactivate this member?"}
        action={handleDisableContributor}
      />
    </section>
  );
};

export default StaffProfile;
