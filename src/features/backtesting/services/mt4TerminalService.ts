
import { MT4Result } from './mt4Types';
import { invokeElectron } from '@/lib/electron-utils';

export class MT4TerminalService {
  async getMT4Terminals(): Promise<string[]> {
    try {
      if (!window.electron) {
        console.log('Web mode: simulating MT4 terminals');
        return [
          'Terminal 1 (Simulado)',
          'Terminal 2 (Simulado)',
          'Terminal 3 (Simulado)'
        ];
      }
      
      const result = await invokeElectron('get-mt4-terminals') as MT4Result;
      if (result?.error) {
        throw new Error(result.error);
      }
      
      // Para desarrollo, simulamos terminales si no hay datos
      if (!result.data || result.data.length === 0) {
        console.log('Usando terminales MT4 simulados para desarrollo');
        return [
          'C:\\Program Files\\Darwinex MT4\\terminal.exe',
          'C:\\Program Files\\MetaTrader 4\\terminal.exe',
          'C:\\Users\\Usuario\\AppData\\Roaming\\MetaQuotes\\Terminal\\1B80A8D8FC5F405C891BF1E1E5185D92\\terminal.exe'
        ];
      }
      
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener terminales MT4:', error);
      return [
        'Terminal 1 (Error - Simulado)',
        'Terminal 2 (Error - Simulado)',
        'Terminal 3 (Error - Simulado)'
      ];
    }
  }
}

export const mt4TerminalService = new MT4TerminalService();
