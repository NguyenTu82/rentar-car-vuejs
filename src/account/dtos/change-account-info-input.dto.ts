/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsNotEmpty,
  MaxLength,
} from 'class-validator'

export default class ChangeAccountInfoInput {
  id: string | undefined
  // gender: number | 1

  @MaxLength(20)
  @IsNotEmpty({
    message:"姓を入力してください。"
  })
    last_name: string | undefined

  @MaxLength(20)
  @IsNotEmpty({
    message:"名を入力してください。"
  })
    first_name: string | undefined

  @MaxLength(20)
  @IsNotEmpty({
    message:"姓を入力してください。"
  })
    last_name_kana: string | undefined

  @MaxLength(20)
  @IsNotEmpty({
    message:"名を入力してください。"
  })
    first_name_kana: string | undefined

  // @MaxLength(100, {
  //   message:"住所100文字を超えることはできません。"
  // })
  // @IsNotEmpty({
  //   message:"住所を入力してください。"
  // })
  //   address1: string | undefined

  @IsNotEmpty({
    message:"生年月日を入力してください。"
  })
    birthday: string | undefined
}
