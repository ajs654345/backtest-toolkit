
import React from "react";
import { BacktestForm } from "@/features/backtesting/components/BacktestForm";
import DateSelector from "@/components/DateSelector";
import { useBacktesting } from "@/features/backtesting/hooks/useBacktesting";

const Index = () => {
  const {
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo
  } = useBacktesting();

  return (
    <div className="min-h-screen bg-background/50 p-6 flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
        <DateSelector label="Desde" date={dateFrom} setDate={setDateFrom} />
        <DateSelector label="Hasta" date={dateTo} setDate={setDateTo} />
      </div>
      <div className="mt-6 w-full max-w-4xl mx-auto">
        <BacktestForm />
      </div>
    </div>
  );
};

export default Index;
