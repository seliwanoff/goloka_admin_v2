"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Type definition for chart data item
interface ChartDataItem {
  month: string;
  admin_fee: number;
  campaign_fee: number;
}

// Type definition for chart stats
interface ChartStatsProps {
  chartStats?: {
    data?: ChartDataItem[];
    year?: number;
  };
}

export default function CampaignChart({ chartStats }: ChartStatsProps) {
  // Transform the chart data to match the required format
  const chartData: ChartDataItem[] =
    chartStats?.data?.map((item) => ({
      month: item.month,
      admin_fee: item.admin_fee,
      campaign_fee: item.campaign_fee,
    })) || [];

  const chartConfig = {
    admin_fee: {
      label: "Admin Fee",
      color: "hsl(var(--chart-1))",
    },
    campaign_fee: {
      label: "Campaign Fee",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          padding={{ left: 20 }}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₦${value}`}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillAdminFee" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-admin_fee)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-admin_fee)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillCampaignFee" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-campaign_fee)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-campaign_fee)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="campaign_fee"
          type="natural"
          fill="url(#fillCampaignFee)"
          fillOpacity={0.4}
          stroke="var(--color-campaign_fee)"
          stackId="a"
        />
        <Area
          dataKey="admin_fee"
          type="natural"
          fill="url(#fillAdminFee)"
          fillOpacity={0.4}
          stroke="var(--color-admin_fee)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
