
import { MT4Error, withErrorHandling } from "@/utils/errorHandler";
import { logger } from "@/services/logService";
import type { MT4Config } from "@/types/mt4";

export class MT4Service {
  private componentName = 'MT4Service';

  async validateMT4Installation(): Promise<boolean> {
    logger.info('Validando instalación de MT4...', null, this.componentName);
    
    try {
      const isInstalled = await window.electron.ipcRenderer.invoke('check-mt4-installation');
      
      if (!isInstalled) {
        throw new MT4Error(
          'MetaTrader 4 no está instalado o no se encuentra en la ruta esperada',
          null,
          'MT4_NOT_FOUND'
        );
      }

      logger.info('Instalación de MT4 validada correctamente', null, this.componentName);
      return true;
    } catch (error) {
      throw new MT4Error(
        'Error al validar la instalación de MT4',
        { originalError: error },
        'MT4_VALIDATION_ERROR'
      );
    }
  }

  async executeBacktest(config: MT4Config): Promise<void> {
    logger.info('Iniciando proceso de backtesting...', { config }, this.componentName);

    return withErrorHandling(async () => {
      // Validar MT4
      await this.validateMT4Installation();

      // Validar configuración
      this.validateConfig(config);

      logger.debug('Ejecutando backtesting con configuración:', { config }, this.componentName);

      // Ejecutar MT4
      const result = await window.electron.ipcRenderer.invoke('execute-mt4', config);

      if (!result.success) {
        throw new MT4Error(
          'Error durante la ejecución del backtesting',
          { result },
          'MT4_EXECUTION_ERROR'
        );
      }

      logger.info('Backtesting completado exitosamente', { result }, this.componentName);

    }, 'Error en la ejecución del backtesting', this.componentName);
  }

  private validateConfig(config: MT4Config): void {
    logger.debug('Validando configuración...', { config }, this.componentName);

    if (!config.robotPath) {
      throw new MT4Error('Ruta del robot no especificada', { config }, 'INVALID_ROBOT_PATH');
    }

    if (!config.dateFrom || !config.dateTo) {
      throw new MT4Error('Fechas no especificadas', { config }, 'INVALID_DATES');
    }

    const dateFrom = new Date(config.dateFrom);
    const dateTo = new Date(config.dateTo);

    if (dateFrom > dateTo) {
      throw new MT4Error(
        'La fecha de inicio debe ser anterior a la fecha de fin',
        { dateFrom, dateTo },
        'INVALID_DATE_RANGE'
      );
    }

    if (!config.pair) {
      throw new MT4Error('Par de divisas no especificado', { config }, 'INVALID_PAIR');
    }

    if (!config.outputPath) {
      throw new MT4Error('Ruta de salida no especificada', { config }, 'INVALID_OUTPUT_PATH');
    }

    if (!['control', 'tick', 'price'].includes(config.testingMode)) {
      throw new MT4Error(
        'Modo de testing no válido',
        { testingMode: config.testingMode },
        'INVALID_TESTING_MODE'
      );
    }

    logger.debug('Configuración validada correctamente', null, this.componentName);
  }
}

export const mt4Service = new MT4Service();
