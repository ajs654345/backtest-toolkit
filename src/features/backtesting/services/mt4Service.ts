
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
  success?: boolean;
  message?: string;
}

class MT4Service {
  private async executeForPair(robot: string, pair: string, command: BacktestCommand): Promise<void> {
    try {
      // Obtener la ruta del archivo del robot
      const robotFile = command.robots.find(r => r.name === robot);
      if (!robotFile) {
        throw new Error(`Robot ${robot} no encontrado`);
      }

      // Construir el comando para MT4
      const mt4Command = {
        action: 'backtest',
        robot,
        symbol: pair,
        from: command.dateFrom?.toISOString(),
        to: command.dateTo?.toISOString(),
        mode: command.testingMode,
        outputPath: command.outputPath || this.getDefaultOutputPath()
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

  private getDefaultOutputPath(): string {
    // Obtener la carpeta de documentos del usuario como ruta predeterminada
    return window.electron?.invoke('get-documents-path') || 'C:/MT4_Backtest_Results';
  }

  async executeBacktest(command: BacktestCommand): Promise<void> {
    let hasError = false;
    const totalTasks = command.robots.reduce(
      (acc, robot) => acc + robot.pairs.length, 
      0
    );
    let completedTasks = 0;

    try {
      // Verificar que Electron esté disponible
      if (!window.electron) {
        throw new Error('Esta función requiere la aplicación de escritorio Electron');
      }

      // Verificar la ruta de salida
      if (!command.outputPath) {
        command.outputPath = this.getDefaultOutputPath();
        console.log('Usando ruta de salida predeterminada:', command.outputPath);
      }

      // Crear la carpeta de salida si no existe
      await window.electron.invoke('ensure-directory', { path: command.outputPath });

      // Ejecutar los backtests para cada robot y par
      for (const robot of command.robots) {
        for (const pair of robot.pairs) {
          try {
            await this.executeForPair(robot.name, pair, command);
            completedTasks++;
            
            // Actualizar progreso
            const progress = Math.round((completedTasks / totalTasks) * 100);
            console.log(`Progreso: ${progress}%`);
            
            // Notificar progreso a la interfaz
            window.electron.send('progress-update', { 
              progress, 
              current: completedTasks, 
              total: totalTasks,
              robot: robot.name,
              pair
            });
            
          } catch (error) {
            console.error(`Error en ${robot.name} - ${pair}:`, error);
            hasError = true;
          }
        }
      }

      // Generar Excel con resultados
      if (!hasError) {
        if (command.excelConfig.useExisting) {
          await this.updateExistingExcel(command);
        } else {
          await this.generateNewExcel(command);
        }
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
        resultsPath: command.outputPath,
        robotData: command.robots.map(r => ({
          name: r.name,
          pairs: r.pairs
        }))
      }) as MT4Result;

      if (result?.error) {
        throw new Error(result.error);
      }
      
      console.log('Excel actualizado correctamente:', result);
    } catch (error) {
      console.error('Error actualizando Excel:', error);
      throw error;
    }
  }

  private async generateNewExcel(command: BacktestCommand): Promise<void> {
    try {
      const fileName = command.excelConfig.fileName || `Backtest_Results_${new Date().toISOString().split('T')[0]}`;
      
      const result = await window.electron?.invoke('generate-excel', {
        fileName,
        outputPath: command.outputPath,
        resultsPath: command.outputPath,
        robotData: command.robots.map(r => ({
          name: r.name,
          pairs: r.pairs
        }))
      }) as MT4Result;

      if (result?.error) {
        throw new Error(result.error);
      }
      
      console.log('Excel generado correctamente:', result);
    } catch (error) {
      console.error('Error generando Excel:', error);
      throw error;
    }
  }
  
  // Método para obtener la lista de terminales MT4 instalados
  async getMT4Terminals(): Promise<string[]> {
    try {
      const result = await window.electron?.invoke('get-mt4-terminals') as MT4Result;
      if (result?.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener terminales MT4:', error);
      return [];
    }
  }
}

export const mt4Service = new MT4Service();
