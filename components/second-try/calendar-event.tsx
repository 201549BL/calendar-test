import { formatDate } from "date-fns";
import { COLOR_PRESETS } from "./constants/constants";

import type { Event, EventType } from "./types/types";
import { DragOverlay, useDraggable } from "@dnd-kit/core";


const getEventColorPreset = (eventType: EventType) => {
  switch (eventType) {
    case "treatment":
      return COLOR_PRESETS.blue;
    case "admin":
      return COLOR_PRESETS.purple;
    case "time off":
      return COLOR_PRESETS.green;
    default:
      return COLOR_PRESETS.grey;
  }
};

const getEventColorStyles = (eventType: EventType) => {
  const colorPreset = getEventColorPreset(eventType);

  return {
    backgroundColor: colorPreset.light,
    color: colorPreset.dark,
    borderColor: colorPreset.dark,
  };
};

const calculateGridPositionFromDate = (start: Date) => {


  const hours = start.getHours();
  const minutes = start.getMinutes();
  
  return (hours * 4) + Math.floor(minutes / 15) + 1; 
};

const calculateGridSpanFromDate = (start: Date, end: Date) => {
  const diffMs = end.getTime() - start.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  return Math.ceil(diffMinutes / 15);
};

type CalendarEventProps = {
  event: Event;
} & React.HTMLAttributes<HTMLDivElement>;

const CalendarEvent = ({
  event,
  style,
  className,
  ...rest
}: CalendarEventProps) => {
  const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
    id: event.id,
    data: event
  });


  const gridStart = calculateGridPositionFromDate(event.start);
  const gridSpan = calculateGridSpanFromDate(event.start, event.end);

  return (
    <div
      ref={setNodeRef}
      className={`
        absolute inset-x-1 inset-y-0 px-2 py-1 text-sm rounded-lg border
        ${className ?? ""}
        transition-shadow overflow-hidden
        ${isDragging ? "opacity-50" : ""}
      `}
      style={{
        ...style,
        ...getEventColorStyles(event.type),
        gridRow: `${gridStart} / span ${gridSpan}`,
        position: 'absolute',
      }}

      {...rest}
      {...listeners}
      {...attributes}


    >
      <div className="text-xs font-semibold">
        {formatDate(event.start, "HH:mm")} - {formatDate(event.end, "HH:mm")}
      </div>
      <div className="truncate">{event.title}</div>
    </div>
  );
};

export default CalendarEvent;
