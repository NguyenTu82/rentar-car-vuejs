import { isCurrentDate } from './checker';

const THIRTY_MINS = 30 * 60 * 1000; // (ms)

/**
 * []
 */
export const generateTimeRangeToEndDate = (date: Date | string) => {
	const result: Date[] = [];
	const localDate = new Date(date);
	const endOfDate = new Date(date);
	endOfDate.setDate(endOfDate.getDate() + 1);
	endOfDate.setHours(0);
	endOfDate.setMinutes(0);
	endOfDate.setSeconds(0);

	localDate.setSeconds(0);
	if (isCurrentDate(localDate)) {
		const now = new Date();
		const mins = now.getMinutes();

		if (mins >= 30) {
			localDate.setHours(now.getHours() + 1);
			localDate.setMinutes(0);
		} else {
			localDate.setHours(now.getHours());
			localDate.setMinutes(30);
		}
	} else {
		localDate.setHours(0);
		localDate.setMinutes(0);
	}

	while (localDate.getTime() < endOfDate.getTime()) {
		result.push(new Date(localDate.getTime()));
		localDate.setTime(localDate.getTime() + THIRTY_MINS);
	}

	return result;
};
