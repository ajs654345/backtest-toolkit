
import React, { useState } from 'react';
import { DateRange } from "react-day-picker";
import { BacktestForm } from '@/features/backtesting/components/BacktestForm';
import DateRangeSelector from '@/components/DateRangeSelector';

const Index = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <div className="min-h-screen bg-background/50 p-6">
      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      <BacktestForm />
    </div>
  );
};

export default Index;
