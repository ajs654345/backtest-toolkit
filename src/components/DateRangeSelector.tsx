
import React from 'react';
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DateRangeSelectorProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const DateRangeSelector = ({ dateRange, setDateRange }: DateRangeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>
            Desde: {dateRange?.from ? format(dateRange.from, "dd/MM/yyyy", { locale: es }) : "Sin seleccionar"}
          </Label>
          <Label>
            Hasta: {dateRange?.to ? format(dateRange.to, "dd/MM/yyyy", { locale: es }) : "Sin seleccionar"}
          </Label>
          <Calendar
            selected={dateRange}
            onSelect={setDateRange}
            className="rounded-md border"
            mode="range"
            numberOfMonths={2}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;
