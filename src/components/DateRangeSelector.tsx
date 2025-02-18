
import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangeSelectorProps {
  dateFrom: string;
  dateTo: string;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
}

const DateRangeSelector = ({ dateFrom, dateTo, setDateFrom, setDateTo }: DateRangeSelectorProps) => {
  const years = Array.from({ length: 5 }, (_, i) => 2020 + i);
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getMonthNumber = (monthName: string) => {
    const monthIndex = months.indexOf(monthName) + 1;
    return monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
  };

  const formatDate = (year: string, month: string) => {
    return `${year}-${getMonthNumber(month)}-01`;
  };

  const getSelectedMonth = (date: string) => {
    if (!date) return months[0];
    const monthNum = parseInt(date.split('-')[1]) - 1;
    return months[monthNum];
  };

  const getSelectedYear = (date: string) => {
    if (!date) return years[0].toString();
    return date.split('-')[0];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="dateFrom">Fecha Inicio</Label>
        <div className="flex gap-2">
          <Select
            value={getSelectedMonth(dateFrom)}
            onValueChange={(month) => setDateFrom(formatDate(getSelectedYear(dateFrom), month))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={getSelectedYear(dateFrom)}
            onValueChange={(year) => setDateFrom(formatDate(year, getSelectedMonth(dateFrom)))}
          >
            <SelectTrigger className="w-[120px]">
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateTo">Fecha Fin</Label>
        <div className="flex gap-2">
          <Select
            value={getSelectedMonth(dateTo)}
            onValueChange={(month) => setDateTo(formatDate(getSelectedYear(dateTo), month))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={getSelectedYear(dateTo)}
            onValueChange={(year) => setDateTo(formatDate(year, getSelectedMonth(dateTo)))}
          >
            <SelectTrigger className="w-[120px]">
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
      </div>
    </div>
  );
};

export default DateRangeSelector;
