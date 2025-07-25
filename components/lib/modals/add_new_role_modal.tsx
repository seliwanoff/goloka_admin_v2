import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Warning2 } from "iconsax-react";
import { FaSpinner } from "react-icons/fa";
import { useShowPayoutModal, useShowRole } from "@/stores/overlay";
import { CircleCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRole } from "@/services/analytics";
import { permission } from "process";
import { toast } from "sonner";

type ComponentProps = {
  title?: string;
  content?: string;
  open?: boolean;
  action?: any;
  roles?: any;
  isLoading?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
const CreateRoleModal: React.FC<ComponentProps> = ({
  title,
  content,
  roles,
  action,
  isLoading,
}) => {
  const { setOpen, open } = useShowRole();
  const [name, setName] = useState("");

  const [isLoadings, setIsloading] = useState(false);
  // console.log(roles);

  const allUniquePermissions = [
    ...new Set(roles?.flatMap((role: any) => role.permissions)),
  ];
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleCreateRole = async () => {
    if (isLoadings) return;

    try {
      const payload = {
        name,
        permissions: selectedPermissions,
      };
      setIsloading(true);

      await createRole(payload);

      toast.success("Roles created succesfully");
      setOpen(false);
    } catch (error) {
      toast.error("Error creating roles");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center overflow-hidden p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                <span className="text-[#333333] font-poppins font-medium mb-4 mt-4 text-center block">
                  Input role name and select the features
                  <br /> this role will have access to
                </span>

                <div className="mt-4 flex flex-col gap-6">
                  <Label htmlFor="role">
                    <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                      Role title
                    </span>
                    <Input
                      name="role_title"
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      //  disabled={isLoading || isSubmitting}
                      id="total_number"
                      placeholder="Input role title"
                      className="h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                    />
                  </Label>

                  <Label htmlFor="role">
                    <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                      ermission
                    </span>

                    <ul className="space-y-2 flex items-center flex-wrap gap-2 ">
                      {allUniquePermissions.map((permission: any) => (
                        <li
                          key={permission}
                          onClick={() => togglePermission(permission)}
                          className={`
              flex items-center cursor-pointer gap-2 py-2 px-4 rounded-full text-sm
              transition-colors duration-200
              ${
                selectedPermissions.includes(permission)
                  ? "bg-[#3365E3] text-white"
                  : "bg-[#EBF0FC] text-[#3365E3]"
              }
              hover:opacity-90
            `}
                        >
                          <span>{permission.replaceAll("_", " ")}</span>
                        </li>
                      ))}
                    </ul>
                  </Label>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
                  <Button
                    type="button"
                    className="w-full rounded-full bg-indigo-500 hover:bg-indigo-600"
                    onClick={handleCreateRole}
                  >
                    {isLoadings ? (
                      <FaSpinner className="animate-spin text-white" />
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateRoleModal;
