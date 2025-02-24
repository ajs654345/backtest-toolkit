
import React, { useState } from 'react';
import { BacktestForm } from '@/features/backtesting/components/BacktestForm';
import DateSelector from '@/components/DateSelector';

const Index = () => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  return (
    <div className="min-h-screen bg-background/50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateSelector 
          label="Desde"
          date={dateFrom}
          setDate={setDateFrom}
        />
        <DateSelector 
          label="Hasta"
          date={dateTo}
          setDate={setDateTo}
        />
      </div>
      <BacktestForm />
    </div>
  );
};

export default Index;
