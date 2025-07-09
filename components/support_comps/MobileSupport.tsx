import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  ChevronRight,
  Cog,
  FolderOpen,
  ShieldPlus,
} from "lucide-react";
import { cn, supportTabs } from "@/lib/utils";
//import ContactTab from "./contact_tab";
//import HelpTab from "./help_tab";
//import ChatTab from "./chat_tab";
//import ReportTab from "./report_tab";
import { usePathname, useRouter } from "next/navigation";
import CustomBreadCrumbs from "../lib/navigation/custom_breadcrumbs";
import { Button } from "../ui/button";
import { useShowRole } from "@/stores/overlay";
//import VerificationTab from "./verification_tab";

const DesktopSupport = ({ roles, staffpermissions }: any) => {
  // console.log(staffpermissions);
  const [tab, setTab] = useState(roles && roles[0]?.name);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (roles && roles?.length > 0) {
      setTab(roles[0].name || "super_admin");
    }
  }, [roles]);
  useEffect(() => {
    router.replace(`${pathname}?tab=${tab || "super_admin"}`);
  }, [pathname, router, tab]);

  const { setOpen } = useShowRole();

  return (
    <section className="hidden pb-10 pt-[34px] md:block">
      <div className="flex items-center justify-between w-full mb-6">
        <h1 className="mb-6 text-lg font-semibold text-[#333]">
          <CustomBreadCrumbs />
        </h1>

        <div className="flex items-center gap-4">
          <Button
            className="h-auto rounded-full bg-white px-8 py-3 text-main-100 hover:bg-blue-50 border border-main-100"
            onClick={() => setOpen(true)}
          >
            Create new role
          </Button>
          <Button className="h-auto rounded-full bg-main-100 px-8 py-3 text-white hover:bg-blue-700 space-x-3">
            Save change
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue={tab}
        onValueChange={setTab}
        className="h-[80vh] w-full gap-5 md:grid md:grid-cols-[1fr_2fr]"
      >
        <TabsList className="block h-auto space-y-4 rounded-2xl bg-white p-4 lg:px-6 lg:py-8">
          {roles?.map((role: any, index: number) => (
            <TabsTrigger
              value={role.name}
              key={role.name}
              className="flex h-[50px] w-full items-center justify-between rounded-full border border-[#E0E0E0] bg-[#F8F8F8] text-base font-medium text-[#071E3B] data-[state=active]:border-main-100 data-[state=active]:bg-[#3365E305] data-[state=active]:text-main-100"
            >
              {role?.name?.replaceAll("_", " ")}
              <span>
                <ChevronRight color="#808080" size={20} />
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {roles?.map((role: any) => (
          <TabsContent
            value={role.name}
            className={cn("relative m-0 h-full w-full bg-transparent md:top-0")}
            key={role.id}
          >
            <div className="h-full rounded-2xl bg-white p-4 lg:px-6 lg:py-8">
              {role.permissions?.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Permissions</h3>
                  <p>
                    Select or deselect a permission to make changes to <br />{" "}
                    what certain role have access to
                  </p>
                  <ul className="space-y-2 flex items-center flex-wrap gap-2 ">
                    {role.permissions.map((permission: any) => (
                      <li
                        key={permission.id}
                        className={cn(
                          "flex items-center gap-2 py-2 px-4 rounded-full text-sm",
                          staffpermissions?.includes(permission) // Check if permission exists in staffpermissions array
                            ? "bg-[#3365E3] text-white" // Active state (permission granted)
                            : "bg-[#EBF0FC] text-[#3365E3]" // Default state (permission not granted)
                        )}
                      >
                        <span>{permission.replaceAll("_", " ")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-gray-500">
                  <FolderOpen size={48} className="mb-4 opacity-60" />
                  <p className="text-lg">No permissions assigned</p>
                  <p className="text-sm">
                    This role currently has no permissions
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default DesktopSupport;

const supportTabContent = [
  {
    title: "Verification",
    label: <div />,
    value: "verification",
  },
  {
    title: "Contact Goloka",
    label: <div />,
    value: "contact",
  },
  /***
  {
    title: "Help center",
    label: <HelpTab />,
    value: "help",
  },
  */
  // {
  //   title: "Chat with Goloka",
  //   label: <ChatTab />,
  //   value: "chat",
  // },
  {
    title: "Report an issue",
    label: <div />,
    value: "report",
  },
];
