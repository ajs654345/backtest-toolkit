
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RobotSelector from './RobotSelector';
import CurrencyPairsList from './CurrencyPairsList';
import TestingModeSelector from './TestingModeSelector';
import ConfigurationOptions from './ConfigurationOptions';
import ExcelConfig from './ExcelConfig';
import MT4TerminalSelector from './MT4TerminalSelector';
import { useBacktesting } from '../hooks/useBacktesting';
import { DatePicker } from "@/components/ui/date-picker";

export function BacktestForm() {
  const {
    selectedRobots,
    setSelectedRobots,
    currencyPairs,
    setCurrencyPairs,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    testingMode,
    setTestingMode,
    outputPath,
    setOutputPath,
    useExistingExcel,
    setUseExistingExcel,
    excelName,
    setExcelName,
    useDefaultNaming,
    setUseDefaultNaming,
    existingExcelFile,
    setExistingExcelFile,
    saveConfig,
    setSaveConfig,
    isLoading,
    progress,
    currentTask,
    mt4Terminals,
    selectedTerminal,
    setSelectedTerminal,
    handleRefreshTerminals,
    executeBacktest
  } = useBacktesting();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">MT4 Backtesting Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="robots" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="robots">Robots</TabsTrigger>
            <TabsTrigger value="pairs">Pares</TabsTrigger>
            <TabsTrigger value="dates">Fechas</TabsTrigger>
            <TabsTrigger value="options">Opciones</TabsTrigger>
            <TabsTrigger value="execution">Ejecución</TabsTrigger>
          </TabsList>
          
          <TabsContent value="robots">
            <RobotSelector 
              selectedRobots={selectedRobots}
              setSelectedRobots={setSelectedRobots}
            />
          </TabsContent>
          
          <TabsContent value="pairs">
            <CurrencyPairsList 
              currencyPairs={currencyPairs}
              setCurrencyPairs={setCurrencyPairs}
            />
          </TabsContent>
          
          <TabsContent value="dates">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Fecha de inicio</h3>
                <DatePicker
                  date={dateFrom}
                  setDate={setDateFrom}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Fecha de fin</h3>
                <DatePicker
                  date={dateTo}
                  setDate={setDateTo}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="options">
            <div className="space-y-6">
              <TestingModeSelector 
                testingMode={testingMode}
                setTestingMode={setTestingMode}
              />
              
              <ConfigurationOptions 
                outputPath={outputPath}
                setOutputPath={setOutputPath}
                saveConfig={saveConfig}
                setSaveConfig={setSaveConfig}
              />
              
              <ExcelConfig 
                useExistingExcel={useExistingExcel}
                setUseExistingExcel={setUseExistingExcel}
                excelName={excelName}
                setExcelName={setExcelName}
                useDefaultNaming={useDefaultNaming}
                setUseDefaultNaming={setUseDefaultNaming}
                existingExcelFile={existingExcelFile}
                setExistingExcelFile={setExistingExcelFile}
                outputPath={outputPath}
                setOutputPath={setOutputPath}
                handleExistingExcelChange={(e) => setExistingExcelFile(e.target.files?.[0] || null)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="execution">
            <div className="space-y-6">
              <MT4TerminalSelector
                mt4Terminals={mt4Terminals}
                selectedTerminal={selectedTerminal}
                setSelectedTerminal={setSelectedTerminal}
                onRefresh={handleRefreshTerminals}
              />
              
              <div className="pt-4">
                <Button 
                  onClick={executeBacktest} 
                  disabled={isLoading} 
                  className="w-full"
                >
                  {isLoading ? "Ejecutando backtesting..." : "Iniciar Backtesting"}
                </Button>
                
                {isLoading && (
                  <div className="mt-4 space-y-2">
                    <Progress value={progress || 0} className="h-2" />
                    <p className="text-sm text-center text-gray-500">{currentTask || "Procesando..."}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
