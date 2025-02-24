
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateSelectorProps {
  label: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DateSelector = ({ label, date, setDate }: DateSelectorProps) => {
  const fromDate = new Date(1900, 0, 1);
  const toDate = new Date(new Date().getFullYear() + 100, 11, 31);

  const [selectedMonth, setSelectedMonth] = useState(date ? date.getMonth() : new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(date ? date.getFullYear() : new Date().getFullYear());

  const years = Array.from(
    { length: toDate.getFullYear() - fromDate.getFullYear() + 1 },
    (_, i) => fromDate.getFullYear() + i
  );

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);
    const newDate = new Date(newYear, selectedMonth, 1);
    setDate(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newMonth = MONTHS.indexOf(month);
    setSelectedMonth(newMonth);
    const newDate = new Date(selectedYear, newMonth, 1);
    setDate(newDate);
  };

  return (
    <div className="w-full max-w-md p-4 border rounded-lg shadow-lg flex flex-col items-center space-y-4 bg-card">
      <Label className="text-lg font-semibold text-center">
        {label}: {date ? format(date, "dd/MM/yyyy", { locale: es }) : "Sin seleccionar"}
      </Label>

      <div className="flex gap-2 w-full mb-4 items-center justify-between">
        <Select value={MONTHS[selectedMonth]} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-1/2">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-1/2">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) => date < fromDate || date > toDate}
          className="w-[300px] rounded-md border"
          month={new Date(selectedYear, selectedMonth, 1)}
          locale={es}
          showOutsideDays={true}
          fixedWeeks
        />
      </div>

      <div className="flex gap-2 w-full justify-between">
        <Button variant="outline" onClick={() => setDate(new Date())} className="w-1/2">
          Hoy
        </Button>
        <Button variant="outline" onClick={() => setDate(undefined)} className="w-1/2">
          Limpiar
        </Button>
      </div>
    </div>
  );
};

export default DateSelector;
