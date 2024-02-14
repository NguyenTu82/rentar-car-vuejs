/**
 *
 * format to Japanese phone number
 * 0123456789 => +81123456789
 * 123456789 => +81123456789
 *
 * @param phone
 * @returns
 */
export const toJapanesePhoneNumber = (phone: any) => {
	if (!phone || phone.startsWith('+')) return phone;
	if (phone.startsWith('0')) return '81' + phone.slice(1);
	if(phone.startsWith('81')) return phone;
	return '81' + phone;
};

/**
 *
 * return yyyy/MM/dd
 *
 */
export const toFormattedDate = (dateString: Date | string) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = `00${date.getMonth() + 1}`.slice(-2);
	const day = `00${date.getDate()}`.slice(-2);

	return `${year}/${month}/${day}`;
};

/**
 *
 * return yyyy/MM/dd HH:mm (AM/PM)?
 * - e.g.
 * 	- 2022/09/10 03:00 PM
 * 	- 2022/09/10 15:00
 *
 */
export const toFormattedDateTime = (dateString: Date | string | number, base: 12 | 24 = 12) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = `00${date.getMonth() + 1}`.slice(-2);
	const day = `00${date.getDate()}`.slice(-2);

	const hours = `00${date.getHours() % 12 || 12}`.slice(-2);
	const mins = `00${date.getMinutes()}`.slice(-2);

	if (base === 24) {
		const hours = `00${date.getHours()}`.slice(-2);
		return `${year}/${month}/${day} ${hours}:${mins}`;
	}

	const amOrPm = date.getHours() >= 12 ? 'PM' : 'AM';

	return `${year}/${month}/${day} ${hours}:${mins} ${amOrPm}`;
};

/**
 *
 * return: [date, time]
 *
 */
export const separateDate = (date: Date | number | string) => {
	if (!date) return [];
	date = new Date(date);
	const localDate = `${to2Number(date.getMonth() + 1)}/${to2Number(date.getDate())}`;
	const localTime = `${to2Number(date.getHours())}:${to2Number(date.getMinutes())}`;
	return [localDate, localTime];
};

const to2Number = (number: number | string) => {
	return ('00' + number).slice(-2);
};
