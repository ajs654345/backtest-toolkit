
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateSelectorProps {
  label: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const DateSelector = ({ label, date, setDate }: DateSelectorProps) => {
  const fromDate = new Date(1900, 0, 1);
  const toDate = new Date(new Date().getFullYear() + 100, 11, 31);

  return (
    <div className="w-full p-4 border rounded-lg shadow-lg flex flex-col items-center space-y-4 bg-card">
      <Label className="text-lg font-semibold text-center">
        {label}: {date ? format(date, "dd/MM/yyyy", { locale: es }) : "Sin seleccionar"}
      </Label>
      <div className="w-full">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) => 
            date < fromDate || date > toDate
          }
          className="w-full rounded-md border"
          locale={es}
          showOutsideDays={true}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem] h-10 flex items-center justify-center",
            row: "flex w-full mt-2",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
            day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
          components={{
            IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
            IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
          }}
        />
      </div>
      <div className="flex gap-2 w-full justify-between">
        <Button variant="outline" onClick={() => setDate(new Date())} className="w-full">
          Hoy
        </Button>
        <Button variant="outline" onClick={() => setDate(undefined)} className="w-full">
          Limpiar
        </Button>
      </div>
    </div>
  );
};

export default DateSelector;
