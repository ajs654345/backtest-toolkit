
import fs from 'fs';
import path from 'path';
import type { MT4Config } from '../types/mt4';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateRobotFile = (filePath: string): boolean => {
  if (!filePath) {
    throw new ValidationError('La ruta del robot es requerida');
  }

  if (!filePath.toLowerCase().endsWith('.set')) {
    throw new ValidationError('El archivo del robot debe tener extensión .set');
  }

  if (!fs.existsSync(filePath)) {
    throw new ValidationError(`El archivo del robot no existe en: ${filePath}`);
  }

  return true;
};

export const validateDateRange = (dateFrom: string, dateTo: string): boolean => {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  if (isNaN(from.getTime())) {
    throw new ValidationError('La fecha de inicio no es válida');
  }

  if (isNaN(to.getTime())) {
    throw new ValidationError('La fecha de fin no es válida');
  }

  if (from > to) {
    throw new ValidationError('La fecha de inicio debe ser anterior a la fecha de fin');
  }

  return true;
};

export const validateOutputPath = (outputPath: string): boolean => {
  if (!outputPath) {
    throw new ValidationError('La ruta de salida es requerida');
  }

  try {
    // Intentar crear el directorio si no existe
    fs.mkdirSync(outputPath, { recursive: true });
    return true;
  } catch (error) {
    throw new ValidationError(`No se pudo crear el directorio de salida: ${error.message}`);
  }
};

export const validateConfig = (config: MT4Config): boolean => {
  validateRobotFile(config.robotPath);
  validateDateRange(config.dateFrom, config.dateTo);
  validateOutputPath(config.outputPath);
  
  if (!config.pair) {
    throw new ValidationError('El par de divisas es requerido');
  }

  return true;
};
