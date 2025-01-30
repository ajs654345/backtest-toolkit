import robotjs from 'robotjs';
import { createWorker } from 'tesseract.js';
import screenshot from 'screenshot-desktop';
import * as path from 'path';
import * as fs from 'fs';

interface MT4Config {
  robotPath: string;
  dateFrom: string;
  dateTo: string;
  pair: string;
  outputPath: string;
}

// Coordenadas específicas para MT4 en resolución 1920x1080
const MT4_COORDINATES = {
  F7_BUTTON: { x: 0, y: 0 },              // Tecla F7 para abrir constructor
  LOAD_BUTTON: { x: 150, y: 50 },         // Botón "Cargar" en el constructor
  DATE_FROM: { x: 250, y: 150 },          // Campo "Desde"
  DATE_TO: { x: 250, y: 180 },            // Campo "Hasta"
  JUMP_TO: { x: 250, y: 210 },            // Campo "Saltar a"
  PAIR_SELECT: { x: 250, y: 120 },        // Selector de par
  JUMP_BUTTON: { x: 300, y: 400 },        // Botón "Saltar"
  START_BUTTON: { x: 300, y: 450 },       // Botón "Iniciar"
  REPORT_CONTEXT: { x: 600, y: 400 },     // Click derecho para menú contextual
  SAVE_REPORT: { x: 620, y: 420 },        // Opción "Guardar como informe"
  ACCEPT_BUTTON: { x: 700, y: 500 }       // Botón "Aceptar" en el constructor
};

export const executeBacktest = async (config: MT4Config) => {
  try {
    console.log('Iniciando backtesting para:', config);
    
    // 1. Configurar robotjs
    robotjs.setMouseDelay(2);
    robotjs.setKeyboardDelay(100);
    
    // 2. Abrir constructor de estrategias (F7)
    robotjs.keyTap('f7');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. Cargar el robot
    await loadRobot(config.robotPath);
    
    // 4. Configurar parámetros
    await configureBacktest(config);
    
    // 5. Ejecutar backtesting
    await runBacktest();
    
    // 6. Capturar y guardar resultados
    const results = await captureResults();
    await saveReports(config, results);
    
    return results;
  } catch (error) {
    console.error('Error durante el backtesting:', error);
    throw error;
  }
};

const loadRobot = async (robotPath: string) => {
  // Click en "Cargar"
  robotjs.moveMouse(MT4_COORDINATES.LOAD_BUTTON.x, MT4_COORDINATES.LOAD_BUTTON.y);
  robotjs.mouseClick();
  
  // Escribir ruta del robot
  robotjs.typeString(robotPath);
  robotjs.keyTap('enter');
  
  // Esperar y dar click en "Aceptar"
  await new Promise(resolve => setTimeout(resolve, 1000));
  robotjs.moveMouse(MT4_COORDINATES.ACCEPT_BUTTON.x, MT4_COORDINATES.ACCEPT_BUTTON.y);
  robotjs.mouseClick();
};

const configureBacktest = async (config: MT4Config) => {
  // Configurar par de divisas
  robotjs.moveMouse(MT4_COORDINATES.PAIR_SELECT.x, MT4_COORDINATES.PAIR_SELECT.y);
  robotjs.mouseClick();
  robotjs.typeString(config.pair);
  
  // Configurar fechas
  robotjs.moveMouse(MT4_COORDINATES.DATE_FROM.x, MT4_COORDINATES.DATE_FROM.y);
  robotjs.mouseClick();
  robotjs.typeString(config.dateFrom);
  
  robotjs.moveMouse(MT4_COORDINATES.DATE_TO.x, MT4_COORDINATES.DATE_TO.y);
  robotjs.mouseClick();
  robotjs.typeString(config.dateTo);
  
  robotjs.moveMouse(MT4_COORDINATES.JUMP_TO.x, MT4_COORDINATES.JUMP_TO.y);
  robotjs.mouseClick();
  robotjs.typeString(config.dateTo);
  
  // Click en "Saltar"
  robotjs.moveMouse(MT4_COORDINATES.JUMP_BUTTON.x, MT4_COORDINATES.JUMP_BUTTON.y);
  robotjs.mouseClick();
};

const runBacktest = async () => {
  // Click en "Iniciar"
  robotjs.moveMouse(MT4_COORDINATES.START_BUTTON.x, MT4_COORDINATES.START_BUTTON.y);
  robotjs.mouseClick();
  
  // Esperar a que termine el backtesting (ajustar según necesidad)
  await new Promise(resolve => setTimeout(resolve, 5000));
};

const captureResults = async () => {
  // Capturar pantalla
  const image = await screenshot();
  
  // OCR para extraer parámetros
  const worker = await createWorker();
  const { data: { text } } = await worker.recognize(image);
  await worker.terminate();
  
  return {
    parameters: parseOCRText(text),
    screenshot: image
  };
};

const parseOCRText = (text: string) => {
  // Extraer parámetros relevantes del texto OCR
  const params = {
    profit: 0,
    trades: 0,
    winRate: 0
  };
  
  // Implementar lógica de parsing aquí
  // Buscar patrones específicos en el texto para extraer los valores
  
  return params;
};

const saveReports = async (config: MT4Config, results: any) => {
  const baseDir = path.join(config.outputPath, config.pair);
  fs.mkdirSync(baseDir, { recursive: true });
  
  const dateStr = new Date().toISOString().split('T')[0];
  const robotName = path.basename(config.robotPath, '.set');
  
  // Guardar captura de pantalla
  const screenshotPath = path.join(
    baseDir, 
    `${robotName}_${config.pair}_${dateStr}_captura.png`
  );
  fs.writeFileSync(screenshotPath, results.screenshot);
  
  // Guardar informe
  robotjs.moveMouse(MT4_COORDINATES.REPORT_CONTEXT.x, MT4_COORDINATES.REPORT_CONTEXT.y);
  robotjs.mouseClick('right');
  robotjs.moveMouse(MT4_COORDINATES.SAVE_REPORT.x, MT4_COORDINATES.SAVE_REPORT.y);
  robotjs.mouseClick();
  
  // Escribir nombre del archivo
  const reportName = `${robotName}_${config.pair}_${dateStr}_informe`;
  robotjs.typeString(path.join(baseDir, reportName));
  robotjs.keyTap('enter');
};