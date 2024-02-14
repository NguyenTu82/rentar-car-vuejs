import { BaseOutput } from '~/common/dtos/base-output.dto';
import { UserInfo } from './user-info.dto';

export class UserInfoOutput extends BaseOutput {
	data: UserInfo | null = null;
}
