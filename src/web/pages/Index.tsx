
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
import { Label } from "@/components/ui/label";
import type { MT4Config } from '@/types/mt4';
import { mt4Service } from '@/services/mt4Service';
import { logger } from '@/services/logService';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  const [testingMode, setTestingMode] = useState<MT4Config['testingMode']>('control');
  const [saveConfig, setSaveConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currencyPairs, setCurrencyPairs] = useState([
    "USDJPY", "GBPNZD", "AUDUSD", "EURJPY", "CHFJPY", "GBPCAD", "CADJPY", "EURUSD",
    "USDCHF", "USDCAD", "EURCAD", "GBPUSD", "GBPAUD", "EURAUD", "AUDJPY", "EURCHF",
    "GBPAUD", "GBPJPY", "NZDJPY", "EURGBP", "USDCAD", "EURNZD", "CADCHF", "AUDCAD",
    "AUDNZD", "GBPCHF", "EURNZD", "AUDCHF", "NZDUSD", "NZDCAD", "NZDCHF"
  ]);

  const validateInputs = (): boolean => {
    logger.debug('Validando inputs...', {
      selectedRobots,
      dateFrom,
      dateTo,
      outputPath,
      testingMode
    }, 'Index');

    if (!dateFrom || !dateTo) {
      logger.warn('Fechas no seleccionadas', null, 'Index');
      toast({
        title: "Error de validación",
        description: "Por favor, seleccione las fechas de inicio y fin",
        variant: "destructive",
      });
      return false;
    }

    if (selectedRobots.length === 0) {
      logger.warn('No se han seleccionado robots', null, 'Index');
      toast({
        title: "Error de validación",
        description: "Por favor, seleccione al menos un robot",
        variant: "destructive",
      });
      return false;
    }

    if (!outputPath) {
      logger.warn('Ruta de salida no especificada', null, 'Index');
      toast({
        title: "Error de validación",
        description: "Por favor, seleccione una ruta de salida",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const executeBacktest = async () => {
    logger.info('Iniciando proceso de backtesting...', null, 'Index');
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

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

      logger.debug('Configuración del backtesting:', command, 'Index');
      
      await mt4Service.executeBacktest(command);

      toast({
        title: "Proceso Completado",
        description: "El backtesting se ha completado exitosamente.",
      });

      if (saveConfig) {
        logger.info('Guardando configuración...', null, 'Index');
        // Aquí iría la lógica para guardar la configuración
      }

    } catch (error) {
      logger.error(
        'Error durante el backtesting',
        { error },
        'Index'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex justify-between items-center mb-4">
        <ThemeToggle />
        <Button
          variant="outline"
          onClick={() => {
            const logs = logger.exportLogs();
            const blob = new Blob([logs], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backtesting-logs-${new Date().toISOString()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          Exportar Logs
        </Button>
      </div>

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
                logger.info('Excel existente seleccionado:', { fileName: file.name }, 'Index');
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

          <Alert variant="info" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Los logs detallados estarán disponibles para su exportación una vez completado el proceso.
            </AlertDescription>
          </Alert>

          <Button 
            className="w-full"
            onClick={executeBacktest}
            disabled={isLoading}
          >
            {isLoading ? "Ejecutando..." : "Ejecutar Backtesting"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;
