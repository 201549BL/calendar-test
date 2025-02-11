import React from "react";
import { areIntervalsOverlapping, formatDate } from "date-fns";
import type { Event } from "../../types/types";

import { DayColumn } from "../day/day-column";
import { useCalendarContext } from "../../context/CalendarContext";
import { HourIndicator } from "../day/hour-indicator";
import { DndContext } from "@dnd-kit/core";

const events = [
  {
    id: "event-54",
    title: "Product Demo",
    start: new Date("2025-02-05T12:15:00+0100"),
    end: new Date("2025-02-05T17:45:00+0100"),
  },
  {
    id: "event-55",
    title: "Product Demo",
    start: new Date("2025-02-05T13:15:00+0100"),
    end: new Date("2025-02-05T15:45:00+0100"),
  },
];

const isOverlapping = (event: Event, events: Event[]) => {
  return events.some(
    (e) =>
      e.id !== event.id &&
      e.start < event.start &&
      areIntervalsOverlapping(
        { start: event.start, end: event.end },
        { start: e.start, end: e.end },
        { inclusive: true }
      )
  );
};

export const WeekView = () => {
  const { events, date } = useCalendarContext();

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay() + i);
    return d;
  });

  return (

      <div className="grid grid-cols-[4rem_repeat(7,1fr)]">
        <div className="border-b border-gray-200 bg-gray-50" />
        {weekDates.map((date) => (
          <div
            key={date.toISOString()}
            className="border-b border-l border-gray-200 bg-gray-50 py-3"
          >
            <div className="text-sm font-semibold text-gray-700 text-center">
              {formatDate(date, "eeee")}
            </div>
            <div className="text-sm text-gray-500 text-center">
              {formatDate(date, "dd/MM")}
            </div>
          </div>
        ))}

        <HourIndicator />

        {weekDates.map((date) => (
          <DayColumn key={date.toISOString()} date={date} events={events} />
        ))}
      </div>

  );
};

export default WeekView;

const Header = ({ weekDates }: { weekDates: Date[] }) => {
  return (
    <div className="flex w-full">
      <div className="shrink-0 w-16 border-b border-gray-200 bg-gray-50" />
      <div className="w-full grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {weekDates.map((date, index) => (
          <div
            key={date.toISOString()}
            className="py-3 text-sm font-semibold text-gray-700 text-center border-l border-gray-200"
          >
            <div className="text-sm font-normal">
              {date.getDate()}/{date.getMonth() + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
