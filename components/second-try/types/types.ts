import type { EVENT_TYPES } from "../constants/constants";

export type Event = {
	id: string;
	practitioner: {
		name: string;
		image: string;
	};
	type: EventType;
	title: string;
	start: Date;
	end: Date;
};

export type ColorPreset = {
	light: string;
	dark: string;
};

export type CalendarView = "month" | "week" | "day";

export interface Schedule {
	id: string;
	practitioner: string;
	start: Date;
	end: Date;
}

export interface Period {
	id: string;
	start: Date;
	end: Date;
}

export interface SelectedPeriodData {
	start: Date;
	end: Date;
}

export type EventType = (typeof EVENT_TYPES)[number];

export type DialogState = {
	isOpen: boolean;
	mode: "create" | "edit";
	initialData?: {
		start: Date;
		end: Date;
		title?: string;
		eventType?: EventType;
		id: string;
	};
};