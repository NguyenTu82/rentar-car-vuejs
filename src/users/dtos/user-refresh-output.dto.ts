import { BaseOutput } from '~/common/dtos/base-output.dto';
import { UserInfo } from './user-info.dto';

export class UserRefresh extends BaseOutput {
  data: {
    user: UserInfo
    data: {
      AccessToken: string
      IdToken: string
      RefreshToken: string
      TokenType: string
      ExpiresIn: number
    }
  } | null = null
}
