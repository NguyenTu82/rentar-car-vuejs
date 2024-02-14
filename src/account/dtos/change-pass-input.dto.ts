import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator'
import { IsTheSameAs } from '~/common/dtos/validate.dto'

export default class ChangePassInput {
  @IsNotEmpty({
    message: "パスワードを入力してください。"
  })
    old_password: string | undefined

  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[[\],.:?\/!@#$%*+=_-]).{8,100}$/, {
    message:
      '8文字以上かつ半角英字、半角数字、半角記号を組み合わせて設定してください',
  })
  @Length(8, 100, {
    message:"8文字以上かつ半角英字、半角数字、半角記号を組み合わせて設定してください"
  })
  @IsNotEmpty({
    message: "パスワードを入力してください。"
  })
    new_password: string = ''

  @IsTheSameAs('new_password', {
    message: "確認パスワードと新しいパスワードは一致する必要があります。"
  })
  @IsNotEmpty({
      message: "パスワードを入力してください。"
  })
    confirm_password: string | undefined
}
