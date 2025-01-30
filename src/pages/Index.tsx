import React, { useState, Suspense, lazy } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from '@/components/ThemeToggle';
import { Loader2 } from "lucide-react";
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { executeBacktest } from '@/utils/mt4Handler';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [currencyPairs, setCurrencyPairs] = useState([
    "USDJPY", "GBPNZD", "AUDUSD", "EURJPY", "CHFJPY", "GBPCAD", "CADJPY", "EURUSD",
    "USDCHF", "USDCAD", "EURCAD", "GBPUSD", "GBPAUD", "EURAUD", "AUDJPY", "EURCHF",
    "GBPAUD", "GBPJPY", "NZDJPY", "EURGBP", "USDCAD", "EURNZD", "CADCHF", "AUDCAD",
    "AUDNZD", "GBPCHF", "EURNZD", "AUDCHF", "NZDUSD", "NZDCAD", "NZDCHF"
  ]);

  const validateForm = () => {
    if (!dateFrom || !dateTo) {
      toast({
        title: "Error de validación",
        description: "Las fechas son obligatorias",
        variant: "destructive",
      });
      return false;
    }

    if (selectedRobots.length === 0) {
      toast({
        title: "Error de validación",
        description: "Debes seleccionar al menos un robot",
        variant: "destructive",
      });
      return false;
    }

    if (!outputPath) {
      toast({
        title: "Error de validación",
        description: "La ruta de salida es obligatoria",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleBacktest = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      for (const robot of selectedRobots) {
        for (const pair of currencyPairs) {
          toast({
            title: "Procesando",
            description: `Ejecutando backtest para ${robot.name} en ${pair}`,
          });

          const result = await executeBacktest({
            robotPath: robot.name,
            dateFrom,
            dateTo,
            pair,
            outputPath: outputPath || './backtest_results',
            testingMode // Add the testingMode parameter here
          });

          toast({
            title: "Completado",
            description: `Backtest finalizado para ${robot.name} - ${pair}`,
            variant: "default",
          });

          console.log(`Backtest completed for ${robot.name} - ${pair}:`, result);
        }
      }

      toast({
        title: "Proceso Completado",
        description: "Todos los backtests han sido ejecutados exitosamente",
        variant: "default",
      });
    } catch (error) {
      console.error('Error during backtest:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error durante el proceso de backtesting",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <Card className="max-w-5xl mx-auto p-6 animate-fade-in">
        <h1 className="text-2xl font-bold mb-6 text-center">Herramienta de Backtesting MT4</h1>
        
        <Suspense fallback={<LoadingSkeleton />}>
          <div className="space-y-6">
            <DateRangeSelector
              dateFrom={dateFrom}
              dateTo={dateTo}
              setDateFrom={setDateFrom}
              setDateTo={setDateTo}
            />

            <RobotSelector
              selectedRobots={selectedRobots}
              setSelectedRobots={(robots) => {
                setSelectedRobots(robots);
                if (robots.length > 0) {
                  toast({
                    title: "Robots seleccionados",
                    description: `${robots.length} robot(es) cargado(s) correctamente`,
                  });
                }
              }}
            />

            <TestingModeSelector
              testingMode={testingMode}
              setTestingMode={setTestingMode}
            />

            <CurrencyPairsList 
              currencyPairs={currencyPairs}
              onReorder={(newOrder) => {
                setCurrencyPairs(newOrder);
                toast({
                  title: "Orden actualizado",
                  description: "Se ha actualizado el orden de los pares",
                });
              }}
            />

            <ExcelConfig
              useExistingExcel={useExistingExcel}
              setUseExistingExcel={setUseExistingExcel}
              existingExcelFile={existingExcelFile}
              handleExistingExcelChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.name.endsWith('.xlsx')) {
                  setExistingExcelFile(file);
                  toast({
                    title: "Excel seleccionado",
                    description: `Archivo ${file.name} cargado correctamente`,
                  });
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
              className="w-full relative transition-all duration-200 hover:scale-[1.02]"
              onClick={handleBacktest}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Ejecutar Backtesting"
              )}
            </Button>
          </div>
        </Suspense>
      </Card>
    </div>
  );
};

export default Index;