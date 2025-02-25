
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
    <div className="w-full max-w-[300px] mx-auto">
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
          caption: "sr-only", // Oculta el título del mes/año sin afectar estructura
          table: "w-full border-collapse",
          head_row: "grid grid-cols-7 gap-0", // Fuerza 7 días en la fila del encabezado
          head_cell:
            "text-muted-foreground font-bold text-sm flex items-center justify-center h-10 w-full",
          row: "grid grid-cols-7 gap-0", // Fuerza 7 días en cada fila sin espacios
          cell: "flex items-center justify-center h-[42px] w-full border border-gray-600",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-[42px] w-full p-0 font-normal aria-selected:opacity-100",
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            "rounded-md"
          ),
          day_selected:
            "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
          day_today: "bg-gray-700 text-white border border-blue-500",
          day_outside: "opacity-50", // Atenúa los días fuera del mes
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
