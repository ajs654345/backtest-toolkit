
"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { es } from 'date-fns/locale'

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className="w-[300px]">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        locale={{ ...es, options: { weekStartsOn: 1 } }}
        classNames={{
          months: "flex flex-col space-y-4",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "flex items-center justify-between px-2",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          table: "w-full border-collapse",
          head_row: "grid grid-cols-7 gap-0",
          head_cell: "text-muted-foreground rounded-md font-normal text-[0.8rem] flex items-center justify-center h-9",
          row: "grid grid-cols-7 gap-0",
          cell: cn(
            "relative p-0 text-center text-sm flex items-center justify-center w-[40px] h-[40px]",
            props.mode === "range" ? "[&:has([aria-selected])]:bg-accent" : ""
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "w-[40px] h-[40px] p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground mx-auto"
          ),
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
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
