import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import DateSelector from "@/components/DateSelector";
import ExcelConfig from "@/components/ExcelConfig";
import CurrencyPairList from "@/components/CurrencyPairList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Index = () => {
  const { toast } = useToast();
  const [selectedRobots, setSelectedRobots] = useState<File[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [excelName, setExcelName] = useState('');
  const [useExistingExcel, setUseExistingExcel] = useState(false);
  const [existingExcelFile, setExistingExcelFile] = useState<File | null>(null);
  const [useDefaultNaming, setUseDefaultNaming] = useState(true);
  const [selectedPairsForRobot, setSelectedPairsForRobot] = useState<{[key: string]: string[]}>({});

  const [currencyPairs] = useState([
    "USDJPY", "GBPNZD", "AUDUSD", "EURJPY", "CHFJPY", "GBPCAD", "CADJPY", "EURUSD",
    "USDCHF", "USDCAD", "EURCAD", "GBPUSD", "GBPAUD", "EURAUD", "AUDJPY", "EURCHF",
    "GBPAUD", "GBPJPY", "NZDJPY", "EURGBP", "USDCAD", "EURNZD", "CADCHF", "AUDCAD",
    "AUDNZD", "GBPCHF", "EURNZD", "AUDCHF", "NZDUSD", "NZDCAD", "NZDCHF"
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const setFiles = files.filter(file => file.name.endsWith('.set'));
    setSelectedRobots(setFiles);
    
    const newSelectedPairs: {[key: string]: string[]} = {};
    setFiles.forEach(file => {
      newSelectedPairs[file.name] = [...currencyPairs];
    });
    setSelectedPairsForRobot(newSelectedPairs);
  };

  const handleExistingExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.xlsx')) {
      setExistingExcelFile(file);
    }
  };

  const executeBacktest = async () => {
    // Validaciones
    if (!dateFrom || !dateTo) {
      toast({
        title: "Error",
        description: "Por favor, seleccione las fechas de inicio y fin",
        variant: "destructive",
      });
      return;
    }

    if (selectedRobots.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, seleccione al menos un robot",
        variant: "destructive",
      });
      return;
    }

    try {
      const command = {
        robots: selectedRobots.map(robot => ({
          name: robot.name,
          pairs: selectedPairsForRobot[robot.name] || []
        })),
        dateFrom,
        dateTo,
        outputPath,
        excelConfig: {
          useExisting: useExistingExcel,
          fileName: useDefaultNaming ? '' : excelName,
          existingFile: existingExcelFile?.name
        }
      };

      console.log('Comando de ejecución:', command);
      
      toast({
        title: "Backtesting Iniciado",
        description: "Se ha iniciado el proceso de backtesting. Por favor espere...",
      });

      // Simular la ejecución
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Backtesting Completado",
        description: "El proceso de backtesting ha finalizado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error durante el backtesting",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Herramienta de Backtesting MT4</h1>
        
        <DateSelector
          dateFrom={dateFrom}
          dateTo={dateTo}
          setDateFrom={setDateFrom}
          setDateTo={setDateTo}
        />

        <div className="mb-6">
          <Label htmlFor="robots">Seleccionar Robots (archivos .set)</Label>
          <Input
            type="file"
            id="robots"
            multiple
            accept=".set"
            onChange={handleFileChange}
            className="mt-1"
          />
        </div>

        {selectedRobots.length > 0 && (
          <div className="space-y-6 mb-6">
            {selectedRobots.map((robot, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-semibold mb-4">{robot.name}</h3>
                <CurrencyPairList
                  pairs={selectedPairsForRobot[robot.name] || []}
                  onPairsChange={(newPairs) => {
                    setSelectedPairsForRobot(prev => ({
                      ...prev,
                      [robot.name]: newPairs
                    }));
                  }}
                  robotName={robot.name}
                />
              </Card>
            ))}
          </div>
        )}

        <ExcelConfig
          useExistingExcel={useExistingExcel}
          setUseExistingExcel={setUseExistingExcel}
          existingExcelFile={existingExcelFile}
          handleExistingExcelChange={handleExistingExcelChange}
          useDefaultNaming={useDefaultNaming}
          setUseDefaultNaming={setUseDefaultNaming}
          excelName={excelName}
          setExcelName={setExcelName}
          outputPath={outputPath}
          setOutputPath={setOutputPath}
        />

        <Button 
          className="w-full"
          onClick={executeBacktest}
          disabled={selectedRobots.length === 0 || !dateFrom || !dateTo}
        >
          Ejecutar Backtesting
        </Button>
      </Card>
    </div>
  );
};

export default Index;