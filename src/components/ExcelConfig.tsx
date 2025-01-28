import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
      <div className="flex items-center space-x-2">
        <Checkbox
          id="useExisting"
          checked={useExistingExcel}
          onCheckedChange={(checked) => setUseExistingExcel(checked as boolean)}
        />
        <Label htmlFor="useExisting">Usar Excel existente</Label>
      </div>

      {useExistingExcel && (
        <>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Los resultados se añadirán en una nueva hoja del Excel seleccionado
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
        <Label htmlFor="defaultNaming">Usar nombre por defecto</Label>
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
      </div>
    </div>
  );
};

export default ExcelConfig;