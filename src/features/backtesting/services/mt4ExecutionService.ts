
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

      // Enviar el comando a la aplicación de escritorio o simularlo en web
      if (isElectronApp()) {
        sendToElectron('mt4-command', mt4Command);
        
        // Esperar la respuesta de MT4
        const result = await invokeElectron('mt4-result') as MT4Result;
        
        if (result?.error) {
          throw new Error(result.error);
        }
        
        console.log(`Backtesting completado para ${robot} en ${pair}:`, result);
      } else {
        // En entorno web, simulamos el proceso
        console.log(`[Web Simulation] Ejecutando backtesting para ${robot} en ${pair}`);
        
        // Simular progreso
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 500));
          const progressEvent = new CustomEvent('progress-update', {
            detail: {
              progress: i,
              current: Math.floor(i / 100 * 10),
              total: 10,
              robot,
              pair
            }
          });
          window.dispatchEvent(progressEvent);
        }
        
        console.log(`[Web Simulation] Backtesting completado para ${robot} en ${pair}`);
      }
      
    } catch (error) {
      console.error(`Error en backtesting para ${robot} en ${pair}:`, error);
      throw error;
    }
  }

  getDefaultOutputPath(): string {
    if (isElectronApp()) {
      // Como esto devuelve una promesa, usamos un valor por defecto
      invokeElectron('get-documents-path')
        .then(path => {
          console.log('Ruta de documentos obtenida:', path);
          return path;
        })
        .catch(err => {
          console.error('Error al obtener ruta de documentos:', err);
        });
    }
    
    // Devolvemos un valor predeterminado
    return 'C:/MT4_Backtest_Results';
  }
}

export const mt4ExecutionService = new MT4ExecutionService();
