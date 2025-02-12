
import * as path from 'path';
import * as fs from 'fs';
import { exec, spawn } from 'child_process';
import { validateConfig } from './validators';
import { MT4Error, withErrorHandling } from './errorHandler';
import type { MT4Config } from '../types/mt4';

const DEFAULT_MT4_PATH = 'C:\\Users\\arodr\\AppData\\Roaming\\Darwinex MT4';

const findMT4Installation = async (): Promise<string> => {
  const terminalPath = path.join(DEFAULT_MT4_PATH, 'terminal.exe');
  console.log('Buscando MT4 en:', terminalPath);
  
  try {
    const stats = fs.statSync(terminalPath);
    console.log('MT4 encontrado:', stats);
    return DEFAULT_MT4_PATH;
  } catch (error) {
    console.error('Error al buscar MT4:', error);
    throw new MT4Error(`No se encontró la instalación de MetaTrader 4 en: ${terminalPath}`);
  }
};

const startMT4Process = async (terminalPath: string, args: string[], outputPath: string, pair: string): Promise<any> => {
  console.log('Intentando iniciar MT4 con:', { terminalPath, args });

  return new Promise((resolve, reject) => {
    // Primero intentamos ejecutar directamente
    try {
      const mt4Process = spawn(terminalPath, args, {
        windowsHide: false,
        stdio: 'pipe',
        shell: true // Añadido para mejor soporte en Windows
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
        
        // Si falla el spawn, intentamos con exec como fallback
        exec(`"${terminalPath}" ${args.join(' ')}`, (execError, stdout, stderr) => {
          if (execError) {
            console.error('Error también con exec:', execError);
            reject(new MT4Error('Error al iniciar MT4', { error: execError, output: stderr }));
            return;
          }
          console.log('MT4 iniciado con exec:', stdout);
          resolve({ success: true, output: stdout });
        });
      });

      mt4Process.on('close', async (code) => {
        console.log('MT4 proceso terminado con código:', code);
        if (code === 0) {
          resolve({
            success: true,
            output,
            reportPath: path.join(outputPath, `${pair}_backtest_report.htm`)
          });
        } else {
          reject(new MT4Error(`MT4 terminó con código de error: ${code}`, { output }));
        }
      });

    } catch (error) {
      console.error('Error en spawn:', error);
      reject(new MT4Error('Error al iniciar proceso de MT4', error));
    }
  });
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

    return await startMT4Process(terminalPath, args, config.outputPath, config.pair);
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

export const validateMT4Installation = async (): Promise<boolean> => {
  try {
    const mt4Path = await findMT4Installation();
    const terminalPath = path.join(mt4Path, 'terminal.exe');
    return fs.existsSync(terminalPath);
  } catch (error) {
    console.error('Error al validar instalación de MT4:', error);
    return false;
  }
};

export const getTerminalPath = async (): Promise<string | null> => {
  try {
    const mt4Path = await findMT4Installation();
    return path.join(mt4Path, 'terminal.exe');
  } catch (error) {
    console.error('Error al obtener ruta del terminal:', error);
    return null;
  }
};
