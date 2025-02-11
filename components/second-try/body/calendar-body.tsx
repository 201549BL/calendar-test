"use client";

import {
  DndContext,
  type DragEndEvent,
  type DragMoveEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { useState } from "react";
import { useCalendarContext } from "../context/CalendarContext";
import type { Event } from "../types/types";
import { DayView } from "./day/day-view";
import MonthView from "./month/month-view";
import WeekView from "./week/week-view";

import CalendarEvent from "../calendar-event";
import { topCornersCollisionDetection } from "../drag-drop/top-corners-collision-streategy";

const CalendarBody = () => {
  const { view, setEvents } = useCalendarContext();

  const [activeEvent, setActiveEvent] = useState<Event | null>(null);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(pointerSensor)

  const onDragStart = (event: DragStartEvent) => {


    setActiveEvent(event.active.data.current as Event);
  };

  const onDragMove = (event: DragMoveEvent) => {

  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return; // If not dropped over a valid droppable, exit
  
    const activeEvent = active.data.current as Event;
    const newStartDate = over.data.current?.start as Date;
  
    if (!newStartDate || !activeEvent) return;
  
    setEvents((prevEvents) => {
      return prevEvents.map((evt) => {
        if (evt.id === activeEvent.id) {
          // Calculate the time difference between old and new start
          const timeDifference = newStartDate.getTime() - evt.start.getTime();
          
          // Calculate new end time by applying the same time difference
          const newEndDate = new Date(evt.end.getTime() + timeDifference);
  
          return {
            ...evt,
            start: newStartDate,
            end: newEndDate,
          };
        }
        return evt;
      });
    });
  
    setActiveEvent(null);
  };

  return (
    <DndContext
      id="dnd-context"
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      collisionDetection={topCornersCollisionDetection}
      modifiers={[]}
      sensors={sensors}
    >
      {(() => {
        switch (view) {
          case "month":
            return <MonthView />;
          case "week":
            return <WeekView />;
          case "day":
            return <DayView />;
          default:
            return <div>Invalid View</div>;
        }
      })()}
      {activeEvent && (
        <DragOverlay>
          <CalendarEvent className=" shadow-xl" event={activeEvent} />
        </DragOverlay>
      )}
    </DndContext>
  );
};

export default CalendarBody;



