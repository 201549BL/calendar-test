"use client";

import React, { useState } from "react";

import { CalendarHeader } from "./calendar-header";
import CalendarBody from "./body/calendar-body";

import type { CalendarView, Event, Schedule } from "./types/types";
import CalendarProvider from "./context/CalendarContext";
import { EventFormDialog } from "./dialog/EventFormDialog";

const Calendar = ({
  events: InitialEvents = [],
  schedules: initialSchedules = [],
}: {
  events?: Event[];
  schedules?: Schedule[];
}) => {
  const [events, setEvents] = useState<Event[]>(InitialEvents);
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [view, setView] = useState<CalendarView>("day");
  const [date, setDate] = useState<Date>(new Date());

  return (
    <CalendarProvider
      events={events}
      setEvents={setEvents}
      view={view}
      setView={setView}
      date={date}
      setDate={setDate}
      schedules={schedules}
      setSchedules={setSchedules}
    >
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <CalendarHeader />
          <CalendarBody />
          <EventFormDialog />
        </div>
      </div>
    </CalendarProvider>
  );
};

export default Calendar;
