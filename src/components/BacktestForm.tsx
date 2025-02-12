
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { executeBacktest } from '@/services/mt4Service';
import type { MT4Config } from '@/types/mt4';

interface BacktestFormProps {
  selectedRobots: File[];
  dateFrom: string;
  dateTo: string;
  outputPath: string;
  testingMode: MT4Config['testingMode'];
  currencyPairs: string[];
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

const BacktestForm = ({
  selectedRobots,
  dateFrom,
  dateTo,
  outputPath,
  testingMode,
  currencyPairs,
  isProcessing,
  setIsProcessing
}: BacktestFormProps) => {
  const { toast } = useToast();

  const validateForm = () => {
    if (!dateFrom || !dateTo) {
      toast({
        title: "Error de validación",
        description: "Las fechas son obligatorias",
        variant: "destructive",
      });
      return false;
    }

    if (selectedRobots.length === 0) {
      toast({
        title: "Error de validación",
        description: "Debes seleccionar al menos un robot",
        variant: "destructive",
      });
      return false;
    }

    if (!outputPath) {
      toast({
        title: "Error de validación",
        description: "La ruta de salida es obligatoria",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleBacktest = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      console.log('Iniciando proceso de backtesting...');
      
      for (const robot of selectedRobots) {
        for (const pair of currencyPairs) {
          console.log(`Procesando ${robot.name} - ${pair}`);
          
          toast({
            title: "Procesando",
            description: `Ejecutando backtest para ${robot.name} en ${pair}`,
          });

          const config: MT4Config = {
            robotPath: robot.name,
            dateFrom,
            dateTo,
            pair,
            outputPath: outputPath || './backtest_results',
            testingMode
          };

          console.log('Configuración:', config);
          
          const result = await executeBacktest(config);
          console.log('Resultado:', result);

          toast({
            title: "Completado",
            description: `Backtest finalizado para ${robot.name} - ${pair}`,
          });
        }
      }

      toast({
        title: "Proceso Completado",
        description: "Todos los backtests han sido ejecutados exitosamente",
      });
    } catch (error) {
      console.error('Error durante el proceso:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error durante el proceso de backtesting",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      className="w-full relative transition-all duration-200 hover:scale-[1.02]"
      onClick={handleBacktest}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        "Ejecutar Backtesting"
      )}
    </Button>
  );
};

export default BacktestForm;
