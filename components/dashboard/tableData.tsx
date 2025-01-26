/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {  Search } from "lucide-react";
import { Danger, More, Eye } from "iconsax-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ReportCardGrid from "../report/reportCard";
import { myReports } from "@/app/(system)/dashboard/report/page";

interface Tab {
  id: "campaigns" | "contributors" | "organizations" | "reports";
  label: string;
}

interface Campaign {
  title: string;
  organizer: string;
  imageUrl: string;
  locations: any[];
  date: string;
  status: "Pending" | "Accepted" | "Rejected" | "Reviewed" | "Running";
}

const TabNav: React.FC<{
  tabs: Tab[];
  activeTab: Tab["id"];
  onTabChange: (id: Tab["id"]) => void;
}> = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex gap-2 rounded-full bg-[#F1F1F1] p-3">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={cn(
          "px-6 py-2 rounded-full",
          activeTab === tab.id ? "bg-blue-600 text-white" : "text-[#828282]"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export const CampaignTable: React.FC<{
  campaigns: Campaign[];
  // recentUsers: any[];
}> = ({ campaigns }) => {
  const getStatusStyle = (status: Campaign["status"]): string => {
    const styles = {
      Pending: "text-orange-500 bg-orange-50 border-orange-200",
      Accepted: "text-green-500 bg-green-50 border-green-200",
      Rejected: "text-red-500 bg-red-50 border-red-200",
      Reviewed: "text-purple-500 bg-purple-50 border-purple-200",
      Running: "text-blue-500 bg-purple-50 border-blue-200",
    };
    return styles[status];
  };
  console.log(campaigns, "campaigns");
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign title</TableHead>
          <TableHead>Organisation</TableHead>
          <TableHead>Locations</TableHead>
          <TableHead>Date submitted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign, index) => (
          <TableRow key={index}>
            <TableCell>{campaign.title}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={campaign?.imageUrl}
                    alt={campaign.organizer}
                  />
                  <AvatarFallback>
                    {(() => {
                      if (!campaign?.organizer) {
                        return null;
                      }

                      const nameParts = campaign.organizer.trim().split(" ");
                      if (nameParts.length === 1) {
                        return nameParts[0][0]?.toUpperCase();
                      } else {
                        return `${nameParts[0][0]}${
                          nameParts[nameParts.length - 1][0]
                        }`.toUpperCase();
                      }
                    })()}
                  </AvatarFallback>
                </Avatar>
                <span>{campaign.organizer}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {campaign.locations?.map((locationGroup, idx) => {
                  console.log(locationGroup, "locato"); // Logs each array of locations
                  return (
                    <div key={idx} className="flex flex-wrap gap-2">
                      {locationGroup.map(
                        (
                          location: {
                            label:
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | Promise<
                                  | string
                                  | number
                                  | bigint
                                  | boolean
                                  | React.ReactPortal
                                  | React.ReactElement<
                                      unknown,
                                      string | React.JSXElementConstructor<any>
                                    >
                                  | Iterable<React.ReactNode>
                                  | null
                                  | undefined
                                >
                              | null
                              | undefined;
                          },
                          locIdx: React.Key | null | undefined
                        ) => (
                          <span
                            key={locIdx}
                            className="px-2 py-1 bg-gray-100 rounded-lg text-sm"
                          >
                            {location.label} {/* Display each state's label */}
                          </span>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </TableCell>

            <TableCell>{campaign.date}</TableCell>
            <TableCell>
              <span
                className={`px-4 py-1 rounded-full text-sm border ${getStatusStyle(
                  campaign.status
                )}`}
              >
                {campaign.status}
              </span>
            </TableCell>
            <TableCell>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Eye size="20" color="#000" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const DataTable: React.FC<{ data: any[] }> = ({ data }) => {
  console.log(data, "hyh");
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone number</TableHead>
          <TableHead>Date joined</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, i) => (
          <TableRow key={item.name + i}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.phone}</TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm",
                  item.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : item.status === "Deactivate"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-red-100 text-red-700"
                )}
              >
                {item.status}
              </span>
            </TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="focus:outline-none">
                    <More size="20" color="#000" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-0">
                  <div className="flex flex-col text-sm">
                    <button className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                      <Eye size="20" color="#000" /> View Profile
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-[#f01313]">
                      <Danger size="20" color="#f01313" /> Deactivate
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const TabbedDataDisplay: React.FC<{
  recentCampaigns?: any[];
  isLoading?: boolean;
  recentUsers: any[];
}> = ({ recentCampaigns, recentUsers }) => {
  const [activeTab, setActiveTab] = useState<Tab["id"]>("campaigns");

  const tabs: Tab[] = [
    { id: "campaigns", label: "Recent Campaigns" },
    { id: "contributors", label: "Recent Contributors" },
    { id: "organizations", label: "Recent Organizations" },
    { id: "reports", label: "Recent Reports" },
  ];

  const transformedCampaigns =
    recentCampaigns?.map((campaign) => ({
      title: campaign.title,
      organizer: campaign.organization,
      imageUrl: campaign.image_path[0],
      locations: campaign.locations ? [campaign.locations.states] : [],
      date: new Date(campaign.created_at).toLocaleDateString(),
      status: (campaign.status.charAt(0).toUpperCase() +
        campaign.status.slice(1)) as Campaign["status"],
    })) || [];

  const userData =
    recentUsers?.map((recentUser) => ({
      name: recentUser?.name,
      email: recentUser?.email,
      phone: recentUser?.tel,
      date: recentUser?.created_at,
      status: recentUser?.status,
    })) || [];

  return (
    <div className="w-full p-6 bg-white rounded-3xl">
      <div className="mb-6 flex items-center justify-between">
        <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <Button variant="link" className="text-blue-600">
          See all
        </Button>
      </div>

      {activeTab === "reports" ? (
        <ReportCardGrid
          //@ts-ignore
          reports={myReports}
          isLoading={false}
          onReportClick={() => {}}
          columns={1}
        />
      ) : activeTab === "campaigns" ? (
        <CampaignTable campaigns={transformedCampaigns} />
      ) : (
        <DataTable data={userData} />
      )}

      <div className="mt-6">{/* Pagination component can be added here */}</div>
    </div>
  );
};

export default TabbedDataDisplay;
