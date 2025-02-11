"use client";

import { useState } from "react";
import Calendar from "./calendar/calendar";
import type { CalendarEvent, Mode } from "./calendar/calendar-types";
import { generateMockEvents } from "@/lib/mock-calendar-events";

export default function MyCalendarDemo() {
  const [events, setEvents] = useState<CalendarEvent[]>(generateMockEvents());
  const [mode, setMode] = useState<Mode>("month");
  const [date, setDate] = useState<Date>(new Date());

  return (
    <Calendar
      events={events}
      setEvents={setEvents}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
    />
  );
}
