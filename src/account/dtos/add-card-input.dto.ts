/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsNotEmpty,
  Length,
  MaxLength
} from 'class-validator'

export default class AddCardInput {
  @Length(14, 16, {
    message:"正しい番号を入力してください。"
  })
  @IsNotEmpty({
    message:"番号を入力してください。"
  })
  card_number: string | undefined

  @Length(4, 4, {
    message:"有効期限が不正です。"
  })
  @IsNotEmpty({
    message:"有効期限を入力してください。"
  })
  expired_date: string | undefined

  @Length(3,4, {
    message:"セキュリティコードが不正です。"
  })
  @IsNotEmpty({
    message:"セキュリティコードを入力してください。"
  })
  security_number: number | undefined

  @MaxLength(50, {
    message:"カード名義が不正。"
  })
  @IsNotEmpty({
    message:"カード名義を入力してください。"
  })
  card_hoder_name: string | undefined
}

