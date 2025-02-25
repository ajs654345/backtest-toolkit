
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
  fromDate,
  toDate,
  ...props
}: CalendarProps) {
  return (
    <div className="w-[294px] mx-auto"> {/* 🔥 Fuerza un ancho divisible por 7 */}
      <DayPicker
        month={month}
        onMonthChange={onMonthChange}
        showOutsideDays={showOutsideDays}
        fromDate={fromDate}
        toDate={toDate}
        locale={{ ...es, options: { weekStartsOn: 1 } }}
        className={cn("p-3", className)}
        classNames={{
          months: "flex flex-col space-y-4",
          month: "space-y-4",
          caption: "sr-only",
          table: "w-full border-collapse",
          head_row: "grid grid-cols-7 w-full", // 📌 7 columnas exactas
          head_cell:
            "text-muted-foreground font-bold text-sm flex items-center justify-center h-10",
          row: "grid grid-cols-7 w-full", // 📌 7 columnas exactas en cada fila
          cell: "flex items-center justify-center h-[42px] w-[42px]", // 🔥 Celdas con tamaño fijo
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-[42px] w-[42px] p-0 font-normal aria-selected:opacity-100",
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            "rounded-md"
          ),
          day_selected:
            "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
          day_today: "bg-gray-700 text-white border border-blue-500",
          day_outside: "opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
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
