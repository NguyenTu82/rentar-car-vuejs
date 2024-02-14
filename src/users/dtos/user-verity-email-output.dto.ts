import { BaseOutput } from '~/common/dtos/base-output.dto'

export class UserVerifyEmailOutput extends BaseOutput {
  data: {
    user: {
      email: string
      email_verified_at: string
      reg_step: number
      id: string
      updated_at: string
      created_at: string
    }
    authorisation: {
      AccessToken: string
      IdToken: string
      RefreshToken: string
      TokenType: string
      ExpiresIn: number
    }
  } | null = null
}
