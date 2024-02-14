import { IsNotEmpty, Length, MaxLength } from 'class-validator';

export enum VERIFY_TYPE {
	CREATE_ACCOUNT = 1,
	CHANGE_PHONE = 2,
}
export class UserRegisterInput {
	@Length(11, 11)
	@IsNotEmpty()
	phone: string = '';

	@MaxLength(100)
	@IsNotEmpty()
	first_name: string = '';

	@MaxLength(100)
	@IsNotEmpty()
	last_name: string = '';

	@MaxLength(100)
	@IsNotEmpty()
	first_name_kana: string = '';

	@MaxLength(100)
	@IsNotEmpty()
	last_name_kana: string = '';

	@IsNotEmpty()
	birthday: string = '';

	gender: any;
}
