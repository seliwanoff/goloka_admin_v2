import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { format } from "date-fns";

// Type definitions
type Report = {
  id: string | number;
  title: string;
  description: string;
  author: {
    name: string;
    photo: string;
    role?: string;
  };
  date: string;
  metadata?: Record<string, unknown>;
};

type ReportCardGridProps = {
  reports: any[];
  isLoading?: boolean;
  error?: Error | null;
  onReportClick?: (report: Report) => void;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  renderCustomCard?: (report: Report) => React.ReactNode;
  emptyStateMessage?: string;
  loadingCardsCount?: number;
};

const ReportCardGrid: React.FC<ReportCardGridProps> = ({
  reports,
  isLoading = false,
  error = null,
  onReportClick,
  columns = 3,
  className = "",
  // renderCustomCard,
  emptyStateMessage = "No reports available",
  loadingCardsCount = 6,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEE, d, yyyy - HH:mm"); // Adjust format as needed
  };
  // Handle loading state
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-1 gap-6 md:grid-cols-${columns} ${className}`}
      >
        {Array.from({ length: loadingCardsCount }).map((_, index) => (
          <Card key={`loading-${index}`} className="p-4">
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-16" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading reports: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Handle empty state
  if (!reports.length) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-gray-500">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-3 mt-4 gap-6 md:grid-cols-${columns} ${className}`}
    >
      {reports.map((report, index) => {
        // if (renderCustomCard) {
        //   return renderCustomCard(report);
        // }

        return (
          <Card
            key={index}
            className="cursor-pointer bg-[#FCFCFC] border border-[#F2F2F2] transition-shadow hover:shadow-md"
            onClick={() => onReportClick?.(report)}
          >
            <CardContent className="space-y-3 p-4">
              <h3 className="text-sm font-medium text-black line-clamp-2">
                {report.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {report.description}
              </p>
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={report.reporter?.photo}
                    alt={report.reporter?.name}
                    className="h-8 w-8 rounded-full"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {report.reporter?.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {formatDate(report.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ReportCardGrid;
