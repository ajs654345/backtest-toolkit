
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBacktesting } from "../hooks/useBacktesting";
import RobotSelector from './RobotSelector';
import TestingModeSelector from './TestingModeSelector';
import CurrencyPairsList from './CurrencyPairsList';
import ExcelConfig from './ExcelConfig';
import ConfigurationOptions from './ConfigurationOptions';
import MT4TerminalSelector from './MT4TerminalSelector';
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useElectron } from "@/contexts/ElectronContext";

export const BacktestForm = () => {
  const { toast } = useToast();
  const { isElectron } = useElectron();
  
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
    progress,
    currentTask,
    mt4Terminals,
    selectedTerminal,
    setSelectedTerminal,
    handleRefreshTerminals
  } = useBacktesting();

  useEffect(() => {
    if (!isElectron) {
      console.warn("Running in browser mode - Electron features will be unavailable");
    }
  }, [isElectron]);

  const handleExecuteBacktest = async () => {
    try {
      await executeBacktest();
    } catch (error) {
      console.error("Error executing backtest:", error);
      toast({
        title: "Backtest Error",
        description: "An error occurred while running the backtest. Check the console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-5xl mx-auto p-6 glass-card">
      <h1 className="text-2xl font-bold mb-6 text-center">MT4 Backtesting Tool</h1>
      
      <div className="space-y-6">
        {!isElectron && (
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md p-3 mb-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              This application requires Electron to function properly. You are currently running in browser mode where some features will be unavailable.
            </p>
          </div>
        )}

        <RobotSelector
          selectedRobots={selectedRobots}
          setSelectedRobots={setSelectedRobots}
        />

        <MT4TerminalSelector
          mt4Terminals={mt4Terminals}
          selectedTerminal={selectedTerminal}
          setSelectedTerminal={setSelectedTerminal}
          onRefresh={handleRefreshTerminals}
        />

        <TestingModeSelector
          testingMode={testingMode}
          setTestingMode={setTestingMode}
        />

        <div>
          <Label className="text-center block mb-4">Currency Pairs (Drag to reorder)</Label>
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

        {isLoading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center">{currentTask}</p>
          </div>
        )}

        <Button 
          className="w-full"
          onClick={handleExecuteBacktest}
          disabled={isLoading || !isElectron}
        >
          {isLoading ? "Running..." : "Run Backtest"}
        </Button>
      </div>
    </Card>
  );
};
