/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn, classMerge } from "@/lib/utils";
import { Pie, PieChart, Sector } from "recharts";
import { ClipboardExport } from "iconsax-react";
import { DynamicChart } from "../dashboard/dynamicWrapper";

const chartDataSummary = [
  { type: "Pending", summary: 3857, fill: "#F2994A" },
  { type: "Ongoing", summary: 236, fill: "#3365E3" },
  { type: "Completed", summary: 1678, fill: "#079455" },
];

const TotalRevenueCard = ({ widgetStats }: any) => {
  const totalRev = widgetStats?.data?.total_revenue;
  return (
    <div
      className={classMerge(
        "rounded-t-2xl bg-white p-4",
        "bg-gradient-to-tr from-[#3365E3] to-[#1C387D] w-full"
      )}
    >
      <div className="flex justify-between">
        <div>
          <span className="text-sm text-white">Total Revenue</span>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            ₦{totalRev}
          </h3>
        </div>
        <div>
          <span
            className={classMerge(
              "flex items-center justify-center rounded-full p-3",
              "bg-white bg-opacity-[12%]",
              "text-white"
            )}
          >
            <ClipboardExport size={26} color="currentColor" strokeWidth={1} />
          </span>
        </div>
      </div>
      <p className="mt-3 text-white">40% vs last month</p>
    </div>
  );
};

const CampaignSummary = ({ widgetStats }: any) => {
  console.log(widgetStats);
  return (
    <div className="flex flex-col items-center gap-6">
      <TotalRevenueCard widgetStats={widgetStats} />
      <DynamicChart>
        <PieChart width={220} height={220}>
          <Pie
            data={chartDataSummary}
            dataKey="summary"
            nameKey="type"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            label
          >
            {chartDataSummary.map((entry, index) => (
              <Sector
                key={`sector-${index}`}
                cx={50}
                cy={50}
                innerRadius={60}
                outerRadius={90}
                fill={entry.fill}
                // payload={entry}
                cornerRadius={10}
              />
            ))}
          </Pie>
        </PieChart>
      </DynamicChart>

      <div className="flex justify-center gap-6">
        {chartDataSummary.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* <span
              style={{ backgroundColor: item.fill }}
              className={cn("inline-block h-2 w-2 rounded-full")}
            ></span> */}
            <div>
              <div className="flex items-center gap-4">
                {" "}
                <span
                  style={{ backgroundColor: item.fill }}
                  className={cn("inline-block h-2 w-2 rounded-full")}
                ></span>
                <p className="text-sm text-[#828282]">{item.type}</p>
              </div>
              <p className="font-semibold text-[#333333] text-center">
                {item.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignSummary;
