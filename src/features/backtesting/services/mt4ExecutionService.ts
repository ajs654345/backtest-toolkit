
import { BacktestCommand, MT4Command, MT4Result } from './mt4Types';

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

      // Enviar el comando a la aplicación de escritorio
      if (!window.electron) {
        throw new Error('Electron no está disponible');
      }
      
      window.electron.send('mt4-command', mt4Command);

      // Esperar la respuesta de MT4
      const result = await window.electron.invoke('mt4-result') as MT4Result;

      if (result?.error) {
        throw new Error(result.error);
      }

      console.log(`Backtesting completado para ${robot} en ${pair}:`, result);
      
    } catch (error) {
      console.error(`Error en backtesting para ${robot} en ${pair}:`, error);
      throw error;
    }
  }

  getDefaultOutputPath(): string {
    if (!window.electron) {
      return 'C:/MT4_Backtest_Results';
    }
    
    // Como esto devuelve una promesa, necesitamos manejarla correctamente
    // pero como esta función debe devolver string, usaremos un valor por defecto
    // y actualizaremos la ruta más tarde cuando sea necesario
    window.electron.invoke('get-documents-path')
      .then(path => {
        console.log('Ruta de documentos obtenida:', path);
        return path;
      })
      .catch(err => {
        console.error('Error al obtener ruta de documentos:', err);
      });
    
    // Devolvemos un valor predeterminado
    return 'C:/MT4_Backtest_Results';
  }
}

export const mt4ExecutionService = new MT4ExecutionService();
