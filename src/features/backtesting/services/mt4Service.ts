
import { BacktestCommand, MT4Result } from './mt4Types';
import { mt4ExecutionService } from './mt4ExecutionService';
import { mt4ExcelService } from './mt4ExcelService';
import { mt4TerminalService } from './mt4TerminalService';
import { invokeElectron, sendToElectron, isElectronApp } from '@/lib/electron-utils';

class MT4Service {
  async executeBacktest(command: BacktestCommand): Promise<void> {
    let hasError = false;
    const totalTasks = command.robots.reduce(
      (acc, robot) => acc + robot.pairs.length, 
      0
    );
    let completedTasks = 0;

    try {
      // Verificar la ruta de salida
      if (!command.outputPath) {
        command.outputPath = await mt4ExecutionService.getDefaultOutputPath();
        console.log('Usando ruta de salida predeterminada:', command.outputPath);
      }

      // En modo web no necesitamos crear carpetas físicas
      if (isElectronApp()) {
        // Crear la carpeta de salida si no existe
        await invokeElectron('ensure-directory', { path: command.outputPath });
      } else {
        console.log('Web mode: simulando creación de carpeta', command.outputPath);
      }

      // Ejecutar los backtests para cada robot y par
      for (const robot of command.robots) {
        for (const pair of robot.pairs) {
          try {
            if (isElectronApp()) {
              await mt4ExecutionService.executeForPair(robot.name, pair, command);
            } else {
              // En modo web, simulamos el proceso con un retraso
              console.log(`Web mode: simulando backtesting para ${robot.name} en ${pair}`);
              await this.simulateBacktestDelay();
            }
            
            completedTasks++;
            
            // Actualizar progreso
            const progress = Math.round((completedTasks / totalTasks) * 100);
            console.log(`Progreso: ${progress}%`);
            
            // Notificar progreso a la interfaz
            if (isElectronApp()) {
              sendToElectron('progress-update', { 
                progress, 
                current: completedTasks, 
                total: totalTasks,
                robot: robot.name,
                pair
              });
            } else {
              // En modo web, enviamos un evento personalizado para simular el progreso
              const progressEvent = new CustomEvent('backtest-progress', {
                detail: { 
                  progress, 
                  current: completedTasks, 
                  total: totalTasks,
                  robot: robot.name,
                  pair
                }
              });
              window.dispatchEvent(progressEvent);
            }
            
          } catch (error) {
            console.error(`Error en ${robot.name} - ${pair}:`, error);
            hasError = true;
          }
        }
      }

      // Generar Excel con resultados (simulado en web)
      if (!hasError) {
        if (isElectronApp()) {
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
        } else {
          console.log('Web mode: simulando generación de Excel', {
            useExisting: command.excelConfig.useExisting,
            fileName: command.excelConfig.fileName,
            robots: command.robots.map(r => r.name)
          });
          // Simulamos un breve retraso para la generación del Excel
          await this.simulateBacktestDelay(1000);
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
  
  // Método auxiliar para simular retrasos en modo web
  private async simulateBacktestDelay(ms = 2000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mt4Service = new MT4Service();
