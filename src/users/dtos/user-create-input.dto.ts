/* eslint-disable @typescript-eslint/no-unused-vars */
import { Equals, IsEmail, IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class UserCreateInput {
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(100)
	email = '';

	@IsNotEmpty()
	@IsString()
	@Length(8, 100)
	password1 = '';

	@IsNotEmpty()
	@IsString()
	@Length(8, 100)
	password2 = '';
}
