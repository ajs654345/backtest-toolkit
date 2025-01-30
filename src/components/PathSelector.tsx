import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PathSelectorProps {
  label: string;
  path: string;
  onPathChange: (path: string) => void;
  placeholder?: string;
}

const PathSelector = ({ label, path, onPathChange, placeholder }: PathSelectorProps) => {
  const { toast } = useToast();

  const handleSelectPath = async () => {
    try {
      // Verificar si estamos en un entorno Electron
      if (window && 'electron' in window) {
        // @ts-ignore - Esta API está disponible en Electron
        const result = await window.electron.showOpenDialog({
          properties: ['openDirectory']
        });
        
        if (!result.canceled && result.filePaths.length > 0) {
          onPathChange(result.filePaths[0]);
        }
      } else {
        // Si no estamos en Electron, usamos el input de tipo file nativo
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        
        input.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files && files.length > 0) {
            // En lugar de usar path, usamos el nombre del archivo como identificador
            const selectedPath = Array.from(files)
              .map(file => file.webkitRelativePath.split('/')[0])
              .filter((value, index, self) => self.indexOf(value) === index)[0];
            
            if (selectedPath) {
              onPathChange(selectedPath);
            }
          }
        };
        
        input.click();
      }
    } catch (error) {
      console.error('Error al seleccionar ruta:', error);
      toast({
        title: "Error",
        description: "No se pudo abrir el explorador de archivos. Por favor, ingrese la ruta manualmente.",
        variant: "destructive"
      });
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