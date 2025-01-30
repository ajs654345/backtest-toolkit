import { toast } from "@/components/ui/use-toast";

interface MT4Config {
  robotPath: string;
  dateFrom: string;
  dateTo: string;
  pair: string;
  outputPath: string;
  testingMode: string;
}

export const executeBacktest = async (config: MT4Config) => {
  try {
    if (!window.electron) {
      toast({
        title: "Error",
        description: "Esta función solo está disponible en la versión de escritorio",
        variant: "destructive",
      });
      return;
    }

    console.log('Iniciando backtesting con configuración:', config);
    
    // Llamada a la API de Electron
    const result = await window.electron.invoke('execute-backtest', config);
    
    if (result.success) {
      toast({
        title: "Éxito",
        description: "Backtesting completado correctamente",
      });
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error durante el backtesting:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Error durante el backtesting",
      variant: "destructive",
    });
    throw error;
  }
};