import Calendar from "@/components/second-try/calendar";
import { generateMockEvents } from "@/lib/mock-calendar-two";

export default async function GoogleCalendarClone() {
  const events = await generateMockEvents();

  return <Calendar events={events} />;
}
