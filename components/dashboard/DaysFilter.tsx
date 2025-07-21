import React from "react";

interface TimeFilterProps {
  selectedDays: number | null | string;
  onChange: (days: number | null | string) => void;
  setSelectedDays?: any;
}

const TimeFilter: React.FC<TimeFilterProps> = ({
  selectedDays,
  onChange,
  setSelectedDays,
}) => {
  const timeFilters = [
    { label: "24 Hours", value: "24_hours" },
    { label: "7 Days", value: "7_days" },
    { label: "30 Days", value: "30_days" },
    { label: "12 Months", value: "12_months" },
  ];

  return (
    <div className="flex  bg-white rounded-md border border-[#D0D5DD]">
      {timeFilters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => {
            setSelectedDays(filter.value);
            onChange(filter.value);
          }}
          className={`px-4 py-3 rounded-md transition-colors font-medium text-sm border-l border-[#D0D5DD] ${
            selectedDays === filter.value
              ? "bg-main-100 text-white border-[#7F56D9]" // Selected state
              : "bg-white text-[#344054] hover:bg-gray-100" // Default state
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TimeFilter;
