import { BacktestCommand, MT4Result } from './mt4Types';
import { mt4ExecutionService } from './mt4ExecutionService';
import { mt4ExcelService } from './mt4ExcelService';
import { mt4TerminalService } from './mt4TerminalService';
import { invokeElectron, sendToElectron } from '@/lib/electron-utils';

class MT4Service {
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
        command.outputPath = mt4ExecutionService.getDefaultOutputPath();
        console.log('Usando ruta de salida predeterminada:', command.outputPath);
      }

      // Crear la carpeta de salida si no existe
      await invokeElectron('ensure-directory', { path: command.outputPath });

      // Ejecutar los backtests para cada robot y par
      for (const robot of command.robots) {
        for (const pair of robot.pairs) {
          try {
            await mt4ExecutionService.executeForPair(robot.name, pair, command);
            completedTasks++;
            
            // Actualizar progreso
            const progress = Math.round((completedTasks / totalTasks) * 100);
            console.log(`Progreso: ${progress}%`);
            
            // Notificar progreso a la interfaz
            sendToElectron('progress-update', { 
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
          await mt4ExcelService.updateExistingExcel({
            filePath: command.excelConfig.existingFile,
            resultsPath: command.outputPath,
            robotData: command.robots.map(r => ({
              name: r.name,
              pairs: r.pairs
            }))
          });
        } else {
          await mt4ExcelService.generateNewExcel({
            fileName: command.excelConfig.fileName || `Backtest_Results_${new Date().toISOString().split('T')[0]}`,
            outputPath: command.outputPath,
            resultsPath: command.outputPath,
            robotData: command.robots.map(r => ({
              name: r.name,
              pairs: r.pairs
            }))
          });
        }
      }

    } catch (error) {
      console.error('Error en el proceso de backtesting:', error);
      throw error;
    }
  }
  
  // Método para obtener la lista de terminales MT4 instalados
  async getMT4Terminals(): Promise<string[]> {
    return mt4TerminalService.getMT4Terminals();
  }
}

export const mt4Service = new MT4Service();
