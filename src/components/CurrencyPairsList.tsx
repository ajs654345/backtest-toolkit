import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckSquare, XSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CurrencyPairsListProps {
  currencyPairs: string[];
  onReorder: (newOrder: string[]) => void;
}

const CurrencyPairsList = ({ currencyPairs, onReorder }: CurrencyPairsListProps) => {
  const { toast } = useToast();
  const [selectedPairs, setSelectedPairs] = useState<Set<string>>(new Set());
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(currencyPairs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorder(items);
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

  const togglePairSelection = (pair: string) => {
    const newSelection = new Set(selectedPairs);
    if (newSelection.has(pair)) {
      newSelection.delete(pair);
    } else {
      newSelection.add(pair);
    }
    setSelectedPairs(newSelection);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="flex items-center gap-2"
        >
          <CheckSquare className="h-4 w-4" />
          Seleccionar Todos
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeselectAll}
          className="flex items-center gap-2"
        >
          <XSquare className="h-4 w-4" />
          Deseleccionar Todos
        </Button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="currencyPairs">
          {(provided) => (
            <ScrollArea className="h-[320px] border rounded-md p-4 mx-auto max-w-4xl">
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="grid grid-cols-4 gap-3"
              >
                {currencyPairs.map((pair, index) => (
                  <Draggable key={`${pair}-${index}`} draggableId={`${pair}-${index}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => togglePairSelection(pair)}
                        className={`p-2 rounded-md cursor-pointer text-center h-10 flex items-center justify-center transition-colors
                          ${selectedPairs.has(pair) 
                            ? 'bg-neutral-500 hover:bg-neutral-600 text-white' 
                            : 'bg-secondary hover:bg-secondary/80'
                          }`}
                      >
                        {pair}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </ScrollArea>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default CurrencyPairsList;