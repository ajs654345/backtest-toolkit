import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateRangeSelectorProps {
  dateFrom: string;
  dateTo: string;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
}

const DateRangeSelector = ({ dateFrom, dateTo, setDateFrom, setDateTo }: DateRangeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="dateFrom">Fecha Inicio</Label>
        <Input
          type="date"
          id="dateFrom"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="mt-1 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <Label htmlFor="dateTo">Fecha Fin</Label>
        <Input
          type="date"
          id="dateTo"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="mt-1 dark:bg-gray-800 dark:text-white"
        />
      </div>
    </div>
  );
};

export default DateRangeSelector;