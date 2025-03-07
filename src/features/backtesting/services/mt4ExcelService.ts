
import { ExcelUpdateParams, ExcelGenerateParams, MT4Result } from './mt4Types';
import { invokeElectron, isElectronApp } from '@/lib/electron-utils';

export class MT4ExcelService {
  async updateExistingExcel(params: ExcelUpdateParams): Promise<void> {
    try {
      if (isElectronApp()) {
        const result = await invokeElectron('update-excel', {
          filePath: params.filePath,
          resultsPath: params.resultsPath,
          robotData: params.robotData
        }) as MT4Result;

        if (result?.error) {
          throw new Error(result.error);
        }
        
        console.log('Excel actualizado correctamente:', result);
      } else {
        // En entorno web, simulamos la actualización
        console.log('[Web Simulation] Actualizando Excel con parámetros:', params);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simular retraso
        console.log('[Web Simulation] Excel actualizado correctamente');
      }
    } catch (error) {
      console.error('Error actualizando Excel:', error);
      throw error;
    }
  }

  async generateNewExcel(params: ExcelGenerateParams): Promise<void> {
    try {
      const fileName = params.fileName || `Backtest_Results_${new Date().toISOString().split('T')[0]}`;
      
      if (isElectronApp()) {
        const result = await invokeElectron('generate-excel', {
          fileName,
          outputPath: params.outputPath,
          resultsPath: params.resultsPath,
          robotData: params.robotData
        }) as MT4Result;

        if (result?.error) {
          throw new Error(result.error);
        }
        
        console.log('Excel generado correctamente:', result);
      } else {
        // En entorno web, simulamos la generación
        console.log('[Web Simulation] Generando Excel con nombre:', fileName);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simular retraso
        console.log('[Web Simulation] Excel generado correctamente en:', params.outputPath);
      }
    } catch (error) {
      console.error('Error generando Excel:', error);
      throw error;
    }
  }
}

export const mt4ExcelService = new MT4ExcelService();
