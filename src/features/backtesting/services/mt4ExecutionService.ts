
import { BacktestCommand, MT4Command, MT4Result } from './mt4Types';
import { sendToElectron, invokeElectron, isElectronApp } from '@/lib/electron-utils';

export class MT4ExecutionService {
  async executeForPair(robot: string, pair: string, command: BacktestCommand): Promise<void> {
    try {
      // Obtener la ruta del archivo del robot
      const robotFile = command.robots.find(r => r.name === robot);
      if (!robotFile) {
        throw new Error(`Robot ${robot} no encontrado`);
      }

      // Construir el comando para MT4
      const mt4Command: MT4Command = {
        action: 'backtest',
        robot,
        symbol: pair,
        from: command.dateFrom?.toISOString(),
        to: command.dateTo?.toISOString(),
        mode: command.testingMode,
        outputPath: command.outputPath || this.getDefaultOutputPath(),
        terminal: command.mt4Terminal
      };

      console.log(`Enviando comando para ${robot} en par ${pair}:`, mt4Command);

      // Si estamos en modo web, simulamos el backtesting
      if (!isElectronApp()) {
        console.log('Web mode: simulando backtesting para', robot, 'en', pair);
        
        // Simulamos un pequeño retraso para dar la sensación de procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simular progreso (esto será manejado por la interfaz)
        return;
      }
      
      // Enviar el comando a la aplicación de escritorio
      sendToElectron('mt4-command', mt4Command);

      // Esperar la respuesta de MT4
      const result = await invokeElectron('mt4-result') as MT4Result;

      if (result?.error) {
        throw new Error(result.error);
      }

      console.log(`Backtesting completado para ${robot} en ${pair}:`, result);
      
    } catch (error) {
      console.error(`Error en backtesting para ${robot} en ${pair}:`, error);
      throw error;
    }
  }

  async getDefaultOutputPath(): Promise<string> {
    if (!isElectronApp()) {
      return 'C:/MT4_Backtest_Results';
    }
    
    try {
      const path = await invokeElectron('get-documents-path');
      console.log('Ruta de documentos obtenida:', path);
      return path || 'C:/MT4_Backtest_Results';
    } catch (err) {
      console.error('Error al obtener ruta de documentos:', err);
      return 'C:/MT4_Backtest_Results';
    }
  }
}

export const mt4ExecutionService = new MT4ExecutionService();
