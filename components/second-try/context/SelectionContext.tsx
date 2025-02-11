import { createContext, useContext, useState, useRef } from "react";
import { calculateTimeFromOffset } from "./CalendarContext";
import { SelectedPeriodData } from "../types/types";

interface SelectionState {
  startDate: Date | null;
  endDate: Date | null;
  isDragging: boolean;
}

interface SelectionContextType {
  selection: SelectionState;
  startSelection: (date: Date, offsetY: number) => void;
  updateSelection: (date: Date, offsetY: number) => void;
  endSelection: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined
);

export const useSelectionContext = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionBoundary");
  }
  return context;
};

interface SelectionBoundaryProps {
  children: React.ReactNode;
  onSelectionComplete?: (period: SelectedPeriodData) => void;
}

export const SelectionProvider = ({
  children,
  onSelectionComplete,
}: SelectionBoundaryProps) => {
  const [selection, setSelection] = useState<SelectionState>({
    startDate: null,
    endDate: null,
    isDragging: false,
  });

  const boundaryRef = useRef<HTMLDivElement>(null);

  const startSelection = (date: Date, offsetY: number) => {
    const startTime = calculateTimeFromOffset(offsetY, date);
    setSelection({
      startDate: startTime,
      endDate: startTime,
      isDragging: true,
    });
  };

  const updateSelection = (date: Date, offsetY: number) => {
    if (!selection.isDragging) return;
    const currentTime = calculateTimeFromOffset(offsetY, date);
    setSelection((prev) => ({
      ...prev,
      endDate: currentTime,
    }));
  };

  const endSelection = () => {
    if (selection.isDragging && selection.startDate && selection.endDate) {
      const [finalStart, finalEnd] =
        selection.startDate < selection.endDate
          ? [selection.startDate, selection.endDate]
          : [selection.endDate, selection.startDate];

      onSelectionComplete?.(finalStart, finalEnd);
    }

    setSelection({
      startDate: null,
      endDate: null,
      isDragging: false,
    });
  };

  return (
    <SelectionContext.Provider
      value={{
        selection,
        startSelection,
        updateSelection,
        endSelection,
      }}
    >
      <div ref={boundaryRef} className="relative" onMouseLeave={endSelection}>
        {children}
      </div>
    </SelectionContext.Provider>
  );
};
