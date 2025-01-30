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
      <div className="space-y-2">
        <Label htmlFor="dateFrom">Fecha Inicio</Label>
        <Input
          type="date"
          id="dateFrom"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateTo">Fecha Fin</Label>
        <Input
          type="date"
          id="dateTo"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default DateRangeSelector;