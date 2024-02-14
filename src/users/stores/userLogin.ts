import { acceptHMRUpdate, defineStore } from 'pinia';
import { BaseOutput, STATUS } from '~/common/dtos/base-output.dto';
import { UserLoginInput } from '../dtos/user-login-input.dto';
import { UserResetPasswordInput } from '../dtos/user-resetpassword-input.dto';
import { useUserStore } from './user';

import UserService from '~/users/services/UserService';
import { useUserInfoStore } from '~/account/stores/UserInfoStore';

export enum LOGIN_STEPS {
	LOGIN = 'LOGIN',
	SEND_EMAIL = 'SEND_EMAIL',
	RESET_PASSWORD = 'RESET_PASSWORD',
	FINAL = 'FINAL',
}

export const useUserLoginStore = defineStore('userLogin', () => {
	const userStore = useUserStore();
	const userInfoStore = useUserInfoStore();
	const currentStep = ref<LOGIN_STEPS>(LOGIN_STEPS.SEND_EMAIL);
	const data = ref<BaseOutput>(new BaseOutput());
	const emailInput = ref('');
	async function login(input: UserLoginInput) {
		const output = await UserService.login(input);
		data.value = output;

		if (output.status === STATUS.SUCCESS) {
			const { AccessToken, RefreshToken } = output.data?.authorisation ?? {};
			userStore.changeToken(AccessToken ?? '', RefreshToken ?? '');
			userInfoStore.getUserInfo();
		}
		return output;
	}

	async function sendEmail(email: string) {
		emailInput.value = email;
		const output = await UserService.forgotPassword(email);
		data.value = output;

		if (output.status === STATUS.SUCCESS) {
			const { AccessToken, RefreshToken } = output.data?.authorisation ?? {};
			userStore.changeToken(AccessToken ?? '', RefreshToken ?? '');
			currentStep.value = LOGIN_STEPS.RESET_PASSWORD;
		}
	}

	async function resetPassword(input: UserResetPasswordInput) {
		input.email = emailInput.value;
		const output = await UserService.resetPassword(input);
		data.value = output;

		if (output.status === STATUS.SUCCESS) {
			const { AccessToken, RefreshToken } = output.data?.authorisation ?? {};
			userStore.changeToken(AccessToken ?? '', RefreshToken ?? '');
			currentStep.value = LOGIN_STEPS.FINAL;
		}
	}

	async function resendCode() {
		const output = await UserService.forgotPassword(emailInput.value);
		if (output.status === STATUS.SUCCESS) {
			const { AccessToken, RefreshToken } = output.data?.authorisation ?? {};
			userStore.changeToken(AccessToken ?? '', RefreshToken ?? '');
		}
	}

	function changeStep(step: LOGIN_STEPS) {
		currentStep.value = step;
	}

	return {
		currentStep,
		data,
		login,
		sendEmail,
		resetPassword,
		resendCode,
		changeStep,
	};
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserLoginStore, import.meta.hot));
