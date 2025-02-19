
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
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => 1970 + i);
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const getMonthNumber = (monthName: string) => {
    const monthIndex = months.indexOf(monthName) + 1;
    return monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
  };

  const formatDate = (year: string, month: string, day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    return `${year}-${getMonthNumber(month)}-${formattedDay}`;
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

  const getSelectedDay = (date: string) => {
    if (!date) return 1;
    return parseInt(date.split('-')[2]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="dateFrom">Fecha Inicio</Label>
        <div className="flex gap-2">
          <Select
            value={getSelectedDay(dateFrom).toString()}
            onValueChange={(day) => setDateFrom(formatDate(
              getSelectedYear(dateFrom),
              getSelectedMonth(dateFrom),
              parseInt(day)
            ))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Día" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={getSelectedMonth(dateFrom)}
            onValueChange={(month) => setDateFrom(formatDate(
              getSelectedYear(dateFrom),
              month,
              getSelectedDay(dateFrom)
            ))}
          >
            <SelectTrigger className="w-[140px]">
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
            onValueChange={(year) => setDateFrom(formatDate(
              year,
              getSelectedMonth(dateFrom),
              getSelectedDay(dateFrom)
            ))}
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
            value={getSelectedDay(dateTo).toString()}
            onValueChange={(day) => setDateTo(formatDate(
              getSelectedYear(dateTo),
              getSelectedMonth(dateTo),
              parseInt(day)
            ))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Día" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={getSelectedMonth(dateTo)}
            onValueChange={(month) => setDateTo(formatDate(
              getSelectedYear(dateTo),
              month,
              getSelectedDay(dateTo)
            ))}
          >
            <SelectTrigger className="w-[140px]">
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
            onValueChange={(year) => setDateTo(formatDate(
              year,
              getSelectedMonth(dateTo),
              getSelectedDay(dateTo)
            ))}
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
