
import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { calendarStyles } from "./calendar/calendar-styles"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        ...calendarStyles,
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <button
            onClick={props.onClick}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            )}
            title={props.label}
            disabled={props.disabled}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ),
        IconRight: ({ ...props }) => (
          <button
            onClick={props.onClick}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            )}
            title={props.label}
            disabled={props.disabled}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
