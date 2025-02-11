
import { addMinutes } from "date-fns";

export const CELL_HEIGHT = 15;

export const calculateTimeFromOffset = (offsetY: number, baseDate: Date): Date => {
  const slotIndex = Math.floor(offsetY / CELL_HEIGHT);
  const minutesToAdd = slotIndex * 15;
  return addMinutes(new Date(baseDate.setHours(0, 0, 0, 0)), minutesToAdd);
};

export const getOffsetFromDate = (date: Date): number => {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return (minutes / 15) * CELL_HEIGHT;
};

export const getTimeSlots = (date: Date, hours: number[]) => 
  hours.flatMap((hour) =>
    [0, 15, 30, 45].map((minute) => ({
      start: new Date(new Date(date).setHours(hour, minute, 0, 0)),
      end: addMinutes(new Date(new Date(date).setHours(hour, minute, 0, 0)), 15),
    }))
  );