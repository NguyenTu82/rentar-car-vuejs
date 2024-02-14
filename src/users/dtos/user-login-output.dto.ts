import { BaseOutput } from '~/common/dtos/base-output.dto';
import { UserInfo } from './user-info.dto';

export class UserLoginOutput extends BaseOutput {
  data: {
    user: UserInfo
    authorisation: {
      AccessToken: string
      IdToken: string
      RefreshToken: string
      TokenType: string
      ExpiresIn: number
    }
  } | null = null
}
