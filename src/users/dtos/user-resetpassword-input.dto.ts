import { Equals, IsEmail, IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class UserResetPasswordInput {
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(100)
	email: string = '';

	@IsNotEmpty()
	@IsString()
	@Length(8, 100)
	password: string = '';

	@IsNotEmpty()
	@IsString()
	@Length(8, 100)
	@Equals('password1')
	confirm_password: string = '';

	@IsNotEmpty()
	@Length(6)
	email_verify_code: string = '';
}
