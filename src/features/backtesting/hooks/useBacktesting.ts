
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
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [mt4Terminals, setMT4Terminals] = useState<string[]>([]);
  const [selectedTerminal, setSelectedTerminal] = useState<string>('');
  
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
    
    // Cargar terminales MT4
    loadMT4Terminals();
    
    // Configurar listener para actualización de progreso
    if (window.electron) {
      window.electron.on('progress-update', (data: any) => {
        setProgress(data.progress);
        setCurrentTask(`${data.robot} - ${data.pair} (${data.current}/${data.total})`);
      });
    }
  }, []);

  // Cargar terminales MT4 instalados
  const loadMT4Terminals = async () => {
    try {
      if (window.electron) {
        const terminals = await mt4Service.getMT4Terminals();
        setMT4Terminals(terminals);
        if (terminals.length > 0) {
          setSelectedTerminal(terminals[0]);
        }
      }
    } catch (error) {
      console.error('Error al cargar terminales MT4:', error);
    }
  };

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
    
    if (!selectedTerminal && mt4Terminals.length > 0) {
      toast({
        title: "Error",
        description: "Por favor, seleccione un terminal MT4",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setCurrentTask('Iniciando...');

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
        },
        mt4Terminal: selectedTerminal
      };

      // Guardar configuración si está habilitado
      if (saveConfig) {
        localStorage.setItem('backtestConfig', JSON.stringify({
          testingMode,
          outputPath,
          excelConfig: {
            useExisting: useExistingExcel,
            fileName: useDefaultNaming ? '' : excelName
          },
          mt4Terminal: selectedTerminal
        }));
      }

      await mt4Service.executeBacktest(command);
      
      toast({
        title: "Backtesting Completado",
        description: "El proceso de backtesting ha finalizado exitosamente.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error durante el backtesting: " + (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask('');
    }
  };

  // Cargar configuración guardada
  useEffect(() => {
    const savedConfig = localStorage.getItem('backtestConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.testingMode) setTestingMode(config.testingMode);
        if (config.outputPath) setOutputPath(config.outputPath);
        if (config.excelConfig) {
          setUseExistingExcel(config.excelConfig.useExisting);
          setUseDefaultNaming(!config.excelConfig.fileName);
          setExcelName(config.excelConfig.fileName || '');
        }
        if (config.mt4Terminal) setSelectedTerminal(config.mt4Terminal);
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      }
    }
  }, []);

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
    progress,
    currentTask,
    mt4Terminals,
    selectedTerminal,
    setSelectedTerminal,
  };
};
