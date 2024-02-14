export const isCurrentDate = (date: Date) => {
	const now = new Date();
	const isEqualYear = now.getFullYear() === date.getFullYear();
	const isEqualMonth = now.getMonth() === date.getMonth();
	const isEqualDate = now.getDate() === date.getDate();

	return isEqualYear && isEqualMonth && isEqualDate;
};

export const isSameDate = (date1: Date, date2: Date) => {
	if (date1.getFullYear() !== date2.getFullYear()) return false;
	if (date1.getMonth() !== date2.getMonth()) return false;
	if (date1.getDate() !== date2.getDate()) return false;
	return true;
};
