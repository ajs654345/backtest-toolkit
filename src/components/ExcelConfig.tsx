import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

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

  const handleDirectorySelect = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;
      
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          // Obtener la ruta del primer archivo seleccionado
          const path = files[0].webkitRelativePath.split('/')[0];
          setOutputPath(path);
        }
      };
      
      input.click();
    } catch (err) {
      console.error('Error al seleccionar directorio:', err);
      toast({
        title: "Error",
        description: "No se pudo seleccionar el directorio",
        variant: "destructive",
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

      <div>
        <Label htmlFor="outputPath">Ruta de salida</Label>
        <div className="flex space-x-2">
          <Input
            type="text"
            id="outputPath"
            value={outputPath}
            readOnly
            placeholder="Seleccione la carpeta de destino"
            className="mt-1"
          />
          <Button
            type="button"
            onClick={handleDirectorySelect}
            className="mt-1"
          >
            Seleccionar
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Los resultados del backtesting, capturas e informes se guardarán en esta ruta, organizados por carpetas (Robot/Par/Fecha)
        </p>
      </div>
    </div>
  );
};

export default ExcelConfig;