
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DateSelectorProps {
  label: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const DateSelector = ({ label, date, setDate }: DateSelectorProps) => {
  return (
    <div className="w-full max-w-sm p-4 border rounded-lg shadow-lg flex flex-col items-center space-y-4">
      <Label className="text-lg font-semibold text-center">
        {label}: {date ? format(date, "dd/MM/yyyy", { locale: es }) : "Sin seleccionar"}
      </Label>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="w-full rounded-md border"
      />
      <div className="flex gap-2 w-full justify-center">
        <Button variant="outline" onClick={() => setDate(new Date())}>
          Hoy
        </Button>
        <Button variant="outline" onClick={() => setDate(undefined)}>
          Limpiar
        </Button>
      </div>
    </div>
  );
};

export default DateSelector;
