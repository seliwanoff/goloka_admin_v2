import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn, classMerge } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Loading Skeleton Component
const WidgetSkeleton = () => {
  return (
    <div className="rounded-lg bg-gray-100 p-4 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-8 bg-gray-300 rounded w-36"></div>
        </div>
        <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
      </div>
      <div className="mt-3 h-4 bg-gray-300 rounded w-40"></div>
    </div>
  );
};

interface DashboardWidgetProps {
  bg: string;
  fg: string;
  link?: string;
  footer?: string | React.ReactNode;
  containerBg?: string;
  icon?: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  value: string | number | null;
  title: string;
  percentIncrease?: number | null;
  increase?: boolean;
  isAnalytics?: boolean;
  textColor?: string;
  isLoading?: boolean;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  isLoading = false,
  percentIncrease,
  increase,
  icon: Icon,
  ...props
}) => {
  const router = useRouter();

  // If loading, return skeleton
  if (isLoading) {
    return <WidgetSkeleton />;
  }

  return (
    <div
      className={cn("rounded-lg bg-white p-4 ", props.containerBg)}
      onClick={() => props.link && router.push(props.link)}
    >
      <div className="flex justify-between">
        <div>
          <span className={cn("text-sm text-[#828282]", props.textColor)}>
            {props.title}
          </span>
          <h3
            className={cn(
              "mt-3 text-2xl font-semibold text-[#333333]",
              props.textColor
            )}
          >
            {props.value !== null ? props.value : "0.00"}
          </h3>
        </div>
        <div>
          {Icon && (
            <span
              className={classMerge(
                "flex items-center justify-center rounded-full p-3",
                props.bg,
                props.fg
              )}
            >
              <Icon size={26} color="currentColor" strokeWidth={1} />
            </span>
          )}
        </div>
      </div>

      {props.isAnalytics && percentIncrease !== null ? (
        <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
          <p
            className={classMerge(
              "flex items-center gap-1 text-sm font-semibold",
              increase ? "text-green-600" : "text-rose-600"
            )}
          >
            {increase ? (
              <ArrowUp size={16} />
            ) : (
              <ArrowDown className="text-rose-600" size={16} />
            )}
            <span>{percentIncrease}%</span>
          </p>
          <p className="text-sm font-medium text-gray-600">{props.footer}</p>
        </div>
      ) : (
        <p className={cn("mt-3 text-[#475467]", props.textColor)}>
          {props.footer}
        </p>
      )}
    </div>
  );
};

export { DashboardWidget, WidgetSkeleton };
