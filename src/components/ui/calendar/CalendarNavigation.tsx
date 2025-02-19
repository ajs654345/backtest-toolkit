
import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarNavigationProps {
  onPreviousClick: () => void;
  onNextClick: () => void;
  previousLabel?: string;
  nextLabel?: string;
}

export const CalendarNavigation = ({
  onPreviousClick,
  onNextClick,
  previousLabel,
  nextLabel
}: CalendarNavigationProps) => {
  return (
    <div className="space-x-1 flex items-center">
      <button
        onClick={onPreviousClick}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        )}
        title={previousLabel}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={onNextClick}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        )}
        title={nextLabel}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
