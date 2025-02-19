
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
        Navigation: ({ onPreviousClick, onNextClick, ...navigationProps }) => (
          <div className="space-x-1 flex items-center">
            <button
              onClick={onPreviousClick}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              )}
              title={navigationProps.previousLabel}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={onNextClick}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              )}
              title={navigationProps.nextLabel}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
