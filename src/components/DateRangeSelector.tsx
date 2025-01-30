import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DateRangeSelectorProps {
  dateFrom: Date;
  dateTo: Date;
  setDateFrom: (date: Date) => void;
  setDateTo: (date: Date) => void;
}

const DateRangeSelector = ({ dateFrom, dateTo, setDateFrom, setDateTo }: DateRangeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>De: {format(dateFrom, "dd/MM/yyyy", { locale: es })}</Label>
          <Calendar
            mode="single"
            selected={dateFrom}
            onSelect={(date) => date && setDateFrom(date)}
            className="rounded-md border"
            locale={es}
          />
        </div>
        
        <div className="space-y-2">
          <Label>A: {format(dateTo, "dd/MM/yyyy", { locale: es })}</Label>
          <Calendar
            mode="single"
            selected={dateTo}
            onSelect={(date) => date && setDateTo(date)}
            className="rounded-md border"
            locale={es}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;