"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppleIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0 fill-current opacity-80 group-hover:opacity-100 transition-opacity", className)}
      viewBox="0 0 24 24"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.97.99-3.12-1 .04-2.22.67-2.92 1.49-.62.72-1.16 1.88-1.01 3.01 1.12.09 2.27-.56 2.94-1.38" />
    </svg>
  );
}

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAppleIcon?: boolean;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  className,
  disabled = false,
  showAppleIcon = true,
}: CustomSelectProps) {
  const selectedOption = options.find((o) => o.value === value);

  return (
    <SelectPrimitive.Root value={value} onValueChange={onChange} disabled={disabled}>
      <SelectPrimitive.Trigger
        className={cn(
          "flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-xs font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shadow-sm transition-all cursor-pointer group disabled:opacity-50",
          className
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder}>
          {selectedOption ? (
            <div className="flex items-center gap-2 truncate">
              {selectedOption.icon || (showAppleIcon && <AppleIcon className="w-3.5 h-3.5 text-cyan-400" />)}
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
          className="z-50 min-w-[9rem] overflow-hidden rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl shadow-2xl animate-slide-in p-1.5 space-y-0.5"
          position="popper"
          sideOffset={5}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((opt) => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                className="relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 focus:bg-neutral-100 dark:focus:bg-neutral-800/80 focus:outline-none cursor-pointer font-medium select-none data-[state=checked]:font-semibold data-[state=checked]:bg-cyan-500/10 data-[state=checked]:text-cyan-400 transition-colors group"
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon || (showAppleIcon && <AppleIcon className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />)}
                  <div className="truncate">
                    <div>{opt.label}</div>
                    {opt.sublabel && (
                      <div className="text-[10px] text-neutral-400 font-normal">{opt.sublabel}</div>
                    )}
                  </div>
                </div>
                <SelectPrimitive.ItemIndicator>
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
