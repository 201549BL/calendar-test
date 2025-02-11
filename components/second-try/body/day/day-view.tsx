import { formatDate } from "date-fns";
import { useCalendarContext } from "../../context/CalendarContext";
import { DayColumn } from "./day-column";
import { HourIndicator } from "./hour-indicator";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import CalendarEvent from "../../calendar-event";

export const DayView = () => {
  const { events, date, setDialogState } = useCalendarContext();

  const Header = () => {
    return (
      <div className="w-full flex flex-col items-center border-b border-gray-200 bg-gray-50 py-3 text-sm font-semibold text-gray-700 text-center border-l">
        <span>{formatDate(date, "eeee")}</span>
        <span className="text-sm font-normal">{formatDate(date, "dd/MM")}</span>
      </div>
    );
  };

  return (
    <div >
      <Header />
      <div className="grid grid-cols-[4rem_1fr]">
        <HourIndicator />
        <DayColumn date={date} events={events} />
      </div>
    </div>
  );
};
