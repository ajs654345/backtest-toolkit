
import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { CalendarNavigation } from "./calendar/CalendarNavigation"
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
        // usamos aquí el nuevo componente de navegación
        IconLeft: () => null,  // estos componentes son requeridos por DayPicker
        IconRight: () => null, // pero los dejamos vacíos ya que usamos nuestro propio componente
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
