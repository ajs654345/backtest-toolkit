
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CurrencyPairsListProps {
  currencyPairs: string[];
  onReorder: (pairs: string[]) => void;
}

const CurrencyPairsList = ({ currencyPairs, onReorder }: CurrencyPairsListProps) => {
  const { toast } = useToast();
  const [selectedPairs, setSelectedPairs] = useState<Set<string>>(new Set());

  const handleReorder = (dragIndex: number, dropIndex: number) => {
    const reorderedPairs = [...currencyPairs];
    const [removed] = reorderedPairs.splice(dragIndex, 1);
    reorderedPairs.splice(dropIndex, 0, removed);
    onReorder(reorderedPairs);
  };

  const toggleSelection = (pair: string) => {
    const newSelection = new Set(selectedPairs);
    if (newSelection.has(pair)) {
      newSelection.delete(pair);
    } else {
      newSelection.add(pair);
    }
    setSelectedPairs(newSelection);
  };

  const handleSelectAll = () => {
    setSelectedPairs(new Set(currencyPairs));
    toast({
      title: "Selección actualizada",
      description: "Todos los pares han sido seleccionados",
    });
  };

  const handleDeselectAll = () => {
    setSelectedPairs(new Set());
    toast({
      title: "Selección actualizada",
      description: "Todos los pares han sido deseleccionados",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Seleccionar Todos
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeselectAll}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Deseleccionar Todos
        </Button>
      </div>
      
      <ScrollArea className="h-[320px] rounded-md border">
        <div className="p-4">
          <div className="grid grid-cols-4 gap-3">
            {currencyPairs.map((pair, index) => (
              <Card
                key={index}
                className={`p-2 cursor-pointer text-center transition-colors ${
                  selectedPairs.has(pair) 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  handleReorder(dragIndex, index);
                }}
                onClick={() => toggleSelection(pair)}
              >
                {pair}
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CurrencyPairsList;
