
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CurrencyPairsListProps {
  currencyPairs: string[];
  onReorder: (pairs: string[]) => void;
}

const CurrencyPairsList = ({ currencyPairs, onReorder }: CurrencyPairsListProps) => {
  const handleReorder = (dragIndex: number, dropIndex: number) => {
    const reorderedPairs = [...currencyPairs];
    const [removed] = reorderedPairs.splice(dragIndex, 1);
    reorderedPairs.splice(dropIndex, 0, removed);
    onReorder(reorderedPairs);
  };

  return (
    <ScrollArea className="h-[320px] rounded-md border">
      <div className="p-4">
        <div className="grid grid-cols-4 gap-3">
          {currencyPairs.map((pair, index) => (
            <Card
              key={index}
              className="p-2 cursor-pointer text-center"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                handleReorder(dragIndex, index);
              }}
            >
              {pair}
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default CurrencyPairsList;
