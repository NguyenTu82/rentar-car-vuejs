import { IsEmail, IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class UserVerifyEmailInput {
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(100)
	email: string = '';

	@IsNotEmpty()
	@IsString()
	@Length(8, 100)
	password: string = '';

	@IsNotEmpty()
	@Length(6)
	email_verify_code: string = '';
}
