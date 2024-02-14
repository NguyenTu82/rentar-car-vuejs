import { BaseOutput } from '~/common/dtos/base-output.dto';
import BaseService, { METHODS } from '~/common/services/BaseService';
import { UserCreateInput } from '../dtos/user-create-input.dto';
import { UserInfoOutput } from '../dtos/user-info-output.dto';
import { UserLoginInput } from '../dtos/user-login-input.dto';
import { UserLoginOutput } from '../dtos/user-login-output.dto';
import { UserRefresh } from '../dtos/user-refresh-output.dto';
import { UserResetPasswordInput } from '../dtos/user-resetpassword-input.dto';
import { UserVerifyEmailInput } from '../dtos/user-verity-email-input.dto';
import { UserVerifyEmailOutput } from '../dtos/user-verity-email-output.dto';
import { UserVerifyPhoneInput, VERIFY_TYPE } from '../dtos/user-verity-phone-input.dto';

class UserService extends BaseService {
	constructor(prefix: string) {
		super(prefix);
	}

	refresh(email: string, refresh_token: string): Promise<UserRefresh> {
		return this.performRequest(METHODS.POST, 'refresh', {
			email,
			refresh_token,
		});
	}

	load(): Promise<UserInfoOutput> {
		return this.performRequest(METHODS.GET, 'user_info');
	}

	login(input: UserLoginInput): Promise<UserLoginOutput> {
		return this.performRequest(METHODS.POST, 'login', input);
	}

	logout(): Promise<BaseOutput> {
		return this.performRequest(METHODS.POST, 'logout');
	}

	forgotPassword(email: string): Promise<BaseOutput> {
		return this.performRequest(METHODS.POST, 'send_email_code_reset_password', {
			email,
		});
	}

	resetPassword(input: UserResetPasswordInput): Promise<BaseOutput> {
		return this.performRequest(METHODS.POST, 'reset_password', input);
	}

	/**
	 * Register
	 * Step 1: Do this first to verify email
	 * @param input
	 * @returns
	 */
	create(input: UserCreateInput): Promise<BaseOutput> {
		return this.performRequest(METHODS.POST, 'send_email_code', input);
	}

	/**
	 * Step 2: Verify email
	 * @param input
	 * @returns
	 */
	verifyEmail(input: UserVerifyEmailInput): Promise<UserVerifyEmailOutput> {
		return this.performRequest(METHODS.POST, 'verify_email_code', input).then((result) => {
			return <UserVerifyEmailOutput>result;
		});
	}

	/**
	 * Step 3: Send sms to verify phone number
	 * @param phone
	 * @returns
	 */
	sendSMSCode(phone: string): Promise<BaseOutput> {
		return this.performRequest(METHODS.POST, 'send_sms_code', {
			phone,
		});
	}

	/**
	 * Last step: Verify phone and setup some user infos
	 * @param input
	 * @returns
	 */
	verifyPhone(input: UserVerifyPhoneInput): Promise<BaseOutput> {
		input.type = VERIFY_TYPE.CREATE_ACCOUNT;
		return this.performRequest(METHODS.POST, 'verify_sms_code', input);
	}
}

export default new UserService('');
