import moment from 'moment';

export function isNumber(evt: KeyboardEvent) {
	const keysAllowed: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	const keyPressed: string = evt.key;

	if (!keysAllowed.includes(keyPressed)) {
		return evt.preventDefault();
	}
}

export function addZero(myNumber: any) {
	return (
		myNumber?.charAt(0) !== '0' && myNumber?.charAt(0) === '8' && myNumber?.charAt(1) === '1'
			? '0' + myNumber?.toString()?.slice(2, 13)
			: myNumber
	)
		?.replace(/\D+/g, '')
		?.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
}

export function insertSpace(string: any) {
	let formattedCardNumber = string?.replace(/[^\d]/g, '');
	formattedCardNumber = formattedCardNumber?.substring(0, 16);

	let cardNumberSections = formattedCardNumber?.match(/\d{1,4}/g);
	if (cardNumberSections !== null) {
		formattedCardNumber = cardNumberSections?.join(' ');
	}

	if (string !== formattedCardNumber) {
		string = formattedCardNumber;
	}
	return string;
}

export function insertStamp(string: any) {
	let formattedCardNumber = string?.replace(/[^\d]/g, '');
	formattedCardNumber = formattedCardNumber?.substring(0, 16);

	let cardNumberSections = formattedCardNumber?.match(/\d{1,2}/g);
	if (cardNumberSections !== null) {
		formattedCardNumber = cardNumberSections?.join(' / ');
	}

	if (string !== formattedCardNumber) {
		string = formattedCardNumber;
	}
	return string;
}

export function onlyUnsignedChar(keyPressed: string) {
	keyPressed = keyPressed?.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
	keyPressed = keyPressed?.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
	keyPressed = keyPressed?.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
	keyPressed = keyPressed?.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
	keyPressed = keyPressed?.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
	keyPressed = keyPressed?.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
	keyPressed = keyPressed?.replace(/đ/g, 'd');
	keyPressed = keyPressed?.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
	keyPressed = keyPressed?.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
	keyPressed = keyPressed?.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
	keyPressed = keyPressed?.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
	keyPressed = keyPressed?.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
	keyPressed = keyPressed?.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
	keyPressed = keyPressed?.replace(/Đ/g, 'D');
	keyPressed = keyPressed?.replace(/[0-9]*/g, '');
	keyPressed = keyPressed?.replace(/\$/g, ' ');
	keyPressed = keyPressed?.replace(/ + /g, ' ');
	keyPressed = keyPressed?.replace(
		/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|_|`|-|{|}|\||\\/g,
		' ',
	);
	keyPressed = keyPressed?.replace(/[^A-Z a-z]/gi, '');
	return keyPressed?.toLocaleUpperCase();
}

export function checkPasteKatakanaFullWidth(keyPressed: any) {
	return keyPressed?.replace(/[^[ァ-ン ー]|　]/gi, '');
}
export function checkPasteKatakanaHaftWidth(keyPressed: any) {
	return keyPressed?.replace(/^[ｧ-ﾝﾞﾟ]/gi, '');
}
export function checkPasteHiraganaHaftWidth(keyPressed: any) {
	return keyPressed?.replace(/[^ぁ-ん]/gi, '');
}

export function checkPasteAlphaNumericHalfWidth(keyPressed: any) {
	return keyPressed?.replace(/[^a-zA-Z0-9]/gi, '');
}

export function checkPasteAlphaHalfWidth(keyPressed: any) {
	return keyPressed?.replace(/[^a-zA-Z]/gi, '');
}

export function checkPasteNumber(keyPressed: any) {
	return keyPressed?.replace(/[^0-9]/gi, '');
}

export function checkPasteNumberFullWidth(keyPressed: any) {
	return keyPressed?.replace(/[^０-９]/gi, '');
}

export function formatDay(value: any) {
	return moment(value)?.format('YYYY/MM/DD');
}
export function formatDayJP(value: any) {
	moment.locale('ja');
	return moment(value).format('YYYY年MM月DD日');
}

export function formatDayTime(value: any) {
	return moment(value).format('YYYY/MM/DD HH:mm');
}

export function formatDayTime2(value: any) {
	const date = moment(value);

	const year = date.year();
	const month = `00${date.format('MM')}`.slice(-2);
	const day = `00${date.format('DD')}`.slice(-2);

	const hours =
		date.hours() < 12 ? `00${date.hours()}`.slice(-2) : date.hours() === 12 ? '12' : `00${date.hours() - 12}`.slice(-2);
	const mins = `00${date.minutes()}`.slice(-2);

	const amOrPm = date.hours() >= 12 ? 'PM' : 'AM';

	return `${year}/${month}/${day} ${hours}:${mins} ${amOrPm}`;
}

export function getMinute(start: any, end: any) {
	return moment(end).diff(moment(start), 'minute');
}
export function getHours(start: any, end: any) {
	return moment(end).diff(moment(start), 'hour');
}

export function numberWithCommas(num: any) {
	return num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	// return num?.toString()?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export function autoConvertFullsizeToHalfsize(keyPressed: any) {
	return keyPressed?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s: any) {
		return String.fromCharCode(s.charCodeAt(0) - 65248);
	});
}

export function getMaxBirthday() {
	let date = new Date();
	date.setDate(date.getDate());
	date.setMonth(date.getMonth() + 2);
	date.setFullYear(date.getFullYear() - 18);
	return date;
}

export function getCardType(cardNumber: any) {
	const number = cardNumber;

	let re = new RegExp('^4');
	if (number.match(re) != null) return 'VISA';

	re = new RegExp('^(34|37)');
	if (number.match(re) != null) return 'AMEX';

	re = new RegExp('^[25][1-5]');
	if (number.match(re) != null) return 'MASTER';

	re = new RegExp('^6011');
	if (number.match(re) != null) return 'DISCOVER';

	re = new RegExp('^35|1800');
	if (number.match(re) != null) return 'JCB';

	re = new RegExp('^36|38|39');
	if (number.match(re) != null) return 'DINERS';

	return 'UNDF'; // default type
}

export function getCardTypeByBrand(brandCard: any) {
	const brand = brandCard;

	if (brand == 'VISA') return 'visa';

	if (brand == 'AMEX') return 'american-express';

	if (brand == 'MASTER') return 'mastercard';

	if (brand == 'DISCOVER') return 'discover';

	if (brand == 'JCB') return 'jcb';

	if (brand == 'DINERS') return 'diners-club';

	return 'UNDF'; // default type
}

export function isEmailValid(emailAdress: any) {
	let EMAIL_REGEXP = new RegExp('^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$', 'i');
	return EMAIL_REGEXP.test(emailAdress);
}

export function getCookie(name: any) {
	let value = '; ' + document.cookie;
	let parts = value.split('; ' + name + '=');
	if (parts.length == 2) return parts.pop().split(';').shift();
}
