
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ConfigurationOptionsProps {
  saveConfig: boolean;
  setSaveConfig: (checked: boolean) => void;
  outputPath: string;
  setOutputPath: (path: string) => void;
}

const ConfigurationOptions = ({ 
  saveConfig, 
  setSaveConfig,
  outputPath,
  setOutputPath
}: ConfigurationOptionsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="saveConfig"
          checked={saveConfig}
          onCheckedChange={(checked) => setSaveConfig(checked as boolean)}
        />
        <Label htmlFor="saveConfig">Guardar configuración actual</Label>
      </div>
      
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

export default ConfigurationOptions;
