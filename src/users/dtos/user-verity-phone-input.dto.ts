import { IsNotEmpty, Length } from 'class-validator';
import { UserRegisterInput } from './user-register-input.dto';

export enum VERIFY_TYPE {
	CREATE_ACCOUNT = 1,
	CHANGE_PHONE = 2,
}
export class UserVerifyPhoneInput extends UserRegisterInput {
	@IsNotEmpty()
	@Length(6)
	sms_verify_code: string = '';

	type?: VERIFY_TYPE = VERIFY_TYPE.CREATE_ACCOUNT;
}
