import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import Pagination from "../lib/navigation/Pagination";
import Image from "next/image";

type Tab = {
  id: string;
  label: string;
};

type TableRowData = {
  name: string;
  email: string;
  phone: string;
  date: string;
  status: "Active" | "Deactivate" | "Pending";
};

type ReportData = {
  title: string;
  description: string;
  author: string;
  authorImage: string;
  date: string;
};

const TabNav: React.FC<{
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}> = ({ tabs, activeTab, onTabChange }) => (
  <div className="mb-6 flex gap-4 bg-gray-100 p-4 rounded-lg">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={cn(
          "px-6 py-2 rounded-full",
          activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-600"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const DataTable: React.FC<{ data: TableRowData[] }> = ({ data }) => (
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
      {data.map((item, index) => (
        <TableRow key={index}>
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
            <button className="p-2">⋮</button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const ReportCards: React.FC<{ reports: ReportData[] }> = ({ reports }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {reports.map((report, index) => (
      <Card key={index} className="p-4">
        <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
        <p className="text-gray-600 mb-4">{report.description}</p>
        <div className="flex items-center gap-3">
          <Image
            src={report.authorImage}
            alt=""
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="font-medium">{report.author}</p>
            <p className="text-sm text-gray-500">{report.date}</p>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const TabbedDataDisplay: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("campaigns");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const tabs: Tab[] = [
    { id: "campaigns", label: "Recent Campaigns" },
    { id: "contributors", label: "Recent Contributors" },
    { id: "organizations", label: "Recent Organizations" },
    { id: "reports", label: "Recent Reports" },
  ];

  const tableData: TableRowData[] = Array.from({ length: 10 }, (_, i) => ({
    name: `Name ${i + 1}`,
    email: `email${i + 1}@example.com`,
    phone: `+123456789${i + 1}`,
    date: `2025-01-${i + 10}`,
    status: i % 2 === 0 ? "Active" : "Deactivate",
  }));

  const reportData: ReportData[] = Array.from({ length: 6 }, (_, i) => ({
    title: `Report Title ${i + 1}`,
    description: `Description for report ${i + 1}`,
    author: `Author ${i + 1}`,
    authorImage: `https://via.placeholder.com/150`,
    date: `2025-01-${i + 5}`,
  }));

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <Button variant="link" className="text-blue-600">
          See all
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between gap-4">
          <div className="relative w-[300px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <Input placeholder="Search..." className="pl-10 rounded-full" />
          </div>
        </div>
      </div>

      {activeTab === "reports" ? (
        <ReportCards reports={reportData} />
      ) : (
        <DataTable data={tableData} />
      )}

      <div className="mt-6">
        <Pagination
          totalItems={320}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onRowSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};

export default TabbedDataDisplay;
