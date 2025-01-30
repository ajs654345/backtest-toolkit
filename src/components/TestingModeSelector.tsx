import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { MT4Config } from '@/types/mt4';

interface TestingModeSelectorProps {
  testingMode: MT4Config['testingMode'];
  setTestingMode: (mode: MT4Config['testingMode']) => void;
}

const TestingModeSelector = ({ testingMode, setTestingMode }: TestingModeSelectorProps) => {
  return (
    <div className="mb-6">
      <Label>Modo de Prueba</Label>
      <RadioGroup defaultValue="control" value={testingMode} onValueChange={setTestingMode} className="mt-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="control" id="control" />
          <Label htmlFor="control">Puntos de Control</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="tick" id="tick" />
          <Label htmlFor="tick">Tick</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="price" id="price" />
          <Label htmlFor="price">Último Precio</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default TestingModeSelector;