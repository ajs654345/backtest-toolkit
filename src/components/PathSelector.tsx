import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

interface PathSelectorProps {
  label: string;
  path: string;
  onPathChange: (path: string) => void;
  placeholder?: string;
}

const PathSelector = ({ label, path, onPathChange, placeholder }: PathSelectorProps) => {
  const handleSelectPath = async () => {
    try {
      // @ts-ignore - Esta API está disponible en Electron
      const result = await window.electron.showOpenDialog({
        properties: ['openDirectory']
      });
      
      if (!result.canceled && result.filePaths.length > 0) {
        onPathChange(result.filePaths[0]);
      }
    } catch (error) {
      console.error('Error al seleccionar ruta:', error);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleSelectPath}
          title="Seleccionar carpeta"
        >
          <FolderOpen className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PathSelector;