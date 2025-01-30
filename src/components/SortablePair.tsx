import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox } from './ui/checkbox';

interface SortablePairProps {
  id: string;
  selected: boolean;
  onSelect: (id: string, selected: boolean) => void;
}

export function SortablePair({ id, selected, onSelect }: SortablePairProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-2 mb-2 bg-secondary rounded-md cursor-move hover:bg-secondary/80 transition-colors"
    >
      <span>{id}</span>
      <Checkbox
        checked={selected}
        onCheckedChange={(checked) => onSelect(id, checked === true)}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}