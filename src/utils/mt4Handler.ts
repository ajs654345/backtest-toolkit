import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import type { MT4Config } from '../types/mt4';

const MT4_PATH = process.env.MT4_PATH || 'C:\\Program Files (x86)\\MetaTrader 4';
const TERMINAL_EXE = 'terminal.exe';

export const executeBacktest = async (config: MT4Config): Promise<any> => {
  try {
    console.log('Iniciando backtest con configuración:', config);
    
    // Verificar instalación de MT4
    const terminalPath = path.join(MT4_PATH, TERMINAL_EXE);
    if (!fs.existsSync(terminalPath)) {
      throw new Error(`MT4 no encontrado en: ${terminalPath}`);
    }

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
  try {
    const terminalPath = path.join(MT4_PATH, TERMINAL_EXE);
    return fs.existsSync(terminalPath);
  } catch (error) {
    console.error('Error validando instalación de MT4:', error);
    return false;
  }
};

export const getTerminalPath = (): string => {
  return path.join(MT4_PATH, TERMINAL_EXE);
};