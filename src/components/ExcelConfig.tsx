import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  return (
    <div className="space-y-4 mb-6">
      <div className="space-y-4">
        <Label>Tipo de Excel</Label>
        <RadioGroup
          value={useExistingExcel ? "existing" : "new"}
          onValueChange={(value) => setUseExistingExcel(value === "existing")}
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

      {useExistingExcel && (
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
          </div>
        </>
      )}

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
          />
        </div>
      )}

      <div>
        <Label htmlFor="outputPath">Ruta de salida</Label>
        <Input
          type="text"
          id="outputPath"
          value={outputPath}
          onChange={(e) => setOutputPath(e.target.value)}
          placeholder="Ruta donde se guardarán los archivos"
          className="mt-1"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Los resultados del backtesting, capturas e informes se guardarán en esta ruta, organizados por carpetas (Robot/Par/Fecha)
        </p>
      </div>
    </div>
  );
};

export default ExcelConfig;