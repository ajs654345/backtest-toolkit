
"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  month,
  onMonthChange,
  ...props
}: CalendarProps) {
  return (
    <div className="w-[300px] mx-auto">
      <DayPicker
        month={month}
        onMonthChange={onMonthChange}
        showOutsideDays={showOutsideDays}
        locale={{ ...es, options: { weekStartsOn: 1 } }}
        className={cn("p-3", className)}
        classNames={{
          months: "flex flex-col space-y-4",
          month: "space-y-4",
          caption: "sr-only",
          table: "w-full border-collapse bg-background",
          head_row: "grid grid-cols-7 w-full",
          head_cell: "text-muted-foreground font-bold text-sm flex items-center justify-center h-10 w-[42px]",
          row: "grid grid-cols-7 w-full",
          cell: "p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-[42px] w-[42px] p-0 font-normal aria-selected:opacity-100",
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            "rounded-none border border-gray-600"
          ),
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 hover:text-white focus:text-white",
          day_today: "bg-gray-700 text-white border border-blue-500",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        {...props}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
