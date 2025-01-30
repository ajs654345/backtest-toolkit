import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import PathSelector from './PathSelector';

interface ExcelConfigProps {
  useExistingExcel: boolean;
  setUseExistingExcel: (value: boolean) => void;
  existingExcelFile: File | null;
  handleExistingExcelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  useDefaultNaming: boolean;
  setUseDefaultNaming: (value: boolean) => void;
  excelName: string;
  setExcelName: (name: string) => void;
  outputPath: string;
  setOutputPath: (path: string) => void;
}

const ExcelConfig = ({
  useExistingExcel,
  setUseExistingExcel,
  existingExcelFile,
  handleExistingExcelChange,
  useDefaultNaming,
  setUseDefaultNaming,
  excelName,
  setExcelName,
  outputPath,
  setOutputPath
}: ExcelConfigProps) => {
  const { toast } = useToast();

  const handleExcelTypeChange = (value: string) => {
    setUseExistingExcel(value === "existing");
    if (value === "new") {
      toast({
        title: "Nuevo Excel",
        description: "Se creará un nuevo archivo Excel con los resultados",
      });
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="space-y-4">
        <Label>Tipo de Excel</Label>
        <RadioGroup
          value={useExistingExcel ? "existing" : "new"}
          onValueChange={handleExcelTypeChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="existing" id="existing" />
            <Label htmlFor="existing">Usar Excel existente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new">Crear nuevo Excel</Label>
          </div>
        </RadioGroup>
      </div>

      {useExistingExcel ? (
        <>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Los resultados se añadirán en una nueva hoja del Excel seleccionado con el nombre del robot y la fecha del backtesting
            </AlertDescription>
          </Alert>
          <div>
            <Label htmlFor="existingExcel">Seleccionar Excel existente</Label>
            <Input
              type="file"
              id="existingExcel"
              accept=".xlsx"
              onChange={handleExistingExcelChange}
              className="mt-1"
            />
            {existingExcelFile && (
              <p className="text-sm text-muted-foreground mt-1">
                Archivo seleccionado: {existingExcelFile.name}
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Se creará un nuevo archivo Excel con los resultados del backtesting
            </AlertDescription>
          </Alert>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="defaultNaming"
              checked={useDefaultNaming}
              onCheckedChange={(checked) => setUseDefaultNaming(checked as boolean)}
            />
            <Label htmlFor="defaultNaming">Usar nombre por defecto (Nombre del robot + Fecha)</Label>
          </div>

          {!useDefaultNaming && (
            <div>
              <Label htmlFor="excelName">Nombre personalizado del Excel</Label>
              <Input
                type="text"
                id="excelName"
                value={excelName}
                onChange={(e) => setExcelName(e.target.value)}
                className="mt-1"
                placeholder="Nombre del archivo Excel"
              />
            </div>
          )}
        </>
      )}

      <PathSelector
        label="Ruta de salida"
        path={outputPath}
        onPathChange={setOutputPath}
        placeholder="Seleccione la carpeta donde se guardarán los archivos"
      />
    </div>
  );
};

export default ExcelConfig;