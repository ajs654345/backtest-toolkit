import React from "react";
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

  const currentYear = date ? date.getFullYear() : new Date().getFullYear();
  const currentMonth = date ? date.getMonth() : new Date().getMonth();

  const years = Array.from(
    { length: toDate.getFullYear() - fromDate.getFullYear() + 1 },
    (_, i) => fromDate.getFullYear() + i
  );

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year, 10);
    const newDate = new Date(date ?? new Date());
    newDate.setFullYear(newYear);
    setDate(new Date(newDate)); // Forzar actualización
  };

  const handleMonthChange = (month: string) => {
    const newMonth = MONTHS.indexOf(month);
    const newDate = new Date(date ?? new Date());
    newDate.setMonth(newMonth);
    setDate(new Date(newDate)); // Forzar actualización
  };

  return (
    <div className="w-full max-w-md p-4 border rounded-lg shadow-lg flex flex-col items-center space-y-4 bg-card">
      <Label className="text-lg font-semibold text-center">
        {label}: {date ? format(date, "dd/MM/yyyy", { locale: es }) : "Sin seleccionar"}
      </Label>

      <div className="flex gap-2 w-full mb-4 items-center justify-between">
        <Select value={MONTHS[currentMonth]} onValueChange={handleMonthChange}>
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

        <Select value={currentYear.toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-1/2">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-4 py-2 space-y-2">
              <Label className="text-sm">Año: {currentYear}</Label>
              <Slider
                value={[currentYear]}
                min={fromDate.getFullYear()}
                max={toDate.getFullYear()}
                step={1}
                onValueChange={(value) => handleYearChange(value[0].toString())}
                className="w-full"
              />
            </div>
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
          locale={es}
          showOutsideDays={true}
          fixedWeeks
          classNames={{
            months: "flex flex-col space-y-4",
            month: "space-y-4",
            caption: "flex justify-between items-center px-4 py-2 text-lg font-semibold",
            caption_label: "text-lg font-semibold text-center w-full",
            nav: "flex items-center justify-between px-4",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            table: "w-full border-collapse",
            head_row: "grid grid-cols-7",
            head_cell: "text-muted-foreground font-bold text-sm flex items-center justify-center h-10",
            row: "grid grid-cols-7",
            cell: "relative text-center text-sm flex items-center justify-center w-[40px] h-[40px] border border-gray-600",
            day: "w-[40px] h-[40px] p-0 font-semibold rounded-md aria-selected:bg-blue-500 aria-selected:text-white",
            day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
            day_today: "bg-gray-700 text-white border border-blue-500",
            day_outside: "text-gray-400 opacity-50",
            day_disabled: "text-gray-500 opacity-50",
          }}
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
