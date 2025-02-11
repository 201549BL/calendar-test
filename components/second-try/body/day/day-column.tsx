"use client";

import { hours } from "@/components/calendar/body/day/calendar-body-margin-day-margin";
import {
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { addMinutes, areIntervalsOverlapping, isSameDay } from "date-fns";
import { HTMLAttributes, useState } from "react";
import CalendarEvent from "../../calendar-event";
import { useCalendarContext } from "../../context/CalendarContext";
import type { Event } from "../../types/types";
import { DndContext, useDndMonitor } from "@dnd-kit/core";

interface DayColumnProps {
  date: Date;
  events: Event[];
}

const cellHeight = 15;

interface TimeSlotProps extends HTMLAttributes<HTMLDivElement> {
  start: Date;
  end: Date;
}

const TimeSlot = ({ start, end, ...rest }: TimeSlotProps) => {
  const { setNodeRef: droppableNodeRef, isOver } = useDroppable({
    id: `droppable-timeslot-${start.toISOString()}`,
    data: {
      start,
      end,
    },
  });

  return (
    <div
      ref={droppableNodeRef}
      key={start.toString()}
      className={`border-b border-gray-200 hover:bg-blue-200 hover:opacity-50`}
      {...rest}
    />
  );
};

export const DayColumn = ({ events, date }: DayColumnProps) => {
  const { setDialogState } = useCalendarContext();
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const sortedEvents = events.sort((a, b) => {
    const startComparison = a.start.getTime() - b.start.getTime();
    if (startComparison === 0) {
      return b.end.getTime() - a.end.getTime();
    }
    return startComparison;
  });

  const timeSlots = hours.flatMap((hour) =>
    [0, 15, 30, 45].map((minute) => ({
      start: new Date(new Date(date).setHours(hour, minute, 0, 0)),
      end: addMinutes(
        new Date(new Date(date).setHours(hour, minute, 0, 0)),
        15
      ),
    }))
  );
  const handleMouseDown = (e: React.MouseEvent, start: Date, end: Date) => {
    setIsSelecting(true);
    setSelectionStart(start);
    setSelectionEnd(end);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const rowIndex = Math.floor(relativeY / cellHeight);
    
    // Ensure rowIndex is within bounds
    const boundedRowIndex = Math.max(0, Math.min(rowIndex, timeSlots.length - 1));
    const newEnd = timeSlots[boundedRowIndex].end;
    
    setSelectionEnd(newEnd);
  };

  const handleMouseUp = () => {
    if (isSelecting && selectionStart && selectionEnd) {
      const finalStart =
        selectionStart < selectionEnd ? selectionStart : selectionEnd;
      const finalEnd =
        selectionStart < selectionEnd ? selectionEnd : selectionStart;

      setDialogState({
        isOpen: true,
        mode: "create",
        initialData: {
          start: finalStart,
          end: finalEnd,
        },
      });
    }

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };


  console.log(selectionStart, selectionEnd)

  const getSelectionStyle = () => {
    if (!selectionStart || !selectionEnd) return {};

    const startTime =
      selectionStart < selectionEnd ? selectionStart : selectionEnd;
    const endTime =
      selectionStart < selectionEnd ? selectionEnd : selectionStart;

    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();

    // Convert minutes to row numbers (4 rows per hour, so divide by 15)
    const rowStart = startMinutes / 15 + 1; // Add 1 because CSS Grid rows start at 1
    const rowSpan = (endMinutes - startMinutes) / 15;

    return {
      gridRow: `${rowStart} / span ${rowSpan}`,
    };
  };
  

  return (
    <div
      className="relative grid grid-rows-[repeat(96,15px)] border-l border-gray-200"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {timeSlots.map(({ start, end }) => (
        <TimeSlot
          key={start.toString()}
          start={start}
          end={end}
          onMouseDown={(e) => handleMouseDown(e, start, end)}
        />
      ))}

      {sortedEvents
        .filter((event) => isSameDay(event.start, date))
        .map((event) => (
          <CalendarEvent
            key={event.id}
            event={event}
            onClick={() => {
              setDialogState({
                isOpen: true,
                mode: "edit",
                initialData: { ...event },
              });
            }}
          />
        ))}

      {selectionStart && selectionEnd && (
        <div
          className="bg-blue-200 opacity-50 w-full pointer-events-none -z-10"
          style={getSelectionStyle()}
        />
      )}
    </div>
  );
};
