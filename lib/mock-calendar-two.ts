import { addDays, startOfMonth } from "date-fns";
import type { Event } from "@/components/second-try/types/types";
import {
	COLOR_PRESETS,
	EVENT_TYPES,
} from "@/components/second-try/constants/constants";

const EVENT_TITLES = [
	"Team Standup",
	"Project Review",
	"Client Meeting",
	"Design Workshop",
	"Code Review",
	"Sprint Planning",
	"Product Demo",
	"Architecture Discussion",
	"User Testing",
	"Stakeholder Update",
	"Tech Talk",
	"Deployment Planning",
	"Bug Triage",
	"Feature Planning",
	"Team Training",
];

const PRACTITIONERS = [
	{
		name: "Dr. Sarah Chen",
		image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
	},
	{
		name: "Dr. James Wilson",
		image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
	},
	{
		name: "Dr. Maria Rodriguez",
		image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
	},
	{
		name: "Dr. David Kim",
		image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
	},
	{
		name: "Dr. Emily Thompson",
		image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
	},
];

function getRandomTime(date: Date): Date {
	const hours = Math.floor(Math.random() * 14) + 8; // 8 AM to 10 PM
	const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
	return new Date(date.setHours(hours, minutes, 0, 0));
}

function generateEventDuration(): number {
	const durations = [30, 45, 90, 120]; // 30m, 45m, 1.5h, 2h in minutes
	return durations[Math.floor(Math.random() * durations.length)];
}

export function getRandomPractitioner() {
	return PRACTITIONERS[Math.floor(Math.random() * PRACTITIONERS.length)];
}

// Add function to get random color preset
export function getRandomColorPreset() {
	const presetKeys = Object.keys(COLOR_PRESETS) as Array<
		keyof typeof COLOR_PRESETS
	>;
	return COLOR_PRESETS[
		presetKeys[Math.floor(Math.random() * presetKeys.length)]
	];
}

export function getRandomEventType() {
	const randomIndex = Math.floor(Math.random() * EVENT_TYPES.length);
	return EVENT_TYPES[randomIndex];
}

export function generateMockEvents(): Event[] {
	const events: Event[] = [];
	const startDate = startOfMonth(new Date());

	// Generate 120 events over 3 months
	for (let i = 0; i < 120; i++) {
		// Random date between start and end
		const daysToAdd = Math.floor(Math.random() * 90); // 90 days = ~3 months
		const eventDate = addDays(startDate, daysToAdd);

		const startTime = getRandomTime(eventDate);
		const durationMinutes = generateEventDuration();
		const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

		events.push({
			id: `event-${i + 1}`,
			practitioner: getRandomPractitioner(),
			type: getRandomEventType(),
			title: EVENT_TITLES[Math.floor(Math.random() * EVENT_TITLES.length)],
			start: startTime,
			end: endTime,
		});
	}

	// Sort events by start date
	return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}
