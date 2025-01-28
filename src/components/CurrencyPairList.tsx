import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortablePair } from './SortablePair';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface CurrencyPairListProps {
  pairs: string[];
  onPairsChange: (newPairs: string[]) => void;
  robotName?: string;
}

const CurrencyPairList = ({ pairs, onPairsChange, robotName }: CurrencyPairListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = pairs.indexOf(active.id);
      const newIndex = pairs.indexOf(over.id);
      
      onPairsChange(arrayMove(pairs, oldIndex, newIndex));
    }
  };

  const selectAll = () => {
    // Implementar lógica de selección
  };

  const deselectAll = () => {
    // Implementar lógica de deselección
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button onClick={selectAll} variant="outline" size="sm">
          Seleccionar Todos
        </Button>
        <Button onClick={deselectAll} variant="outline" size="sm">
          Deseleccionar Todos
        </Button>
      </div>
      
      <ScrollArea className="h-48 border rounded-md p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={pairs} strategy={verticalListSortingStrategy}>
            {pairs.map((pair) => (
              <SortablePair key={pair} id={pair} />
            ))}
          </SortableContext>
        </DndContext>
      </ScrollArea>
    </div>
  );
};

export default CurrencyPairList;