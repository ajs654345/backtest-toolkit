
import { toast } from "@/components/ui/use-toast";
import { executeBacktest as executeBacktestHandler, validateMT4Installation } from "@/utils/mt4Handler";
import type { MT4Config } from '../types/mt4';

export const executeBacktest = async (config: MT4Config) => {
  try {
    // Validar instalación de MT4 primero
    if (!validateMT4Installation()) {
      toast({
        title: "Error",
        description: "MetaTrader 4 no encontrado en la ruta especificada",
        variant: "destructive",
      });
      return;
    }

    console.log('Iniciando backtesting con configuración:', config);
    
    if (!window.electron) {
      toast({
        title: "Error",
        description: "Esta función solo está disponible en la versión de escritorio",
        variant: "destructive",
      });
      return;
    }

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
