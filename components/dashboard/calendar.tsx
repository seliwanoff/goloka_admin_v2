import React, { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CalendarProps {
  onDateChange: (filter: string, fromDate?: string, toDate?: string) => void;
  initialFilter?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  onDateChange,
  initialFilter = "select",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>(initialFilter);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [activeCalendar, setActiveCalendar] = useState<"from" | "to">("from");

  const calendarRef = useRef<HTMLDivElement>(null);

  const filters = [
    { id: "select", label: "Select date" },
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "last7days", label: "Last 7 days" },
    { id: "last30days", label: "Last 30 days" },
    { id: "lastMonth", label: "Last Month" },
    { id: "lastYear", label: "Last Year" },
    { id: "custom", label: "Custom" },
  ];

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowMonthSelect(false);
        setShowYearSelect(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );

  const generateCalendarDays = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const prevMonthLastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate();

    const days = [];

    // Previous month days
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(
          date.getFullYear(),
          date.getMonth() - 1,
          prevMonthLastDay - i
        ),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth() + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (activeCalendar === "from") {
      setFromDate(date);
      setActiveCalendar("to");
    } else {
      setToDate(date);
    }
  };

  const isDateInRange = (date: Date) => {
    if (!fromDate || !toDate) return false;
    return date >= fromDate && date <= toDate;
  };

  const isDateSelected = (date: Date) => {
    return (
      (fromDate && date.toDateString() === fromDate.toDateString()) ||
      (toDate && date.toDateString() === toDate.toDateString())
    );
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);

    if (filter === "select") {
      onDateChange(filter);
      setFromDate(null);
      setToDate(null);
      setIsOpen(false);
      return;
    }

    if (filter !== "custom") {
      const today = new Date();
      let start = new Date();
      let end = new Date();

      switch (filter) {
        case "today":
          start = end = today;
          break;
        case "yesterday":
          start = end = new Date(today.setDate(today.getDate() - 1));
          break;
        case "last7days":
          start = new Date(today.setDate(today.getDate() - 7));
          end = new Date();
          break;
        case "last30days":
          start = new Date(today.setDate(today.getDate() - 30));
          end = new Date();
          break;
        case "lastMonth":
          start = new Date(today.setMonth(today.getMonth() - 1));
          end = new Date();
          break;
        case "lastYear":
          start = new Date(today.setFullYear(today.getFullYear() - 1));
          end = new Date();
          break;
      }

      setFromDate(start);
      setToDate(end);
      onDateChange(
        filter,
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0]
      );
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={calendarRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
      >
        <CalendarIcon className="h-4 w-4 text-gray-500" />
        <span className="text-gray-700">
          {selectedFilter === "custom" && fromDate && toDate
            ? `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
            : filters.find((f) => f.id === selectedFilter)?.label}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[300px] rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="grid grid-rows-1 divide-y divide-gray-200">
            {/* Quick filters */}
            <div className="p-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterSelect(filter.id)}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors
                    ${
                      selectedFilter === filter.id
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Calendar */}
            {selectedFilter === "custom" && (
              <div className="p-3">
                <div className="mb-3 flex items-center justify-between">
                  <button
                    onClick={() => setShowMonthSelect(!showMonthSelect)}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700"
                  >
                    {months[currentMonth.getMonth()]}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowYearSelect(!showYearSelect)}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700"
                  >
                    {currentMonth.getFullYear()}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.setMonth(currentMonth.getMonth() - 1)
                          )
                        )
                      }
                      className="rounded-md p-1 hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.setMonth(currentMonth.getMonth() + 1)
                          )
                        )
                      }
                      className="rounded-md p-1 hover:bg-gray-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Month selector */}
                {showMonthSelect && (
                  <div className="absolute left-0 top-[70px] w-full bg-white shadow-lg p-2 z-10 grid grid-cols-3 gap-1">
                    {months.map((month, idx) => (
                      <button
                        key={month}
                        onClick={() => {
                          setCurrentMonth(new Date(currentMonth.setMonth(idx)));
                          setShowMonthSelect(false);
                        }}
                        className="p-2 text-sm hover:bg-gray-100 rounded"
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}

                {/* Year selector */}
                {showYearSelect && (
                  <div className="absolute left-0 top-[70px] w-full bg-white shadow-lg p-2 z-10 grid grid-cols-3 gap-1">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setCurrentMonth(
                            new Date(currentMonth.setFullYear(year))
                          );
                          setShowYearSelect(false);
                        }}
                        className="p-2 text-sm hover:bg-gray-100 rounded"
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}

                {/* Calendar grid */}
                <div className="mt-2 grid grid-cols-7 gap-1">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                  {generateCalendarDays(currentMonth).map(
                    ({ date, isCurrentMonth }, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDateSelect(date)}
                        className={`
                        text-center text-sm p-1 rounded-full
                        ${!isCurrentMonth ? "text-gray-400" : "text-gray-700"}
                        ${
                          isDateSelected(date)
                            ? "bg-emerald-500 text-white"
                            : ""
                        }
                        ${isDateInRange(date) ? "bg-emerald-50" : ""}
                        hover:bg-gray-100
                      `}
                      >
                        {date.getDate()}
                      </button>
                    )
                  )}
                </div>

                {/* Apply button */}
                <button
                  onClick={() => {
                    if (fromDate && toDate) {
                      onDateChange(
                        "custom",
                        fromDate.toISOString().split("T")[0],
                        toDate.toISOString().split("T")[0]
                      );
                      setIsOpen(false);
                    }
                  }}
                  disabled={!fromDate || !toDate}
                  className="mt-3 w-full rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white
                    hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Range
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
