
import { toast } from "@/hooks/use-toast";

interface BacktestCommand {
  robots: Array<{
    name: string;
    pairs: string[];
  }>;
  testingMode: string;
  outputPath: string;
  excelConfig: {
    useExisting: boolean;
    fileName: string;
    existingFile?: string;
  };
}

class MT4Service {
  async executeBacktest(command: BacktestCommand): Promise<void> {
    // Simulación de comunicación con MT4
    console.log('Ejecutando backtesting con configuración:', command);
    
    // Simular proceso
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

export const mt4Service = new MT4Service();
