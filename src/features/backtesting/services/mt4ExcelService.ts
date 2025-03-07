
import { ExcelUpdateParams, ExcelGenerateParams, MT4Result } from './mt4Types';

export class MT4ExcelService {
  async updateExistingExcel(params: ExcelUpdateParams): Promise<void> {
    try {
      if (!window.electron) {
        throw new Error('Electron no está disponible');
      }
      
      const result = await window.electron.invoke('update-excel', {
        filePath: params.filePath,
        resultsPath: params.resultsPath,
        robotData: params.robotData
      }) as MT4Result;

      if (result?.error) {
        throw new Error(result.error);
      }
      
      console.log('Excel actualizado correctamente:', result);
    } catch (error) {
      console.error('Error actualizando Excel:', error);
      throw error;
    }
  }

  async generateNewExcel(params: ExcelGenerateParams): Promise<void> {
    try {
      if (!window.electron) {
        throw new Error('Electron no está disponible');
      }
      
      const fileName = params.fileName || `Backtest_Results_${new Date().toISOString().split('T')[0]}`;
      
      const result = await window.electron.invoke('generate-excel', {
        fileName,
        outputPath: params.outputPath,
        resultsPath: params.resultsPath,
        robotData: params.robotData
      }) as MT4Result;

      if (result?.error) {
        throw new Error(result.error);
      }
      
      console.log('Excel generado correctamente:', result);
    } catch (error) {
      console.error('Error generando Excel:', error);
      throw error;
    }
  }
}

export const mt4ExcelService = new MT4ExcelService();
