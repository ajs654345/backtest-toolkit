
import { toast } from "@/hooks/use-toast";

interface BacktestCommand {
  dateFrom?: Date;
  dateTo?: Date;
  robots: Array<{
    name: string;
    pairs: string[];
  }>;
  testingMode: string;
  outputPath: string;
  excelConfig: {
    useExisting: boolean;
    fileName: string;
    existingFile?: string;
  };
}

interface MT4Result {
  error?: string;
  data?: any;
}

class MT4Service {
  private async executeForPair(robot: string, pair: string, command: BacktestCommand): Promise<void> {
    try {
      // Construir el comando para MT4
      const mt4Command = {
        action: 'backtest',
        robot,
        symbol: pair,
        from: command.dateFrom?.toISOString(),
        to: command.dateTo?.toISOString(),
        mode: command.testingMode,
        outputPath: command.outputPath
      };

      // Enviar el comando a la aplicación de escritorio
      window.electron?.send('mt4-command', mt4Command);

      // Esperar la respuesta de MT4
      const result = await window.electron?.invoke('mt4-result') as MT4Result;

      if (result?.error) {
        throw new Error(result.error);
      }

      console.log(`Backtesting completado para ${robot} en ${pair}`);
      
    } catch (error) {
      console.error(`Error en backtesting para ${robot} en ${pair}:`, error);
      throw error;
    }
  }

  async executeBacktest(command: BacktestCommand): Promise<void> {
    let hasError = false;
    const totalTasks = command.robots.reduce(
      (acc, robot) => acc + robot.pairs.length, 
      0
    );
    let completedTasks = 0;

    try {
      for (const robot of command.robots) {
        for (const pair of robot.pairs) {
          try {
            await this.executeForPair(robot.name, pair, command);
            completedTasks++;
            
            // Actualizar progreso
            const progress = Math.round((completedTasks / totalTasks) * 100);
            console.log(`Progreso: ${progress}%`);
            
          } catch (error) {
            console.error(`Error en ${robot.name} - ${pair}:`, error);
            hasError = true;
          }
        }
      }

      // Generar Excel con resultados
      if (!hasError && command.excelConfig.useExisting) {
        await this.updateExistingExcel(command);
      } else if (!hasError) {
        await this.generateNewExcel(command);
      }

    } catch (error) {
      console.error('Error en el proceso de backtesting:', error);
      throw error;
    }
  }

  private async updateExistingExcel(command: BacktestCommand): Promise<void> {
    try {
      const result = await window.electron?.invoke('update-excel', {
        filePath: command.excelConfig.existingFile,
        results: 'path/to/results'
      }) as MT4Result;

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error actualizando Excel:', error);
      throw error;
    }
  }

  private async generateNewExcel(command: BacktestCommand): Promise<void> {
    try {
      const result = await window.electron?.invoke('generate-excel', {
        fileName: command.excelConfig.fileName,
        outputPath: command.outputPath,
        results: 'path/to/results'
      }) as MT4Result;

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error generando Excel:', error);
      throw error;
    }
  }
}

export const mt4Service = new MT4Service();
