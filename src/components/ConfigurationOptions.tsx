import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ConfigurationOptionsProps {
  saveConfig: boolean;
  setSaveConfig: (checked: boolean) => void;
}

const ConfigurationOptions = ({ saveConfig, setSaveConfig }: ConfigurationOptionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="saveConfig"
        checked={saveConfig}
        onCheckedChange={(checked) => setSaveConfig(checked === true)}
      />
      <Label htmlFor="saveConfig">Guardar configuración actual</Label>
    </div>
  );
};

export default ConfigurationOptions;