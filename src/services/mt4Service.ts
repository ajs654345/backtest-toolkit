
import { toast } from "@/components/ui/use-toast";
import { executeBacktest as executeBacktestHandler, validateMT4Installation } from "@/utils/mt4Handler";
import type { MT4Config } from '../types/mt4';

export const executeBacktest = async (config: MT4Config) => {
  try {
    console.log('Iniciando servicio de backtesting...');
    
    // Validar que estamos en Electron
    if (!window.electron) {
      console.error('Esta función solo está disponible en la versión de escritorio');
      toast({
        title: "Error",
        description: "Esta función solo está disponible en la versión de escritorio",
        variant: "destructive",
      });
      return;
    }

    // Validar instalación de MT4
    const isValid = await validateMT4Installation();
    console.log('Validación MT4:', isValid);
    
    if (!isValid) {
      console.error('MetaTrader 4 no encontrado');
      toast({
        title: "Error",
        description: "MetaTrader 4 no encontrado en la ruta especificada",
        variant: "destructive",
      });
      return;
    }

    console.log('Enviando configuración a Electron:', config);
    
    // Invocar el proceso de backtest a través de Electron
    const result = await window.electron.invoke('execute-backtest', config);
    console.log('Resultado del backtest:', result);
    
    if (result.success) {
      toast({
        title: "Éxito",
        description: "Backtesting completado correctamente",
      });
      return result.data;
    } else {
      throw new Error(result.error || 'Error desconocido durante el backtesting');
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
