import { acceptHMRUpdate, defineStore } from 'pinia';
import { BaseOutput, STATUS } from '~/common/dtos/base-output.dto';
import { toFormattedDate, toJapanesePhoneNumber } from '~/common/utils/formatter';
import { UserCreateInput } from '../dtos/user-create-input.dto';
import { UserInfo } from '../dtos/user-info.dto';
import { UserRegisterInput } from '../dtos/user-register-input.dto';
import { UserVerifyEmailInput } from '../dtos/user-verity-email-input.dto';
import { UserVerifyPhoneInput } from '../dtos/user-verity-phone-input.dto';
import UserService from '../services/UserService';
import { useUserStore } from './user';

export enum STEPS {
	CREATE = 'CREATE',
	VERIFY_EMAIL = 'VERIFY_EMAIL',
	SEND_SMS = 'SEND_SMS',
	VERIFY_SMS = 'VERIFY_SMS',
	FINAL = 'FINAL',
}

export const useUserCreateStore = defineStore('userCreate', () => {
	const userStore = useUserStore();
	const currentStep = ref<STEPS>(STEPS.CREATE);
	const data = ref<BaseOutput>(new BaseOutput());
	const policy = ref<BaseOutput>(new BaseOutput());
	const createInput = ref<UserCreateInput>(new UserCreateInput());
	const verifyEmailInput = ref<UserVerifyEmailInput>(new UserVerifyEmailInput());
	const verifyPhoneInput = ref<UserVerifyPhoneInput>(new UserVerifyPhoneInput());
	const checkSendCode = ref(false)
	async function createUser(input: UserCreateInput) {
		createInput.value = input;

		const output = await UserService.create(createInput.value);
		data.value = output;
		if(output.status){
			checkSendCode.value = false;
		}
		if (output.status === STATUS.SUCCESS) {
			verifyEmailInput.value.email = createInput.value.email;
			verifyEmailInput.value.password = createInput.value.password1;
			currentStep.value = STEPS.VERIFY_EMAIL;
		}
	}

	async function verifyEmail(code: string) {
		verifyEmailInput.value.email_verify_code = code;

		const output = await UserService.verifyEmail(verifyEmailInput.value);
		if(output.status){
			checkSendCode.value = false;
		}
		data.value = output;
		if (output.status === STATUS.SUCCESS) {
			currentStep.value = STEPS.SEND_SMS;
			userStore.token = output.data?.authorisation.AccessToken ?? '';
		}
	}

	async function sendSMSCode(input: UserRegisterInput) {
		const phone = toJapanesePhoneNumber(input.phone);
		const birthday = toFormattedDate(input.birthday);
		verifyPhoneInput.value = {
			...input,
			phone,
			birthday,
			sms_verify_code: '',
		};

		const output = await UserService.sendSMSCode(phone);
		if(output.status){
			checkSendCode.value = false;
		}
		data.value = output;
		if (output.status === STATUS.SUCCESS) {
			currentStep.value = STEPS.VERIFY_SMS;
		}
	}

	async function verifyPhone(code: string) {
		verifyPhoneInput.value.sms_verify_code = code;
           
		const output = await UserService.verifyPhone(verifyPhoneInput.value);
		if(output.status){
			checkSendCode.value = false;
		}
		data.value = output;
		if (output.status === STATUS.SUCCESS) {
			currentStep.value = STEPS.FINAL;
		}
	}

	function changeStep(step: STEPS) {
		currentStep.value = step;
	}

	watch(
		userStore.user,
		(newValue: UserInfo) => {
			switch (newValue?.reg_step) {
				case 1:
					changeStep(STEPS.SEND_SMS);
					break;
				case 3:
				default:
					changeStep(STEPS.CREATE);
					break;
			}
		},
		{ immediate: true },
	);

	return {
		checkSendCode,
		currentStep,
		createInput,
		verifyEmailInput,
		verifyPhoneInput,
		data,
		policy,
		changeStep,
		createUser,
		verifyEmail,
		sendSMSCode,
		verifyPhone,
	};
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserCreateStore, import.meta.hot));
