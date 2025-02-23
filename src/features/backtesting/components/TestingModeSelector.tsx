
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TestingModeSelectorProps {
  testingMode: string;
  setTestingMode: (mode: string) => void;
}

const TestingModeSelector = ({ testingMode, setTestingMode }: TestingModeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Modo de Prueba</Label>
      <RadioGroup defaultValue="control" value={testingMode} onValueChange={setTestingMode}>
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
