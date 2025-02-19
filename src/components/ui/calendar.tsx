
import * as React from "react"
import { DayPicker, type DayPickerProps } from "react-day-picker"
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
  const icons: DayPickerProps["components"] = {
    "node.button.previousMonth": ({ ...props }) => (
      <button
        {...props}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    ),
    "node.button.nextMonth": ({ ...props }) => (
      <button
        {...props}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    ),
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        ...calendarStyles,
        ...classNames,
      }}
      components={icons}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
