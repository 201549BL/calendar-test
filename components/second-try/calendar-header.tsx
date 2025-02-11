"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendarContext } from "./context/CalendarContext";
import { addDays, addMonths, addWeeks, formatDate } from "date-fns";

export function CalendarHeader() {
  const {
    view,
    setView,
    date,
    setDate,
    selectedPeriod: selectedSlot,
  } = useCalendarContext();

  const onChevronClick = (direction: "next" | "previous") => {
    let value = 1;
    if (direction === "previous") value = -1;

    switch (view) {
      case "day":
        setDate(addDays(date, value));
        break;

      case "week":
        setDate(addWeeks(date, value));
        break;

      case "month":
        setDate(addMonths(date, value));
        break;

      default:
        break;
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => setDate(new Date())}>
          Today
        </Button>
        <div className="flex">
          <Button
            onClick={() => onChevronClick("previous")}
            variant="ghost"
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onChevronClick("next")}
            variant="ghost"
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-xl">{formatDate(date, "yyyy MMMM")}</span>
        <span>{selectedSlot?.start.toString()}</span>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant={view === "day" ? "default" : "outline"}
          onClick={() => setView("day")}
        >
          Day
        </Button>
        <Button
          variant={view === "week" ? "default" : "outline"}
          onClick={() => setView("week")}
        >
          Week
        </Button>
        <Button
          variant={view === "month" ? "default" : "outline"}
          onClick={() => setView("month")}
        >
          Month
        </Button>
      </div>
    </header>
  );
}
