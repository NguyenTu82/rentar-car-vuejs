import { acceptHMRUpdate, defineStore } from 'pinia';
import type { Ref } from 'vue';
import UserInfoService from '~/account/services/UserInfoService';
import { InsuranceOutput } from '~/booking/dtos/insurance-output.dto';
import { BaseOutput, STATUS } from '~/common/dtos/base-output.dto';
import { validateInput } from '~/common/dtos/validate.dto';
import { TAB_ACCOUNT } from '~/common/utils/constant';
import { toJapanesePhoneNumber } from '~/common/utils/formatter';
import ChangeAccountInfoInput from '../dtos/change-account-info-input.dto';
import ChangeCodeInput from '../dtos/change-code-input.dto';
import ChangePassInput from '../dtos/change-pass-input.dto';
import ChangePhoneInput from '../dtos/change-phone-input.dto';

export const useUserInfoStore = defineStore(
	'UserInfoStore',
	() => {
		const userInfo = ref<BaseOutput>(new BaseOutput());
		const errorValidate: Ref<any> = ref('');
		const errorValidateGetUser: Ref<any> = ref('');
		const successValidate: Ref<any> = ref('');
		const displayError: Ref<any> = ref(true);
		const checkWithdrawal: Ref<any> = ref(false);
		const checkUpdate: Ref<any> = ref(false);
		const tabAccount = ref<any>(TAB_ACCOUNT.FIRST);
		const selectedOptionLeaveGuild = ref<InsuranceOutput[]>([]);
		const listProblem : Ref<any> = ref([])
		const reasonLeaving: Ref<any> = ref('')
		const reasonLeavingRankMax: Ref<any> = ref({})

  async function getListProblemAll() {
		const res = await UserInfoService.getlistProblem();
		if (res?.status === STATUS.SUCCESS) {
      const listData = [...res.data];
			listProblem.value = listData;
			reasonLeavingRankMax.value = listData[listData.length - 1];
		}
    }
    function resetDataProblem(){
      selectedOptionLeaveGuild.value = []
      reasonLeaving.value = ''
    }
		async function getUserInfo() {
			errorValidateGetUser.value = '';
			const data = await UserInfoService.getUserInfo()
				.then((result) => {
					if (result?.status === STATUS.ERROR) {
						errorValidateGetUser.value = result?.message;
					}
					return result;
				})
				.catch((reason) => {
					errorValidateGetUser.value = reason;
				});
			onDisplayError(true);
			if (data?.status === STATUS.SUCCESS) userInfo.value = data;
		}

		async function postPhoneVerifyCode(data: ChangePhoneInput) {
			const validate = await validateInput(ChangePhoneInput, data);
			if (validate.errors) {
				return validate;
			}
			data.phone = toJapanesePhoneNumber(data?.phone);
			errorValidate.value = '';
			successValidate.value = '';
			await UserInfoService.postSendSmsCode(data)
				.then((result) => {
					resStatus(result?.status, result?.message);
					return result;
				})
				.catch((reason) => {
					errorValidate.value = reason;
				});
		}

		async function postEditChangePhone(data: ChangeCodeInput) {
			errorValidate.value = '';
			successValidate.value = '';

			data.phone = toJapanesePhoneNumber(data?.phone);
			await UserInfoService.changePhone(data)
				.then((result) => {
					if (result?.status === STATUS.SUCCESS) {
						checkUpdate.value = true;
					} else {
						checkUpdate.value = false;
						errorValidate.value = result?.message;
					}
				})
				.catch((reason) => {
					errorValidate.value = reason;
				});
		}

		async function postEditChangePassInput(data: ChangePassInput) {
			errorValidate.value = '';
			successValidate.value = '';
			await UserInfoService.changePass(data)
				.then((result) => {
					if (result?.status === STATUS.SUCCESS) {
						checkUpdate.value = true;
					} else {
						checkUpdate.value = false;
						errorValidate.value = result?.message;
					}
				})
				.catch((reason) => {
					errorValidate.value = reason;
				});
		}

		async function postChangeAccInfo(data: ChangeAccountInfoInput) {
			errorValidate.value = '';
			successValidate.value = '';
			await UserInfoService.changeAccountInfo(data)
				.then((result) => {
					if (result?.status === STATUS.SUCCESS) {
						checkUpdate.value = true;
					} else {
						checkUpdate.value = false;
						errorValidate.value = result?.message;
					}
				})
				.catch((reason) => {
					errorValidate.value = reason;
				});
		}

		async function postChangeGender(data: any) {
			errorValidate.value = '';
			successValidate.value = '';
			await UserInfoService.changeGender(data)
				.then((result) => {
					if (result?.status === STATUS.SUCCESS) {
						checkUpdate.value = true;
					} else {
						checkUpdate.value = false;
						errorValidate.value = result?.message;
					}
				})
				.catch((reason) => {
					errorValidate.value = reason;
				});
		}

		async function postWithDrawal() {
			errorValidate.value = '';
			successValidate.value = '';
      let data = {
        withdrawal_reason : JSON.stringify(selectedOptionLeaveGuild.value),
        withdrawal_reason_explain : reasonLeaving.value
      }
			await UserInfoService.withdraw(data)
				.then((result) => {
					if (result?.status === STATUS.SUCCESS) {
						checkWithdrawal.value = true;
					} else {
						checkWithdrawal.value = false;
						errorValidate.value = result?.message;
					}
				})
				.catch((reason) => {
					errorValidate.value = reason;
				});
		}

		async function disableWithdrawal() {
			checkWithdrawal.value = false;
		}

		async function validateForm(data: any, objectValidate: any) {
			const validate = await validateInput(objectValidate, data);
			if (validate.errors) {
				return validate;
			}
		}

		function resStatus(status: any, message: any) {
			switch (status) {
				case STATUS.ERROR:
					errorValidate.value = message;
					break;
				case STATUS.SUCCESS:
					successValidate.value = message;
					break;

				default:
					break;
			}
		}

		async function onDisplayError(bol: boolean) {
			return (displayError.value = bol);
		}

		const setCheckWithdrawal = (newValue: boolean) => {
			checkWithdrawal.value = newValue;
		};

		const setCheckUpdate = (newValue: boolean) => {
			checkUpdate.value = newValue;
		};

		const setTabAccount = (value: any) => {
			tabAccount.value = value;
		};

		return {
			userInfo,
			errorValidate,
			errorValidateGetUser,
			successValidate,
			checkWithdrawal,
			checkUpdate,
			tabAccount,
			getUserInfo,
			postPhoneVerifyCode,
			postEditChangePhone,
			postEditChangePassInput,
			postChangeAccInfo,
			postWithDrawal,
			validateForm,
			onDisplayError,
			disableWithdrawal,
			setCheckWithdrawal,
			setCheckUpdate,
			setTabAccount,
			postChangeGender,
			reasonLeaving,
			listProblem,
			selectedOptionLeaveGuild,
			getListProblemAll,
			resetDataProblem,
			reasonLeavingRankMax
		};
	},
	{
		persist: true,
	},
);

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserInfoStore, import.meta.hot));
