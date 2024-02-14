/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator'

export class UserLoginInput {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
    email = ''

  @IsNotEmpty()
  @IsString()
  @Length(8, 100)
    password = ''
}
