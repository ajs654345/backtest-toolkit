import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateRangeSelectorProps {
  dateFrom: Date;
  dateTo: Date;
  setDateFrom: (date: Date) => void;
  setDateTo: (date: Date) => void;
}

const DateRangeSelector = ({ dateFrom, dateTo, setDateFrom, setDateTo }: DateRangeSelectorProps) => {
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setDateFrom(date);
    }
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setDateTo(date);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Desde:</Label>
          <Input
            type="date"
            value={formatDateForInput(dateFrom)}
            onChange={handleDateFromChange}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Hasta:</Label>
          <Input
            type="date"
            value={formatDateForInput(dateTo)}
            onChange={handleDateToChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;