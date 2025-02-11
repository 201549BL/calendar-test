import { useState, useCallback, type MouseEvent } from "react";

interface SelectionCoords {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface SelectionBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface SelectionData {
  start: { x: number; y: number };
  end: { x: number; y: number };
  width: number;
  height: number;
}

interface UseSelectionToolProps {
  onSelectionChange?: (selection: SelectionData) => void;
  onSelectionEnd?: (selection: SelectionData) => void;
}

interface UseSelectionToolReturn {
  containerProps: {
    onMouseDown: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
    onMouseLeave: (e: MouseEvent) => void;
    style: {
      position: "relative";
      width: "100%";
      height: "100%";
    };
  };
  selectionBoxProps: {
    style: {
      position: "absolute";
      backgroundColor: string;
      border: string;
      pointerEvents: "none";
      left: number;
      top: number;
      width: number;
      height: number;
    };
  };
  isSelecting: boolean;
}

const useSelectionTool = ({
  onSelectionChange,
  onSelectionEnd,
}: UseSelectionToolProps = {}): UseSelectionToolReturn => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionCoords, setSelectionCoords] = useState<SelectionCoords>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const calculateSelectionData = useCallback(
    (coords: SelectionCoords): SelectionData => {
      return {
        start: {
          x: Math.min(coords.startX, coords.currentX),
          y: Math.min(coords.startY, coords.currentY),
        },
        end: {
          x: Math.max(coords.startX, coords.currentX),
          y: Math.max(coords.startY, coords.currentY),
        },
        width: Math.abs(coords.currentX - coords.startX),
        height: Math.abs(coords.currentY - coords.startY),
      };
    },
    []
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    setIsSelecting(true);
    setSelectionCoords({
      startX,
      startY,
      currentX: startX,
      currentY: startY,
    });
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      setSelectionCoords((prev) => {
        const newCoords = {
          ...prev,
          currentX,
          currentY,
        };

        const selectionData = calculateSelectionData(newCoords);
        onSelectionChange?.(selectionData);

        return newCoords;
      });
    },
    [isSelecting, calculateSelectionData, onSelectionChange]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isSelecting) {
        const selectionData = calculateSelectionData(selectionCoords);
        onSelectionEnd?.(selectionData);
      }
      setIsSelecting(false);
    },
    [isSelecting, calculateSelectionData, onSelectionEnd, selectionCoords]
  );

  const selectionBox: SelectionBox = {
    left: Math.min(selectionCoords.startX, selectionCoords.currentX),
    top: Math.min(selectionCoords.startY, selectionCoords.currentY),
    width: Math.abs(selectionCoords.currentX - selectionCoords.startX),
    height: Math.abs(selectionCoords.currentY - selectionCoords.startY),
  };

  return {
    containerProps: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      style: {
        position: "relative",
        width: "100%",
        height: "100%",
      },
    },
    selectionBoxProps: {
      style: {
        position: "absolute",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        border: "1px solid rgba(0, 123, 255, 0.5)",
        pointerEvents: "none",
        ...selectionBox,
      },
    },
    isSelecting,
  };
};

export default useSelectionTool;
