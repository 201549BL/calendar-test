"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";
import type { Event } from "./types/types";

interface CalendarGridProps {
  events: Event[];
}

export function CalendarGrid({ events: initialEvents }: CalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const daysInMonth = lastDayOfMonth.getDate();
  const startingDay = firstDayOfMonth.getDay();

  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - startingDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
  };

  const handleCreateEvent = (title: string, time: string) => {
    if (selectedDate) {
      const newEvent: Event = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        date: selectedDate,
        time,
      };
      setEvents([...events, newEvent]);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedEvents = Array.from(events);
    const [reorderedEvent] = updatedEvents.splice(
      events.findIndex((e) => e.id === draggableId),
      1
    );

    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      Number.parseInt(destination.droppableId)
    );
    reorderedEvent.date = newDate;

    updatedEvents.push(reorderedEvent);

    setEvents(updatedEvents);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day) => (
            <div key={day} className="bg-white p-2 text-center font-semibold">
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => (
            <Droppable
              droppableId={day ? day.toString() : `empty-${index}`}
              key={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-2 h-32 border-t relative"
                >
                  {day && (
                    <span
                      className={`float-left ${
                        day === currentDate.getDate()
                          ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          : ""
                      }`}
                    >
                      {day}
                    </span>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </ScrollArea>
    </DragDropContext>
  );
}
