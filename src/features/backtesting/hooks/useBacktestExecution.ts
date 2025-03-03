
import { useToast } from "@/hooks/use-toast";
import { mt4Service } from '../services/mt4Service';

interface UseBacktestExecutionProps {
  selectedRobots: File[];
  dateFrom?: Date;
  dateTo?: Date;
  currencyPairs: string[];
  testingMode: string;
  outputPath: string;
  useExistingExcel: boolean;
  excelName: string;
  useDefaultNaming: boolean;
  existingExcelFile: File | null;
  selectedTerminal: string;
  mt4Terminals: string[];
  saveConfig: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setProgress: (progress: number) => void;
  setCurrentTask: (task: string) => void;
}

export const useBacktestExecution = ({
  selectedRobots,
  dateFrom,
  dateTo,
  currencyPairs,
  testingMode,
  outputPath,
  useExistingExcel,
  excelName,
  useDefaultNaming,
  existingExcelFile,
  selectedTerminal,
  mt4Terminals,
  saveConfig,
  setIsLoading,
  setProgress,
  setCurrentTask
}: UseBacktestExecutionProps) => {
  const { toast } = useToast();

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

  return {
    executeBacktest
  };
};
