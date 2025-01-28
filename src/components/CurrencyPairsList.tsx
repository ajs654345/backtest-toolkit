import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ScrollArea } from "@/components/ui/scroll-area";

interface CurrencyPairsListProps {
  currencyPairs: string[];
  onReorder: (newOrder: string[]) => void;
}

const CurrencyPairsList = ({ currencyPairs, onReorder }: CurrencyPairsListProps) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(currencyPairs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorder(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="currencyPairs">
        {(provided) => (
          <ScrollArea className="h-[calc(2.5rem*8)] border rounded-md p-4">
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="grid grid-cols-2 gap-2"
            >
              {currencyPairs.map((pair, index) => (
                <Draggable key={`${pair}-${index}`} draggableId={`${pair}-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-2 bg-secondary rounded-md cursor-move text-center h-10 flex items-center justify-center"
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
  );
};

export default CurrencyPairsList;