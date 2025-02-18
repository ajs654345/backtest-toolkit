
import { toast } from "@/components/ui/use-toast";
import { executeBacktest as executeBacktestHandler, validateMT4Installation } from "@/utils/mt4Handler";
import type { MT4Config } from '../types/mt4';

const isElectron = () => {
  return window && window.electron;
};

export const executeBacktest = async (config: MT4Config) => {
  try {
    console.log('Verificando entorno Electron...');
    
    if (!isElectron()) {
      const error = new Error('Esta función solo está disponible en la versión de escritorio');
      console.error(error);
      toast({
        title: "Error de Entorno",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    console.log('Iniciando servicio de backtesting...');
    console.log('Configuración recibida:', config);

    // Validar instalación de MT4
    try {
      const isValid = await validateMT4Installation();
      console.log('Resultado validación MT4:', isValid);
      
      if (!isValid) {
        throw new Error('MetaTrader 4 no encontrado en la ruta especificada');
      }
    } catch (error) {
      console.error('Error en validación de MT4:', error);
      toast({
        title: "Error de MT4",
        description: error instanceof Error ? error.message : "Error al validar instalación de MT4",
        variant: "destructive",
      });
      return;
    }

    console.log('Enviando comando a Electron...');
    const result = await window.electron.ipcRenderer.invoke('execute-backtest', config);
    console.log('Respuesta de Electron:', result);
    
    if (!result) {
      throw new Error('No se recibió respuesta del proceso de backtest');
    }

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
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido durante el backtesting';
    console.error('Error en executeBacktest:', errorMessage);
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};
