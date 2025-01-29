import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CurrencyPairsList from '@/components/CurrencyPairsList';
import { ThemeToggle } from '@/components/ThemeToggle';
import ExcelConfig from '@/components/ExcelConfig';

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
  const [saveConfig, setSaveConfig] = useState(false);
  const [currencyPairs, setCurrencyPairs] = useState([
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
      <Card className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Herramienta de Backtesting MT4</h1>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="dateFrom">Fecha Inicio</Label>
                <Input
                  type="date"
                  id="dateFrom"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dateTo">Fecha Fin</Label>
                <Input
                  type="date"
                  id="dateTo"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="robots">Seleccionar Robots (archivos .set)</Label>
              <Input
                type="file"
                id="robots"
                multiple
                accept=".set"
                onChange={handleFileChange}
                className="mt-1"
              />
              {selectedRobots.length > 0 && (
                <div className="mt-2 p-2 border rounded-md">
                  <p className="font-medium mb-2">Robots seleccionados:</p>
                  {selectedRobots.map((robot, index) => (
                    <div key={index} className="py-1">{robot.name}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <Label>Modo de Prueba</Label>
            <RadioGroup defaultValue="control" value={testingMode} onValueChange={setTestingMode} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="control" id="control" />
                <Label htmlFor="control">Puntos de Control</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tick" id="tick" />
                <Label htmlFor="tick">Tick</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price" id="price" />
                <Label htmlFor="price">Último Precio</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-center block mb-4">Pares de Divisas (Arrastrar para reordenar)</Label>
            <CurrencyPairsList 
              currencyPairs={currencyPairs}
              onReorder={setCurrencyPairs}
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveConfig"
              checked={saveConfig}
              onCheckedChange={(checked) => setSaveConfig(checked === true)}
            />
            <Label htmlFor="saveConfig">Guardar configuración actual</Label>
          </div>

          <Button 
            className="w-full"
            onClick={executeBacktest}
          >
            Ejecutar Backtesting
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;