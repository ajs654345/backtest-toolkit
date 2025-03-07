
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { isElectronApp } from '@/lib/electron-utils';

interface MT4TerminalSelectorProps {
  mt4Terminals: string[];
  selectedTerminal: string;
  setSelectedTerminal: (terminal: string) => void;
  onRefresh: () => void;
}

const MT4TerminalSelector = ({
  mt4Terminals,
  selectedTerminal,
  setSelectedTerminal,
  onRefresh
}: MT4TerminalSelectorProps) => {
  const isElectron = isElectronApp();
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="mt4Terminal">Terminal MT4</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          title="Refrescar lista de terminales"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      
      {!isElectron && (
        <div className="text-sm text-blue-600 bg-blue-100 p-2 rounded mb-2">
          Modo web: utilizando terminales simulados. Para funcionalidad completa, ejecute la aplicación de escritorio.
        </div>
      )}
      
      {mt4Terminals.length === 0 ? (
        <div className="text-sm text-amber-600">
          No se encontraron terminales MT4 instalados. Por favor, instale MT4 y reinicie la aplicación.
        </div>
      ) : (
        <Select value={selectedTerminal} onValueChange={setSelectedTerminal}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un terminal MT4" />
          </SelectTrigger>
          <SelectContent>
            {mt4Terminals.map((terminal, index) => (
              <SelectItem key={index} value={terminal}>
                {isElectron 
                  ? terminal.split('\\').pop()?.replace('terminal.exe', '') || terminal
                  : terminal
                }
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default MT4TerminalSelector;
