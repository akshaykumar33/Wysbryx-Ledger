"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  className,
  disabled = false,
}: CustomSelectProps) {
  const selectedOption = options.find((o) => o.value === value);

  return (
    <SelectPrimitive.Root value={value} onValueChange={onChange} disabled={disabled}>
      <SelectPrimitive.Trigger
        className={cn(
          "flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-xs font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all cursor-pointer group disabled:opacity-50",
          className
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder}>
          {selectedOption ? (
            <div className="flex items-center gap-2 truncate">
              {selectedOption.icon}
              <span className="truncate">{selectedOption.label}</span>
            </div>
          ) : (
            <span className="text-neutral-400">{placeholder}</span>
          )}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="z-50 min-w-[8rem] overflow-hidden rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl shadow-2xl animate-slide-in p-1.5 space-y-0.5"
          position="popper"
          sideOffset={5}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((opt) => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                className="relative flex items-center justify-between px-3 py-2 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 focus:bg-neutral-100 dark:focus:bg-neutral-800/80 focus:outline-none cursor-pointer font-medium select-none data-[state=checked]:font-semibold data-[state=checked]:bg-indigo-500/10 data-[state=checked]:text-indigo-500"
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon}
                  <div className="truncate">
                    <div>{opt.label}</div>
                    {opt.sublabel && (
                      <div className="text-[10px] text-neutral-400 font-normal">{opt.sublabel}</div>
                    )}
                  </div>
                </div>
                <SelectPrimitive.ItemIndicator>
                  <Check className="w-3.5 h-3.5 text-indigo-500" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
