
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ExcelConfigProps {
  useExistingExcel: boolean;
  setUseExistingExcel: (value: boolean) => void;
  existingExcelFile: File | null;
  setExistingExcelFile: (file: File | null) => void;
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
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="useExistingExcel"
          checked={useExistingExcel}
          onCheckedChange={(checked) => setUseExistingExcel(checked as boolean)}
        />
        <Label htmlFor="useExistingExcel">Usar Excel existente</Label>
      </div>

      {useExistingExcel && (
        <div className="space-y-2">
          <Label htmlFor="existingExcel">Seleccionar Excel</Label>
          <Input
            type="file"
            id="existingExcel"
            accept=".xlsx"
            onChange={handleExistingExcelChange}
          />
          {existingExcelFile && (
            <p className="text-sm text-muted-foreground">
              Archivo seleccionado: {existingExcelFile.name}
            </p>
          )}
        </div>
      )}

      {!useExistingExcel && (
        <>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useDefaultNaming"
              checked={useDefaultNaming}
              onCheckedChange={(checked) => setUseDefaultNaming(checked as boolean)}
            />
            <Label htmlFor="useDefaultNaming">Usar nombre por defecto</Label>
          </div>

          {!useDefaultNaming && (
            <div className="space-y-2">
              <Label htmlFor="excelName">Nombre personalizado</Label>
              <Input
                type="text"
                id="excelName"
                value={excelName}
                onChange={(e) => setExcelName(e.target.value)}
                placeholder="Nombre del archivo Excel"
              />
            </div>
          )}
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="outputPath">Ruta de salida</Label>
        <Input
          type="text"
          id="outputPath"
          value={outputPath}
          onChange={(e) => setOutputPath(e.target.value)}
          placeholder="Seleccione la carpeta de destino"
        />
      </div>
    </div>
  );
};

export default ExcelConfig;
