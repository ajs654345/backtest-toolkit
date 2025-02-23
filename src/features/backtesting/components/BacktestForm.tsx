
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBacktesting } from "../hooks/useBacktesting";
import RobotSelector from './RobotSelector';
import TestingModeSelector from './TestingModeSelector';
import CurrencyPairsList from './CurrencyPairsList';
import ExcelConfig from './ExcelConfig';
import ConfigurationOptions from './ConfigurationOptions';
import { Label } from "@/components/ui/label";

export const BacktestForm = () => {
  const {
    selectedRobots,
    setSelectedRobots,
    testingMode,
    setTestingMode,
    currencyPairs,
    setCurrencyPairs,
    useExistingExcel,
    setUseExistingExcel,
    existingExcelFile,
    setExistingExcelFile,
    useDefaultNaming,
    setUseDefaultNaming,
    excelName,
    setExcelName,
    outputPath,
    setOutputPath,
    saveConfig,
    setSaveConfig,
    isLoading,
    executeBacktest,
  } = useBacktesting();

  return (
    <Card className="max-w-5xl mx-auto p-6 glass-card">
      <h1 className="text-2xl font-bold mb-6 text-center">Herramienta de Backtesting MT4</h1>
      
      <div className="space-y-6">
        <RobotSelector
          selectedRobots={selectedRobots}
          setSelectedRobots={setSelectedRobots}
        />

        <TestingModeSelector
          testingMode={testingMode}
          setTestingMode={setTestingMode}
        />

        <div>
          <Label className="text-center block mb-4">Pares de Divisas (Arrastrar para reordenar)</Label>
          <CurrencyPairsList 
            currencyPairs={currencyPairs}
            onReorder={setCurrencyPairs}
          />
        </div>

        <ExcelConfig
          useExistingExcel={useExistingExcel}
          setUseExistingExcel={setUseExistingExcel}
          existingExcelFile={existingExcelFile}
          handleExistingExcelChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.name.endsWith('.xlsx')) {
              setExistingExcelFile(file);
            }
          }}
          useDefaultNaming={useDefaultNaming}
          setUseDefaultNaming={setUseDefaultNaming}
          excelName={excelName}
          setExcelName={setExcelName}
          outputPath={outputPath}
          setOutputPath={setOutputPath}
        />

        <ConfigurationOptions
          saveConfig={saveConfig}
          setSaveConfig={setSaveConfig}
        />

        <Button 
          className="w-full"
          onClick={executeBacktest}
          disabled={isLoading}
        >
          {isLoading ? "Ejecutando..." : "Ejecutar Backtesting"}
        </Button>
      </div>
    </Card>
  );
};
