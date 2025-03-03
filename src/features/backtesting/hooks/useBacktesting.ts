
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { mt4Service } from '../services/mt4Service';

export const useBacktesting = () => {
  const { toast } = useToast();
  const [selectedRobots, setSelectedRobots] = useState<File[]>([]);
  const [outputPath, setOutputPath] = useState('');
  const [excelName, setExcelName] = useState('');
  const [useExistingExcel, setUseExistingExcel] = useState(false);
  const [existingExcelFile, setExistingExcelFile] = useState<File | null>(null);
  const [useDefaultNaming, setUseDefaultNaming] = useState(true);
  const [testingMode, setTestingMode] = useState('control');
  const [saveConfig, setSaveConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Establecer fechas por defecto
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const [dateFrom, setDateFrom] = useState<Date | undefined>(firstDayOfMonth);
  const [dateTo, setDateTo] = useState<Date | undefined>(lastDayOfMonth);
  
  // Eliminar duplicados y ordenar alfabéticamente
  const [currencyPairs, setCurrencyPairs] = useState([
    "AUDCAD", "AUDCHF", "AUDJPY", "AUDNZD", "AUDUSD", 
    "CADCHF", "CADJPY", 
    "CHFJPY", 
    "EURAUD", "EURCAD", "EURCHF", "EURGBP", "EURJPY", "EURNZD", "EURUSD",
    "GBPAUD", "GBPCAD", "GBPCHF", "GBPJPY", "GBPNZD", "GBPUSD",
    "NZDCAD", "NZDCHF", "NZDJPY", "NZDUSD",
    "USDCAD", "USDCHF", "USDJPY"
  ]);
  
  // Guardar las fechas en localStorage para persistirlas
  useEffect(() => {
    if (dateFrom) {
      localStorage.setItem('backtestDateFrom', dateFrom.toISOString());
    }
    if (dateTo) {
      localStorage.setItem('backtestDateTo', dateTo.toISOString());
    }
  }, [dateFrom, dateTo]);
  
  // Cargar fechas guardadas al iniciar
  useEffect(() => {
    const savedDateFrom = localStorage.getItem('backtestDateFrom');
    const savedDateTo = localStorage.getItem('backtestDateTo');
    
    if (savedDateFrom) {
      setDateFrom(new Date(savedDateFrom));
    }
    if (savedDateTo) {
      setDateTo(new Date(savedDateTo));
    }
  }, []);

  const executeBacktest = async () => {
    if (selectedRobots.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, seleccione al menos un robot",
        variant: "destructive",
      });
      return;
    }

    if (!dateFrom || !dateTo) {
      toast({
        title: "Error",
        description: "Por favor, seleccione las fechas de inicio y fin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const command = {
        dateFrom,
        dateTo,
        robots: selectedRobots.map(robot => ({
          name: robot.name,
          pairs: currencyPairs
        })),
        testingMode,
        outputPath,
        excelConfig: {
          useExisting: useExistingExcel,
          fileName: useDefaultNaming ? '' : excelName,
          existingFile: existingExcelFile?.name
        }
      };

      await mt4Service.executeBacktest(command);
      
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
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedRobots,
    setSelectedRobots,
    outputPath,
    setOutputPath,
    excelName,
    setExcelName,
    useExistingExcel,
    setUseExistingExcel,
    existingExcelFile,
    setExistingExcelFile,
    useDefaultNaming,
    setUseDefaultNaming,
    testingMode,
    setTestingMode,
    saveConfig,
    setSaveConfig,
    isLoading,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    currencyPairs,
    setCurrencyPairs,
    executeBacktest,
  };
};
