import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaSpinner } from "react-icons/fa";

import { types } from "util";
import { toast } from "sonner";
import { inviteStaffMember } from "@/services/analytics";
import { useShowOverlay } from "@/stores/overlay";
import { Export, Gallery, GalleryExport } from "iconsax-react";

type FormValues = {
  name: string;
  email: string;
  group: string;
  phone: string;
};

interface TeamsDetails {
  id: string;
  label?: string;
}

interface ContributorDetailsProps {
  data: TeamsDetails[];
}

const AddNewStaff: React.FC<ContributorDetailsProps> = ({ data }) => {
  const { open, setOpen } = useShowOverlay();
  const [isSubmitting, setisSubmititng] = React.useState(false);
  const [teams, setTeams] = useState<TeamsDetails[]>([]); // Initialize as empty array
  // console.log(data);

  const [file, setSelectedFile] = useState(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isLoading },
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      group: "",
      phone: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isLoading || isSubmitting) return;

    try {
      setisSubmititng(true);

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("role", data.group);
      formData.append("tel", data.phone);

      if (file) {
        formData.append("profile_photo", file);
      }

      const response = await inviteStaffMember(formData);

      //@ts-ignore
      toast.success(response.message || "Staff invited successfully");
      reset();
      setSelectedFile(null);
    } catch (error) {
      console.log(error);
      //@ts-ignore
      toast.error(
        //@ts-ignore
        error?.response?.data.message || "Error inviting member"
      );
    } finally {
      setisSubmititng(false);
      setOpen(false);
    }
  };
  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={setOpen}>
        {/* Backdrop */}
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

        {/* Modal container */}
        <form
          className="fixed inset-0 z-10 flex items-center justify-center p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
              {/* Header */}
              <div className="relative border-b border-gray-100 px-8 py-4">
                <DialogTitle className="text-[18px] text-lg font-medium text-[#333333]">
                  Invite new staff
                </DialogTitle>

                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-500"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-10 text-center text-sm text-gray-500">
                The role selected defines this user permission, see
                <br /> permission settings page for more details
              </p>

              <div className="p-6">
                <div className="mt-4 flex flex-col gap-6">
                  <div className="flex gap-2">
                    <Label htmlFor="fullname">
                      <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                        Staff name
                      </span>
                      <Input
                        {...register("name", {
                          required: "name is required",
                        })}
                        name="name"
                        id="fullname"
                        placeholder="Input your staff name"
                        className="h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </Label>

                    <Label htmlFor="fullname">
                      <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                        Email address
                      </span>
                      <Input
                        {...register("email", {
                          required: "Email is required",
                        })}
                        name="email"
                        id="fullname"
                        type="email"
                        placeholder="Input your email address"
                        className="h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-full">
                      <label
                        htmlFor="gender"
                        className="mb-2 inline-block font-normal text-[#4F4F4F]"
                      >
                        Role
                      </label>

                      <Controller
                        name="group"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {data?.map((team) => (
                                <SelectItem
                                  key={team.id}
                                  //@ts-ignore
                                  value={team.name.toString()}
                                >
                                  {
                                    //@ts-ignore
                                    team.name?.replaceAll("_", " ")
                                  }
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.group && (
                        <p className="text-xs text-red-500">
                          {errors.group.message}
                        </p>
                      )}
                    </div>

                    <Label htmlFor="phone" className="w-full">
                      <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                        Phone number
                      </span>
                      <Input
                        {...register("phone", {
                          required: "Phone number is required",

                          minLength: {
                            value: 10,
                            message: "Phone number must be at least 10 digits",
                          },
                          maxLength: {
                            value: 15,
                            message: "Phone number cannot exceed 15 digits",
                          },
                        })}
                        name="phone"
                        id="phone"
                        type="tel" // Important for mobile keyboards
                        placeholder="input phone number"
                        className="h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </Label>
                  </div>
                </div>
                <div
                  className="w-full border border-[#e0e0e0] rounded-full flex justify-between items-center h-12 mt-6 p-1 cursor-pointer"
                  onClick={() =>
                    document.getElementById("profile-picture-upload")?.click()
                  }
                >
                  <div className="flex items-center gap-2">
                    <GalleryExport size={20} />
                    <span className="text-sm font-poppins text-[#4F4F4F]">
                      {
                        //@ts-ignore
                        file ? file.name : "Upload profile picture"
                      }
                    </span>
                  </div>

                  <div className="flex items-center rounded-full gap-2 bg-[#EBF0FC] py-1.5 px-3 text-[#3365E3]">
                    <Export />
                    <span className="text-sm text-[#3365E3] font-poppins">
                      Upload
                    </span>
                  </div>

                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        //@ts-ignore
                        setSelectedFile(file);
                        console.log("Selected file:", file.name);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-10 flex w-full flex-col justify-end gap-3 px-6 py-4">
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="h-12 w-full rounded-full bg-main-100 text-base font-light text-white hover:bg-blue-700 disabled:bg-blue-500"
                >
                  {isLoading || isSubmitting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Invite staff"
                  )}
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </form>
      </Dialog>
    </Transition>
  );
};

export default AddNewStaff;
