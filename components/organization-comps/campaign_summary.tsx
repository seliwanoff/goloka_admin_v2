import {
  ChartConfig,
  ChartContainer,
  // ChartLegend,
  // ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Pie, PieChart } from "recharts";

const chartDataSummary = [
  { type: "pending", summary: 275, fill: "var(--color-pending)" },
  { type: "ongoing", summary: 200, fill: "var(--color-ongoing)" },
  { type: "completed", summary: 187, fill: "var(--color-completed)" },
];

const chartConfigSummary = {
  summary: {
    label: "Summary",
  },
  ongoing: {
    label: "Ongoing",
    color: "#3365E3",
  },
  pending: {
    label: "Pending",
    color: "#F2994A",
  },
  completed: {
    label: "Completed",
    color: "#079455",
  },
} satisfies ChartConfig;

const labels = [
  {
    label: "Ongoing",
    color: "#3365E3",
  },
  {
    label: "Pending",
    color: "#F2994A",
  },
  {
    label: "Completed",
    color: "#079455",
  },
];

console.log(
  Object.values(chartConfigSummary).filter((item) => item?.label !== "Summary"),
  "Chart summary cof",
);

const CampaignSummary = () => {
  return (
    <div className="">
      <ChartContainer
        config={chartConfigSummary}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={chartDataSummary}
            dataKey="summary"
            nameKey="type"
            innerRadius={60}
            outerRadius={100}
          />
        </PieChart>
      </ChartContainer>

      <div className="mt-8 flex items-center justify-center gap-6 border-t border-neutral-300 pt-2">
        {labels.map((item, index) => {
          return (
            <div key={index} className="space-x-1.5">
              <span
                style={{ background: item?.color }}
                className={cn(`inline-block h-2 w-2 rounded`)}
              ></span>
              <span className="text-xs text-[#434343]">{item?.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignSummary;
