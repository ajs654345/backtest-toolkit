
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RobotSelectorProps {
  selectedRobots: File[];
  setSelectedRobots: (robots: File[]) => void;
}

const RobotSelector = ({ selectedRobots, setSelectedRobots }: RobotSelectorProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const setFiles = files.filter(file => file.name.endsWith('.set'));
    setSelectedRobots(setFiles);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="robots">Seleccionar Robots (archivos .set)</Label>
      <Input
        type="file"
        id="robots"
        multiple
        accept=".set"
        onChange={handleFileChange}
        className="mt-1"
      />
      {selectedRobots.length > 0 && (
        <div className="mt-2 p-2 border rounded-md">
          <p className="font-medium mb-2">Robots seleccionados:</p>
          {selectedRobots.map((robot, index) => (
            <div key={index} className="text-sm py-1">{robot.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RobotSelector;
