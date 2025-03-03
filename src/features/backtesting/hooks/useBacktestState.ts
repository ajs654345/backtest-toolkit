
import { useState, useEffect } from 'react';

export const useBacktestState = () => {
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
    setIsLoading,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    currencyPairs,
    setCurrencyPairs,
    progress,
    setProgress,
    currentTask, 
    setCurrentTask
  };
};
