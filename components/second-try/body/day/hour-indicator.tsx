import { hours } from "@/components/calendar/body/day/calendar-body-margin-day-margin";

export const HourIndicator = () => {
  return (
    <div className="grid grid-rows-[repeat(96,15px)]">
      {hours.map((hour) => (
        <div
          key={hour}
          className="relative h-[60px] text-sm text-gray-500"
          style={{ gridRow: "span 4" }}
        >
          <div className="absolute right-2 -translate-y-1/2">
            {hour !== 0 && `${hour.toString().padStart(2, "0")}:00`}
          </div>
        </div>
      ))}
    </div>
  );
};
