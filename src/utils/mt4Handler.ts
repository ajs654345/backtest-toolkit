import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import type { MT4Config } from '../types/mt4';

const DEFAULT_MT4_PATHS = [
  'C:\\Program Files (x86)\\MetaTrader 4',
  'C:\\Users\\arodr\\AppData\\Roaming\\MetaQuotes\\Terminal',
  'C:\\Users\\arodr\\AppData\\Roaming\\Darwinex MT4'
];

const findMT4Installation = (): string | null => {
  // First check environment variable
  if (process.env.MT4_PATH && fs.existsSync(path.join(process.env.MT4_PATH, 'terminal.exe'))) {
    return process.env.MT4_PATH;
  }

  // Then check default paths
  for (const mt4Path of DEFAULT_MT4_PATHS) {
    if (fs.existsSync(path.join(mt4Path, 'terminal.exe'))) {
      return mt4Path;
    }
  }

  return null;
};

export const executeBacktest = async (config: MT4Config): Promise<any> => {
  try {
    console.log('Iniciando backtest con configuración:', config);
    
    // Find MT4 installation
    const mt4Path = findMT4Installation();
    if (!mt4Path) {
      throw new Error('No se encontró ninguna instalación válida de MetaTrader 4');
    }

    const terminalPath = path.join(mt4Path, 'terminal.exe');
    console.log('Usando MT4 en:', terminalPath);

    // Verificar archivo del robot
    const robotPath = path.resolve(config.robotPath);
    if (!fs.existsSync(robotPath)) {
      throw new Error(`Robot no encontrado en: ${robotPath}`);
    }

    // Crear directorio de salida si no existe
    if (!fs.existsSync(config.outputPath)) {
      fs.mkdirSync(config.outputPath, { recursive: true });
    }

    // Construir comando para MT4
    const command = [
      `"${terminalPath}"`,
      `/config:"${config.robotPath}"`,
      `/symbol:${config.pair}`,
      `/fromdate:${config.dateFrom}`,
      `/todate:${config.dateTo}`,
      `/testmodel:${getTestModel(config.testingMode)}`,
      '/shutdown'
    ].join(' ');

    console.log('Ejecutando comando:', command);

    // Ejecutar MT4
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error ejecutando MT4:', error);
          reject(error);
          return;
        }
        
        console.log('Salida de MT4:', stdout);
        if (stderr) console.error('Errores de MT4:', stderr);
        
        resolve({
          success: true,
          output: stdout,
          reportPath: path.join(config.outputPath, `${config.pair}_backtest_report.htm`)
        });
      });
    });
  } catch (error) {
    console.error('Error durante el backtest:', error);
    throw error;
  }
};

const getTestModel = (mode: MT4Config['testingMode']): number => {
  switch (mode) {
    case 'control': return 0;
    case 'tick': return 1;
    case 'price': return 2;
    default: return 0;
  }
};

export const validateMT4Installation = (): boolean => {
  return findMT4Installation() !== null;
};

export const getTerminalPath = (): string | null => {
  const mt4Path = findMT4Installation();
  return mt4Path ? path.join(mt4Path, 'terminal.exe') : null;
};