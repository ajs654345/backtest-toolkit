import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from '@/components/ThemeToggle';
import CurrencyPairsList from '@/components/CurrencyPairsList';
import ExcelConfig from '@/components/ExcelConfig';
import DateRangeSelector from '@/components/DateRangeSelector';
import RobotSelector from '@/components/RobotSelector';
import TestingModeSelector from '@/components/TestingModeSelector';
import ConfigurationOptions from '@/components/ConfigurationOptions';

const Index = () => {
  const { toast } = useToast();
  const [selectedRobots, setSelectedRobots] = useState<File[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [excelName, setExcelName] = useState('');
  const [useExistingExcel, setUseExistingExcel] = useState(false);
  const [existingExcelFile, setExistingExcelFile] = useState<File | null>(null);
  const [useDefaultNaming, setUseDefaultNaming] = useState(true);
  const [testingMode, setTestingMode] = useState('control');
  const [saveConfig, setSaveConfig] = useState(false);
  const [currencyPairs, setCurrencyPairs] = useState([
    "USDJPY", "GBPNZD", "AUDUSD", "EURJPY", "CHFJPY", "GBPCAD", "CADJPY", "EURUSD",
    "USDCHF", "USDCAD", "EURCAD", "GBPUSD", "GBPAUD", "EURAUD", "AUDJPY", "EURCHF",
    "GBPAUD", "GBPJPY", "NZDJPY", "EURGBP", "USDCAD", "EURNZD", "CADCHF", "AUDCAD",
    "AUDNZD", "GBPCHF", "EURNZD", "AUDCHF", "NZDUSD", "NZDCAD", "NZDCHF"
  ]);

  const executeBacktest = async () => {
    if (!dateFrom || !dateTo) {
      toast({
        title: "Error",
        description: "Por favor, seleccione las fechas de inicio y fin",
        variant: "destructive",
      });
      return;
    }

    if (selectedRobots.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, seleccione al menos un robot",
        variant: "destructive",
      });
      return;
    }

    try {
      const command = {
        robots: selectedRobots.map(robot => ({
          name: robot.name,
          pairs: currencyPairs
        })),
        dateFrom,
        dateTo,
        testingMode,
        outputPath,
        excelConfig: {
          useExisting: useExistingExcel,
          fileName: useDefaultNaming ? '' : excelName,
          existingFile: existingExcelFile?.name
        }
      };

      console.log('Comando de ejecución:', command);
      
      toast({
        title: "Backtesting Iniciado",
        description: "Se ha iniciado el proceso de backtesting. Por favor espere...",
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Backtesting Completado",
        description: "El proceso de backtesting ha finalizado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error durante el backtesting",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <ThemeToggle />
      <Card className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Herramienta de Backtesting MT4</h1>
        
        <div className="space-y-6">
          <DateRangeSelector
            dateFrom={dateFrom}
            dateTo={dateTo}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
          />

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
              pairs={currencyPairs}
              onPairsChange={setCurrencyPairs}
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
          >
            Ejecutar Backtesting
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;