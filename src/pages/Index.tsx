import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThemeToggle } from "@/components/ThemeToggle";
import DateSelector from "@/components/DateSelector";
import ExcelConfig from "@/components/ExcelConfig";
import CurrencyPairList from "@/components/CurrencyPairList";

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
  const [testingMode, setTestingMode] = useState('control');
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
  };

  const handleExistingExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.xlsx')) {
      setExistingExcelFile(file);
    }
  };

  const executeBacktest = async () => {
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
          pairs: currencyPairs
        })),
        dateFrom,
        dateTo,
        testingMode,
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
      <ThemeToggle />
      
      <div className="grid grid-cols-[300px,1fr] gap-6">
        {/* Panel lateral fijo de pares de divisas */}
        <Card className="p-4 h-[calc(100vh-3rem)] sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Pares de Divisas</h2>
          <CurrencyPairList
            pairs={currencyPairs}
            onPairsChange={() => {}}
          />
        </Card>

        {/* Contenido principal */}
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Herramienta de Backtesting MT4</h1>
          
          <div className="space-y-6">
            <DateSelector
              dateFrom={dateFrom}
              dateTo={dateTo}
              setDateFrom={setDateFrom}
              setDateTo={setDateTo}
            />

            <div className="space-y-4">
              <Label>Modo de Testing</Label>
              <RadioGroup
                value={testingMode}
                onValueChange={setTestingMode}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tick" id="tick" />
                  <Label htmlFor="tick">On Tick</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="control" id="control" />
                  <Label htmlFor="control">Puntos de Control</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price" id="price" />
                  <Label htmlFor="price">Último Precio</Label>
                </div>
              </RadioGroup>
            </div>

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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;