import React from "react";
import {
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  format as formatDate,
  getDay,
} from "date-fns";

import { useCalendarContext } from "../../context/CalendarContext";

export const MonthView = () => {
  const { events, date } = useCalendarContext();

  // Get all days in the month plus padding days to complete weeks
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const firstDayOfGrid = new Date(monthStart);

  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  const dayOfWeek = getDay(firstDayOfGrid);
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  firstDayOfGrid.setDate(firstDayOfGrid.getDate() + mondayOffset);

  // Create 6 weeks of dates (42 days) to ensure consistent grid
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = new Date(firstDayOfGrid);
    day.setDate(day.getDate() + i);
    return day;
  });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-sm font-semibold text-gray-700 text-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-l border-gray-200">
        {calendarDays.map((day) => (
          <div
            key={day.toISOString()}
            className={`
              min-h-[100px] p-2 border-r border-b border-gray-200
              ${isSameMonth(day, date) ? "bg-white" : "bg-gray-50"}
            `}
          >
            <div
              className={`
                text-sm font-semibold
                ${isSameMonth(day, date) ? "text-gray-700" : "text-gray-400"}
              `}
            >
              {formatDate(day, "d")}
            </div>

            {/* Events for this day */}
            <div className="mt-1">
              {events
                .filter((event) => isSameDay(event.start, day))
                .slice(0, 3) // Show max 3 events per day
                .map((event) => (
                  <div
                    key={event.id}
                    className="text-xs mb-1 px-2 py-1 rounded truncate"
                    style={{
                      backgroundColor: event.color.light,
                      color: event.color.dark,
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: event.color.dark,
                    }}
                  >
                    {formatDate(event.start, "HH:mm")} {event.title}
                  </div>
                ))}
              {events.filter((event) => isSameDay(event.start, day)).length >
                3 && (
                <div className="text-xs text-gray-500">
                  +
                  {events.filter((event) => isSameDay(event.start, day))
                    .length - 3}{" "}
                  more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
