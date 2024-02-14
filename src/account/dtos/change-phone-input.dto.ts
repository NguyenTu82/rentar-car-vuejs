import {
  IsNotEmpty,
  Length,
  MinLength
} from 'class-validator'

export default class ChangePhoneInput {
  @Length(11, 11, {
    message:"携帯電話番号は11桁で入力してください。"
  })
  @MinLength(11, {
    message: '携帯電話番号は11桁で入力してください。',
  })
  @IsNotEmpty({
    message:"電話番号を入力してください。"
  })
    phone: string | undefined
}
