/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsNotEmpty,
  Matches,
  Length,
} from 'class-validator'
import ChangePhoneInput from './change-phone-input.dto'

export default class ChangeCodeInput extends ChangePhoneInput{
  @Length(6,6, {
    message:"整数6桁を入力してください。"
  })
  @Matches(/^[0-9]*$/, {
    message:"整数6桁を入力してください。"
  })
  @IsNotEmpty({
    message:"認証コードを入力してください。"
  })
  sms_verify_code: number | undefined
}
