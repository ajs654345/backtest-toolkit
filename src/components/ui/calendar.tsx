
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
  ...props
}: CalendarProps) {
  return (
    <div className="w-[300px] mx-auto">
      <DayPicker
        month={month}
        showOutsideDays={showOutsideDays}
        locale={{ ...es, options: { weekStartsOn: 1 } }}
        className={cn("p-3", className)}
        captionLayout="dropdown"
        classNames={{
          months: "flex flex-col space-y-4",
          month: "space-y-4",
          caption: "hidden", // 🚀 🔥 ELIMINA EL TÍTULO "FEBRERO 2025"
          nav: "flex items-center justify-between px-4",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          table: "w-full border-collapse",
          head_row: "grid grid-cols-7",
          head_cell: "text-muted-foreground font-bold text-sm flex items-center justify-center h-10",
          row: "grid grid-cols-7",
          cell: cn(
            "relative text-center text-sm flex items-center justify-center w-[40px] h-[40px] border border-gray-600",
            props.mode === "range" ? "[&:has([aria-selected])]:bg-accent" : ""
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "w-[40px] h-[40px] p-0 font-semibold rounded-md",
            "aria-selected:bg-blue-500 aria-selected:text-white"
          ),
          day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
          day_today: "bg-gray-700 text-white border border-blue-500",
          day_outside: "text-gray-500 opacity-50", // 🚀 🔥 OSCURECE LOS DÍAS QUE NO PERTENECEN AL MES ACTUAL
          day_disabled: "text-gray-500 opacity-50",
          ...classNames,
        }}
        {...props}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
