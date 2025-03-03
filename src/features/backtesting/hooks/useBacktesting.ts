
import { useBacktestState } from './useBacktestState';
import { useMT4Terminals } from './useMT4Terminals';
import { useProgressListener } from './useProgressListener';
import { useBacktestExecution } from './useBacktestExecution';

export const useBacktesting = () => {
  const backtest = useBacktestState();
  const terminals = useMT4Terminals();
  
  // Configurar listener para progreso
  useProgressListener({
    setProgress: backtest.setProgress,
    setCurrentTask: backtest.setCurrentTask
  });

  // Configurar ejecución de backtest
  const { executeBacktest } = useBacktestExecution({
    ...backtest,
    ...terminals,
    setIsLoading: backtest.setIsLoading,
    setProgress: backtest.setProgress,
    setCurrentTask: backtest.setCurrentTask
  });

  // Función para refrescar terminales
  const handleRefreshTerminals = async () => {
    await terminals.refreshTerminals();
  };

  return {
    ...backtest,
    ...terminals,
    executeBacktest,
    handleRefreshTerminals,
    progress: backtest.progress,
    currentTask: backtest.currentTask
  };
};
