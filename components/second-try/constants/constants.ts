
export const EVENT_TYPES = ["treatment", "admin", "time off"] as const;

export const COLOR_PRESETS = {
	blue: {
		light: "#E3F2FD",
		dark: "#1976D2",
	},
	purple: {
		light: "#F3E5F5",
		dark: "#7B1FA2",
	},
	green: {
		light: "#E8F5E9",
		dark: "#2E7D32",
	},
	red: {
		light: "#FFEBEE",
		dark: "#C62828",
	},
	orange: {
		light: "#FFF3E0",
		dark: "#E65100",
	},
	teal: {
		light: "#E0F2F1",
		dark: "#00796B",
	},
	grey: {
		light: "#F5F5F5",
		dark: "#9E9E9E",
	},
} as const;