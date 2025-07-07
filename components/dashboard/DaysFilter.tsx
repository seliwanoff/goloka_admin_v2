import React from "react";

interface TimeFilterProps {
  selectedDays: number | null | string;
  onChange: (days: number | null | string) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ selectedDays, onChange }) => {
  const timeFilters = [
    { label: "24 Hours", value: "24_hours" },
    { label: "7 Days", value: "7_days" },
    { label: "30 Days", value: "30_days" },
    { label: "12 Months", value: "12_months" },  
  ];

  return (
    <div className="flex space-x-2  bg-white rounded-md  border  border-[#D0D5DD] ">
      {timeFilters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`px-4 py-3 rounded-md transition-colors font-medium text-sm border-l border-[#D0D5DD] ${
            selectedDays === filter.value
              ? "text-[#344054]"
              : "bg-white text-[#344054] hover:bg-gray-200"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TimeFilter;
