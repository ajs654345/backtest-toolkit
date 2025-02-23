
import React from 'react';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangeSelectorProps {
  dateFrom: string;
  dateTo: string;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
}

const DateRangeSelector = ({ dateFrom, dateTo, setDateFrom, setDateTo }: DateRangeSelectorProps) => {
  const handleDateFromSelect = (date: Date | undefined) => {
    if (date) {
      setDateFrom(format(date, 'yyyy-MM-dd'));
    }
  };

  const handleDateToSelect = (date: Date | undefined) => {
    if (date) {
      setDateTo(format(date, 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label>Fecha Inicio</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${!dateFrom && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(new Date(dateFrom), "d 'de' MMMM yyyy", { locale: es }) : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFrom ? new Date(dateFrom) : undefined}
              onSelect={handleDateFromSelect}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Fecha Fin</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${!dateTo && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(new Date(dateTo), "d 'de' MMMM yyyy", { locale: es }) : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateTo ? new Date(dateTo) : undefined}
              onSelect={handleDateToSelect}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangeSelector;
