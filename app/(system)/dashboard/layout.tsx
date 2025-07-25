/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
// ~ ======= icon imports  -->
import {
  // LucideIcon,
  // FolderClosed,
  LayoutGrid,
  // Files,
  // WandSparkles,
  Settings,
  // LogOut,
  // OctagonAlert,
} from "lucide-react";
import {
  Message,
  Note,
  Profile2User,
  SecurityUser,
  // Note1,
  // People,
  Wallet3,
} from "iconsax-react";

// import NotificationLayout from "@/components/layouts/notification-layout";
import DashSideBarDesktop from "@/components/lib/navigation/dash_sidebar_desktop";
import DashTopNav from "@/components/lib/navigation/dash_topnav";
import { tokenExtractor } from "@/lib/utils";
import { useUserStore } from "@/stores/currentUserStore";
// import { useUserStore } from "@/stores/use-user-store";
// import { StepperProvider } from "@/context/TaskStepperContext.tsx";
// import { useUserStore } from "@/stores/currentUserStore";
// import DashSideBarDesktop from "@/components/lib/navigation/dash_sidebar_desktop";
// import { getCurrentUser } from "@/services/user_service";
// import { User, userStore } from "@/stores/user-store";
// import InfoDialog from "@/components/lib/modals/info_modal";
// import { useQuery } from "@tanstack/react-query";

type LayoutProps = {
  children: React.ReactNode;
};

const SystemLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);

  const hasPermission = useCallback(
    (requiredPermission: string) => {
      return (
        //@ts-ignore
        currentUser?.permissions?.includes("all") ||
        //@ts-ignore
        currentUser?.permissions?.includes(requiredPermission)
      );
    },
    //@ts-ignore
    [currentUser]
  );

  const NavData: {
    icon: any;
    title: string;
    link: string;
    is_permission?: boolean;
  }[] = [
    {
      icon: LayoutGrid,
      title: "Dashboard",
      link: "/dashboard/root",
      is_permission: true,
    },
    {
      icon: Note,
      title: "Campaigns",
      link: "/dashboard/campaigns",
      is_permission: hasPermission("manage_campaigns"),
    },

    {
      icon: Wallet3,
      title: "Withdrawal Requests",
      link: "/dashboard/withdrawal-requests",
      is_permission: hasPermission("manage_campaigns"),
    },
    /***
  {
    icon: Message,
    title: "Messages",
    link: "/dashboard/message",
  },
  */
    {
      icon: Profile2User,
      title: "Users",
      link: "/dashboard/users",
      is_permission: hasPermission("manage_users"),
    },
    {
      icon: SecurityUser,
      title: "Staffs",
      link: "/dashboard/staffs",
      is_permission: hasPermission("access_control"),
    },

    {
      icon: Note,
      title: "Report",
      link: "/dashboard/report",
      is_permission: hasPermission("manage_reports"),
    },

    {
      icon: Wallet3,
      title: "Finance",
      link: "/dashboard/finance",
      is_permission: hasPermission("manage_finance"),
    },
    /***
  {
    icon: Wallet3,
    title: "Finance",
    link: "/dashboard/finance",
  },
  */
    {
      icon: Settings,
      title: "Settings",
      link: "/dashboard/settings",
      is_permission: true,
    },
  ];

  useEffect(() => {
    const checkAuth = () => {
      const token = tokenExtractor();
      if (!token) {
        router.replace("/signin");
      }
    };

    checkAuth();

    // Set up interval to periodically check token validity
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div>
      {/* <StepperProvider totalSteps={5}> */}
      {/* <NotificationLayout> */}
      <div className="grid h-screen min-h-[200px] w-full grid-cols-6 overflow-hidden bg-[#F8F8F8]">
        {
          /*remoteUser*/ true ? (
            <>
              <DashSideBarDesktop navMenuList={NavData} />
              {/* <main className="relative col-span-6 flex h-screen flex-col overflow-hidden pb-10 pt-[70px] xl:col-span-5 xl:bg-[#F8F8F8]">
                  <DashTopNav />
                  <div className="h-[calc(100% - 72px)] tablet:px-8 w-full overflow-auto px-5 pb-10 lg:px-10">
                    {children}
                  </div>
                </main> */}

              <main className="relative col-span-6 flex h-screen flex-col overflow-hidden pb-10 pt-[70px] xl:col-span-5 xl:bg-[#F8F8F8]">
                <DashTopNav />
                <div className="h-[calc(100% - 72px)] w-full overflow-x-hidden px-5 md:px-8 lg:px-10">
                  {children}
                </div>
              </main>
            </>
          ) : (
            <div className="col-span-6 flex h-screen w-full items-center justify-center">
              <p>Loading...</p>
            </div>
          )
        }
      </div>
      {/* </NotificationLayout> */}
      {/* </StepperProvider> */}
    </div>
  );
};

export default SystemLayout;

// ~ =============================================>
// ~ ======= Navigation data -->
// ~ =============================================>
