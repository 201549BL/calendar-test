interface TimeGridUtils {
	slotHeight: number;
	minutesPerSlot: number;
}

export const createTimeGridUtils = ({
	slotHeight = 15,
	minutesPerSlot = 15,
}: TimeGridUtils) => {
	const getTimeFromY = (y: number, baseDate: Date): Date => {
		const totalMinutes = Math.floor(y / slotHeight) * minutesPerSlot;
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;

		return new Date(new Date(baseDate).setHours(hours, minutes, 0, 0));
	};

	const getYFromTime = (time: Date): number => {
		const totalMinutes = time.getHours() * 60 + time.getMinutes();
		return (totalMinutes / minutesPerSlot) * slotHeight;
	};

	const getOverlayStyles = (start: Date, end: Date) => {
		const startY = getYFromTime(start);
		const endY = getYFromTime(end);

		return {
			top: `${Math.min(startY, endY)}px`,
			height: `${Math.abs(endY - startY)}px`,
		};
	};

	return {
		getTimeFromY,
		getYFromTime,
		getOverlayStyles,
	};
};