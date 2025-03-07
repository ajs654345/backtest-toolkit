
import { useState, useEffect } from 'react';

export const useBacktestState = () => {
  const [selectedRobots, setSelectedRobots] = useState<File[]>([]);
  const [currencyPairs, setCurrencyPairs] = useState<string[]>(['EURUSD', 'GBPUSD', 'USDJPY']);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [testingMode, setTestingMode] = useState<string>('Every tick');
  const [outputPath, setOutputPath] = useState<string>('');
  const [useExistingExcel, setUseExistingExcel] = useState<boolean>(false);
  const [excelName, setExcelName] = useState<string>('');
  const [useDefaultNaming, setUseDefaultNaming] = useState<boolean>(true);
  const [existingExcelFile, setExistingExcelFile] = useState<File | null>(null);
  const [saveConfig, setSaveConfig] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTask, setCurrentTask] = useState<string>('');

  // Cargar configuración guardada al iniciar
  useEffect(() => {
    const savedConfig = localStorage.getItem('backtestConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        
        if (config.testingMode) setTestingMode(config.testingMode);
        if (config.outputPath) setOutputPath(config.outputPath);
        
        if (config.excelConfig) {
          setUseExistingExcel(config.excelConfig.useExisting || false);
          if (config.excelConfig.fileName) {
            setExcelName(config.excelConfig.fileName);
            setUseDefaultNaming(false);
          }
        }
      } catch (err) {
        console.error('Error al cargar configuración guardada:', err);
      }
    }
  }, []);

  return {
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
    setIsLoading,
    progress,
    setProgress,
    currentTask,
    setCurrentTask
  };
};
