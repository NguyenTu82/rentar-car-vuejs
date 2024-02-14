/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
} from 'class-validator'

export default class EmailInput {
  @MaxLength(100)
  @IsEmail({}, {
    message: "メールアドレスを入力してください。"
  })
  @IsNotEmpty({
    message:"追加運転者のメールアドレスを入力してください。"
  })
  email = ''
}
