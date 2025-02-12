import * as path from 'path';
import * as fs from 'fs';
import { exec, spawn } from 'child_process';
import { validateConfig } from './validators';
import { MT4Error, withErrorHandling } from './errorHandler';
import { initializeMT4Automation, captureResults } from './mt4Automation';
import type { MT4Config } from '../types/mt4';

const DEFAULT_MT4_PATH = 'C:\\Users\\arodr\\AppData\\Roaming\\Darwinex MT4';

const findMT4Installation = async (): Promise<string> => {
  // Usar la ruta directa que sabemos que funciona
  if (fs.existsSync(path.join(DEFAULT_MT4_PATH, 'terminal.exe'))) {
    console.log('MT4 encontrado en:', DEFAULT_MT4_PATH);
    return DEFAULT_MT4_PATH;
  }

  throw new MT4Error('No se encontró la instalación de MetaTrader 4 en la ruta especificada');
};

export const executeBacktest = async (config: MT4Config): Promise<any> => {
  return withErrorHandling(async () => {
    console.log('Iniciando backtest con configuración:', config);
    
    // Validar configuración
    validateConfig(config);
    
    // Encontrar instalación de MT4
    const mt4Path = await findMT4Installation();
    const terminalPath = path.join(mt4Path, 'terminal.exe');
    
    console.log('Usando MT4 en:', terminalPath);

    // Inicializar automatización
    const automationInitialized = await initializeMT4Automation();
    if (!automationInitialized) {
      throw new MT4Error('No se pudo inicializar la automatización de MT4');
    }

    // Construir argumentos
    const args = [
      `/config:"${config.robotPath}"`,
      `/symbol:${config.pair}`,
      `/fromdate:${config.dateFrom}`,
      `/todate:${config.dateTo}`,
      `/testmodel:${getTestModel(config.testingMode)}`,
      '/shutdown'
    ];

    console.log('Ejecutando MT4 con argumentos:', args);

    return new Promise((resolve, reject) => {
      const mt4Process = spawn(terminalPath, args, {
        windowsHide: false,
        stdio: 'pipe'
      });

      let output = '';

      mt4Process.stdout?.on('data', (data) => {
        const message = data.toString();
        console.log('MT4 output:', message);
        output += message;
      });

      mt4Process.stderr?.on('data', (data) => {
        const error = data.toString();
        console.error('MT4 error:', error);
        output += `ERROR: ${error}\n`;
      });

      mt4Process.on('error', (error) => {
        console.error('Error al iniciar MT4:', error);
        reject(new MT4Error('Error al iniciar MT4', error));
      });

      mt4Process.on('close', async (code) => {
        console.log('MT4 proceso terminado con código:', code);
        if (code === 0) {
          try {
            const screenshotPath = await captureResults(config.outputPath);
            
            resolve({
              success: true,
              output,
              reportPath: path.join(config.outputPath, `${config.pair}_backtest_report.htm`),
              screenshotPath
            });
          } catch (error) {
            reject(new MT4Error('Error al capturar resultados', error));
          }
        } else {
          reject(new MT4Error(`MT4 terminó con código de error: ${code}`, { output }));
        }
      });
    });
  }, 'Error durante la ejecución del backtest');
};

const getTestModel = (mode: MT4Config['testingMode']): number => {
  switch (mode) {
    case 'control': return 0;
    case 'tick': return 1;
    case 'price': return 2;
    default: return 0;
  }
};

export const validateMT4Installation = (): Promise<boolean> => {
  return findMT4Installation()
    .then(() => true)
    .catch(() => false);
};

export const getTerminalPath = async (): Promise<string | null> => {
  try {
    const mt4Path = await findMT4Installation();
    return path.join(mt4Path, 'terminal.exe');
  } catch {
    return null;
  }
};
