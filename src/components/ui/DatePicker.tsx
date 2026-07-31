"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string; // Format: YYYY-MM-DD or empty
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  return `${day}-${month}-${year}`;
}

export function DatePicker({ value, onChange, className, placeholder = "Select date..." }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Initialize view date based on value or today
  const initialDate = React.useMemo(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  }, [value]);

  const [currentYear, setCurrentYear] = React.useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = React.useState(initialDate.getMonth());

  React.useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setCurrentYear(d.getFullYear());
        setCurrentMonth(d.getMonth());
      }
    }
  }, [value]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Generate days grid
  const daysGrid = React.useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const grid: Array<{ day: number; monthOffset: number; dateStr: string }> = [];

    // Previous month padding days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      grid.push({ day, monthOffset: -1, dateStr });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      grid.push({ day, monthOffset: 0, dateStr });
    }

    // Next month padding days to complete rows (target 35 or 42)
    const remainingSlots = (42 - grid.length) % 7 === 0 && grid.length >= 35 ? 0 : 42 - grid.length;
    for (let day = 1; day <= remainingSlots; day++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      grid.push({ day, monthOffset: 1, dateStr });
    }

    return grid;
  }, [currentYear, currentMonth]);

  const todayStr = React.useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  }, []);

  const handleSelectDay = (dateStr: string) => {
    onChange(dateStr);
    setOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setOpen(false);
  };

  const handleToday = () => {
    onChange(todayStr);
    const t = new Date();
    setCurrentYear(t.getFullYear());
    setCurrentMonth(t.getMonth());
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-xs font-mono font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-xs transition-all flex items-center justify-between cursor-pointer",
            className
          )}
        >
          <span className={value ? "text-neutral-900 dark:text-neutral-100 font-semibold" : "text-neutral-400"}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
          <CalendarIcon className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 w-72 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl backdrop-blur-xl text-neutral-900 dark:text-white space-y-3 animate-in fade-in-50 zoom-in-95"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 font-semibold text-xs text-neutral-900 dark:text-white font-sans">
              <span>{MONTH_NAMES[currentMonth]}</span>
              <span className="font-mono text-neutral-400">{currentYear}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-semibold text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/80 pb-1.5">
            {DAYS_OF_WEEK.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
            {daysGrid.map((item, index) => {
              const isCurrentMonth = item.monthOffset === 0;
              const isSelected = item.dateStr === value;
              const isToday = item.dateStr === todayStr;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectDay(item.dateStr)}
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer text-xs font-mono",
                    !isCurrentMonth && "text-neutral-300 dark:text-neutral-600 opacity-40",
                    isCurrentMonth && !isSelected && "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800",
                    isToday && !isSelected && "border border-indigo-500/60 font-bold text-indigo-500 dark:text-indigo-400",
                    isSelected && "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 scale-105"
                  )}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-medium font-sans">
            <button
              type="button"
              onClick={handleClear}
              className="text-neutral-400 hover:text-rose-500 text-[11px] transition-colors"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleToday}
              className="text-indigo-500 hover:text-indigo-400 font-semibold text-[11px] transition-colors"
            >
              Today
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
