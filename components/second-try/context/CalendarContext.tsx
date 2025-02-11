"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import type {
  CalendarView,
  DialogState,
  Event,
  Schedule,
} from "../types/types";
import { addMinutes } from "date-fns";

export interface SelectionState {
  startDate: Date | null;
  startColumn: number | null;
  endDate: Date | null;
  endColumn: number | null;
}

interface CalendarContext {
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
  view: CalendarView;
  setView: Dispatch<SetStateAction<CalendarView>>;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  schedules: Schedule[];
  setSchedules: Dispatch<SetStateAction<Schedule[]>>;
  dialogState: DialogState;
  setDialogState: (state: DialogState) => void;
  closeDialog: () => void;
}

export const CalendarContext = createContext<CalendarContext | undefined>(
  undefined
);

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider"
    );
  }

  return context;
}

export default function CalendarProvider({
  events,
  setEvents,
  view,
  setView,
  date,
  setDate,
  schedules,
  setSchedules,
  children,
}: {
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
  view: CalendarView;
  setView: Dispatch<SetStateAction<CalendarView>>;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  schedules: Schedule[];
  setSchedules: Dispatch<SetStateAction<Schedule[]>>;
  children: React.ReactNode;
}) {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    mode: "create",
  });

  // Add selection state
  const [selection, setSelection] = useState<SelectionState>({
    startDate: null,
    startColumn: null,
    endDate: null,
    endColumn: null,
  });
  const [isDragging, setIsDragging] = useState(false);

  const closeDialog = () => {
    setDialogState({
      isOpen: false,
      mode: "create",
    });
  };

  const startSelection = (date: Date, columnIndex: number, offsetY: number) => {
    const startTime = calculateTimeFromOffset(offsetY, date);
    setSelection({
      startDate: startTime,
      startColumn: columnIndex,
      endDate: startTime,
      endColumn: columnIndex,
    });
    setIsDragging(true);
  };

  const updateSelection = (
    date: Date,
    columnIndex: number,
    offsetY: number
  ) => {
    if (!isDragging) return;
    const currentTime = calculateTimeFromOffset(offsetY, date);
    setSelection((prev) => ({
      ...prev,
      endDate: currentTime,
      endColumn: columnIndex,
    }));
  };

  const endSelection = () => {
    if (!isDragging || !selection.startDate || !selection.endDate) return;

    const startColumn = Math.min(selection.startColumn!, selection.endColumn!);
    const endColumn = Math.max(selection.startColumn!, selection.endColumn!);

    let finalStart = selection.startDate;
    let finalEnd = selection.endDate;

    if (startColumn !== endColumn) {
      const dayDiff = endColumn - startColumn;
      if (selection.startColumn! > selection.endColumn!) {
        finalStart = selection.endDate;
        finalEnd = selection.startStart;
      }
      const endDate = new Date(finalEnd);
      endDate.setDate(finalStart.getDate() + dayDiff);
      finalEnd = endDate;
    } else if (finalStart > finalEnd) {
      [finalStart, finalEnd] = [finalEnd, finalStart];
    }

    setDialogState({
      isOpen: true,
      mode: "create",
      initialData: {
        start: finalStart,
        end: finalEnd,
      },
    });

    setSelection({
      startDate: null,
      startColumn: null,
      endDate: null,
      endColumn: null,
    });
    setIsDragging(false);
  };

  return (
    <CalendarContext.Provider
      value={{
        // Existing values
        events,
        setEvents,
        view,
        setView,
        date,
        schedules,
        setSchedules,
        dialogState,
        setDialogState,
        closeDialog,
        setDate,

        // Selection values
        selection,
        isDragging,
        startSelection,
        updateSelection,
        endSelection,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

// Add utility functions in a separate file (utils/calendar.ts)
export const calculateTimeFromOffset = (
  offsetY: number,
  baseDate: Date
): Date => {
  const cellHeight = 15; // 15px per 15-minute slot
  const slotIndex = Math.floor(offsetY / cellHeight);
  const minutesToAdd = slotIndex * 15;
  return addMinutes(new Date(baseDate.setHours(0, 0, 0, 0)), minutesToAdd);
};

export const isColumnInSelection = (
  columnIndex: number,
  selection: SelectionState
) => {
  if (!selection.startColumn || !selection.endColumn) return false;
  const startCol = Math.min(selection.startColumn, selection.endColumn);
  const endCol = Math.max(selection.startColumn, selection.endColumn);
  return columnIndex >= startCol && columnIndex <= endCol;
};

export const calculateSelectionStyle = (
  columnIndex: number,
  selection: SelectionState
) => {
  const cellHeight = 15;
  const startCol = Math.min(selection.startColumn!, selection.endColumn!);
  const endCol = Math.max(selection.startColumn!, selection.endColumn!);

  let top;
  let height;

  if (startCol === endCol) {
    const startMinutes =
      selection.startDate!.getHours() * 60 + selection.startDate!.getMinutes();
    const endMinutes =
      selection.endDate!.getHours() * 60 + selection.endDate!.getMinutes();
    top = Math.min(startMinutes, endMinutes);
    height = Math.abs(endMinutes - startMinutes);
  } else if (columnIndex === startCol) {
    const startMinutes =
      selection.startDate!.getHours() * 60 + selection.startDate!.getMinutes();
    top = startMinutes;
    height = 24 * 60 - startMinutes;
  } else if (columnIndex === endCol) {
    const endMinutes =
      selection.endDate!.getHours() * 60 + selection.endDate!.getMinutes();
    top = 0;
    height = endMinutes;
  } else {
    top = 0;
    height = 24 * 60;
  }

  return {
    top: (top / 15) * cellHeight,
    height: (height / 15) * cellHeight,
  };
};
