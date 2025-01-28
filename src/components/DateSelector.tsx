import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateSelectorProps {
  dateFrom: string;
  dateTo: string;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
}

const DateSelector = ({ dateFrom, dateTo, setDateFrom, setDateTo }: DateSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <Label htmlFor="dateFrom">Fecha Desde</Label>
        <Input
          type="date"
          id="dateFrom"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="dateTo">Fecha Hasta</Label>
        <Input
          type="date"
          id="dateTo"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default DateSelector;