
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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

  const currentYear = date ? date.getFullYear() : new Date().getFullYear();
  const currentMonth = date ? date.getMonth() : new Date().getMonth();

  // Generar array de años desde 1900 hasta 100 años en el futuro
  const years = Array.from({ length: toDate.getFullYear() - fromDate.getFullYear() + 1 }, 
    (_, i) => fromDate.getFullYear() + i);

  const handleYearChange = (year: string) => {
    const newDate = date ? new Date(date) : new Date();
    newDate.setFullYear(parseInt(year));
    setDate(newDate);
  };

  const handleYearSliderChange = (value: number[]) => {
    const newDate = date ? new Date(date) : new Date();
    newDate.setFullYear(value[0]);
    setDate(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = date ? new Date(date) : new Date();
    newDate.setMonth(MONTHS.indexOf(month));
    setDate(newDate);
  };

  return (
    <div className="w-full p-4 border rounded-lg shadow-lg flex flex-col items-center space-y-4 bg-card">
      <Label className="text-lg font-semibold text-center">
        {label}: {date ? format(date, "dd/MM/yyyy", { locale: es }) : "Sin seleccionar"}
      </Label>
      <div className="flex gap-2 w-full mb-4">
        <Select value={MONTHS[currentMonth]} onValueChange={handleMonthChange}>
          <SelectTrigger>
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
        <Select value={currentYear.toString()} onValueChange={handleYearChange}>
          <SelectTrigger>
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
      <div className="w-full px-2 space-y-2">
        <Label className="text-sm">Año: {currentYear}</Label>
        <Slider
          value={[currentYear]}
          min={fromDate.getFullYear()}
          max={toDate.getFullYear()}
          step={1}
          onValueChange={handleYearSliderChange}
          className="w-full"
        />
      </div>
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
          month={date || new Date()}
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
