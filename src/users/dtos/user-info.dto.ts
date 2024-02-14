import { IsNotEmpty, MaxLength } from 'class-validator';

export enum VERIFY_TYPE {
	CREATE_ACCOUNT = 1,
	CHANGE_PHONE = 2,
}
export class UserInfo {
	id: string = '';

	email: string = '';

	email_verified_at: string = '';

	status: number = 0;

	reg_step: number = 0;

	@IsNotEmpty()
	phone: string = '';

	@MaxLength(100)
	first_name: string = '';

	@MaxLength(100)
	last_name: string = '';

	birthday: string = '';

	@MaxLength(100)
	address1: string = '';
	
	ekyc_status: any = null;

	freekey_user_id: any = null;

	last_login: any = null;

	created_at: string = '';
	
	updated_at: string = '';
}
