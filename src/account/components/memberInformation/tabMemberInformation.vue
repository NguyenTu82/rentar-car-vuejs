<script setup lang="ts">
import type { Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import { useUserInfoStore } from '~/account/stores/UserInfoStore';
import { useCreditInfoStore } from '~/account/stores/CreditInfoStore';
import { formatDay, formatDayJP, checkPasteNumber, checkPasteHiraganaHaftWidth, checkPasteKatakanaFullWidth, getMaxBirthday } from '~/common/utils/common';
import { AUTHEN, NUMBER, TIME } from '~/common/utils/constant';
import { addZero } from '~/common/utils/common';
import ChangePhoneInput from '../../dtos/change-phone-input.dto';
import ChangeCodeInput from '../../dtos/change-code-input.dto';
import ChangePassInput from '../../dtos/change-pass-input.dto';
import ChangeAccountInfoInput from '../../dtos/change-account-info-input.dto';
const router = useRouter();
const { t } = useI18n();
const userInforStore = useUserInfoStore();
const creditInforStore = useCreditInfoStore();
const { userInfo, errorValidate, errorValidateGetUser } = storeToRefs(userInforStore);
const { creditInfo } = storeToRefs(creditInforStore);
const selectGender = ref<any>(NUMBER.FIRST)
const dataUserInfor = computed(() => {
	if (userInfo.value?.data?.gender) {
		selectGender.value = userInfo.value.data.gender
	}
	return userInfo.value.data || '';
});
const numCredit = computed(() => {
	return creditInfo.value?.data?.length || '';
});
const checkEditPass: Ref<any> = ref(true);
const checkChangePhone: Ref<any> = ref(true);
const checkChangeAddress: Ref<any> = ref(true);
const checkBirthDay: Ref<any> = ref(true);
const checkGender: Ref<any> = ref(true);
const phone = ref<any>('');
const sms_verify_code = ref<any>('');
const validatePhone: Ref<any> = ref('');
const validateCode: Ref<any> = ref('');
const old_password = ref('');
const new_password = ref('');
const confirm_password = ref('');
const validatePassword: Ref<any> = ref('');
const validateNewPassword: Ref<any> = ref('');
const validateConfirmPassword: Ref<any> = ref('');
const last_name = ref('');
const validateLastName = ref('');
const first_name = ref('');
const validateFirstName = ref('');
const last_name_kana = ref('');
const validateLastNameKana = ref('');
const first_name_kana = ref('');
const validateFirstNameKana = ref('');
const address1 = ref('');
const birthday = ref('');
// const validateAddress: Ref<any> = ref('');
const validateBirthDay: Ref<any> = ref('');
const statusChange = ref('');
const disableButton = ref<boolean>(false);
const timerCount = ref<number>(20);
const disableButtonSendSMS = ref<boolean>(false);
const clickButton = ref(true);
const clickButtonUpdatePhone = ref(true);
const isShowWithdrawModal = ref(false);
const isShowModalUpdate = ref(false);
const isShowModalSendCode = ref(false);
const textError = ref('');
const removeInternal = ref<any>(false);
const textEditAddress = ref<any>(t("user_infor.want_to_change"));
const buttonCancel  = ref(t("button.ok"))
const windowWidth = ref<any>(window.innerWidth)
const btnHidden = ref<any>(false);
const showLoadding = ref(false);
const listProvince = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都',
'神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県',
'和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'
]
const selectProvince = ref('');
onMounted(() => {
	if (windowWidth.value <= 480) {
		btnHidden.value = true
	}
	getUserInfo();
	creditInforStore.getCreditInfo();
});
onMounted(() => {
	selectProvince.value = dataUserInfor.value.province
});
watch(userInforStore, () => {
	phone.value = phone.value || addZero(dataUserInfor.value?.phone);
	last_name.value = dataUserInfor.value?.last_name;
	first_name.value = dataUserInfor.value?.first_name;
	last_name_kana.value = dataUserInfor.value?.last_name_kana;
	first_name_kana.value = dataUserInfor.value?.first_name_kana;
	address1.value = dataUserInfor.value?.address1;
	birthday.value = formatDay(dataUserInfor.value?.birthday);
});

watch(errorValidate, () => {
	textError.value = errorValidate.value;
});

watch(errorValidateGetUser, () => {
	textError.value = errorValidateGetUser.value;
});

watch(errorValidateGetUser, () => {
	if (errorValidateGetUser.value !== AUTHEN.MESSAGE) {
		isShowModalSendCode.value = true;
	}
});
const goProblemLeaveGuild = async () =>{
	await userInforStore.getListProblemAll();
	router.push({
		path: '/account/leaveguild'
	})
}
const _validateAddress = async () => {
	const data = {
		last_name: last_name.value,
		first_name: first_name.value,
		last_name_kana: checkPasteKatakanaFullWidth(last_name_kana.value),
		first_name_kana: checkPasteKatakanaFullWidth(first_name_kana.value),
		// address1: address1.value,
		birthday: birthday.value,
	};

	const res = await userInforStore.validateForm(data, ChangeAccountInfoInput);
	if (res?.errors) {
		validateLastName.value = res?.errors?.last_name;
		validateFirstName.value = res?.errors?.first_name;
		validateLastNameKana.value = res?.errors?.last_name_kana;
		validateFirstNameKana.value = res?.errors?.first_name_kana;
		// validateAddress.value = res?.errors?.address1;
		validateBirthDay.value = res?.errors?.birthday;
	} else {
		validateLastName.value = '';
		validateFirstName.value = '';
		validateLastNameKana.value = '';
		validateFirstNameKana.value = '';
		// validateAddress.value = '';
		// validateBirthDay.value = '';
	}
};

const getUserInfo = async () => {
	await userInforStore.getUserInfo();
};

const onClickEdit = (): any => {
	_handleEmptyDefault();
	handleTimeCountDown(true);
	checkEditPass.value = false;
	checkChangePhone.value = true;
	checkChangeAddress.value = true;
	checkBirthDay.value = true;
	clickButton.value = true;
	clickButtonUpdatePhone.value = true;
	checkGender.value = true
};
const onClickChangePhone = (): any => {
	_handleEmptyDefault();
	checkEditPass.value = true;
	checkChangePhone.value = false;
	checkChangeAddress.value = true;
	checkBirthDay.value = true;
	clickButton.value = true;
	clickButtonUpdatePhone.value = true;
	checkGender.value = true
};
const onClickChangeBirthDay = (): any => {
	_handleEmptyDefault();
	handleTimeCountDown(true);
	checkEditPass.value = true;
	checkChangePhone.value = true;
	checkChangeAddress.value = true;
	checkBirthDay.value = false;
	clickButton.value = true;
	clickButtonUpdatePhone.value = true;
	checkGender.value = true
};
const onClickChangeGender = (): any => {
	_handleEmptyDefault();
	handleTimeCountDown(true);
	checkEditPass.value = true;
	checkChangePhone.value = true;
	checkChangeAddress.value = true;
	checkBirthDay.value = true;
	clickButton.value = true;
	clickButtonUpdatePhone.value = true;
	checkGender.value = false
};

const _handleEmptyDefault = () => {
	phone.value = addZero(dataUserInfor.value?.phone) || '';
	sms_verify_code.value = '';
	address1.value = dataUserInfor.value?.address1 || '';
	old_password.value = '';
	new_password.value = '';
	confirm_password.value = '';
	validatePhone.value = '';
	validateCode.value = '';
	validatePassword.value = '';
	validateNewPassword.value = '';
	validateConfirmPassword.value = '';
	// validateAddress.value = '';
	validateBirthDay.value = '';
	last_name.value = dataUserInfor.value?.last_name || '';
	validateLastName.value = '';
	first_name.value = dataUserInfor.value?.first_name || '';
	validateFirstName.value = '';
	last_name_kana.value = dataUserInfor.value?.last_name_kana || '';
	validateLastNameKana.value = '';
	first_name_kana.value = dataUserInfor.value?.first_name_kana || '';
	validateFirstNameKana.value = '';
};

const handleTimeCountDown = (cancel: any) => {
	if (timerCount.value === TIME.TIME_20 && !cancel) {
		removeInternal.value = false;
		disableButtonSendSMS.value = true;
		timerCount.value = timerCount.value - 1;

		let internalTime = setInterval(() => {
			if (timerCount.value) {
				timerCount.value = timerCount.value - 1;
				if (removeInternal.value) {
					clearCountTime(internalTime);
					removeInternal.value = false;
				}
			} else if (timerCount.value <= NUMBER.ZERO) {
				clearCountTime(internalTime);
			}
		}, 1000);
	} else {
		removeInternal.value = true;
	}
};
const clearCountTime = (time: any) => {
	clickButton.value = true;
	disableButtonSendSMS.value = false;
	timerCount.value = TIME.TIME_20;
	clearInterval(time);
};
const onClickPhoneVerifyCode = async (e: any) => {
	e.preventDefault();
	if (!phone.value) {
		keyupChangeInfo('ChangePhone');
		return;
	}
	if (clickButton.value) {
		clickButton.value = false;
		const data = {
			phone: phone.value,
		};
		const res = await userInforStore.postPhoneVerifyCode(data);

		if (res?.errors) {
			validatePhone.value = res?.errors?.phone;
		} else {
			validatePhone.value = '';
		}

		if (errorValidate.value) {
			isShowModalSendCode.value = true;
			clickButton.value = true;
		} else if (validatePhone.value === '' && !res?.errors) {
			handleTimeCountDown(false);
		}
	}
};

const onClickEditChangePhone = async () => {
	if (clickButtonUpdatePhone.value) {
		clickButtonUpdatePhone.value = false;
		const data: any = {
			phone: phone.value,
			sms_verify_code: sms_verify_code.value,
			type: 2,
		};

		await userInforStore.postEditChangePhone(data);
		userInforStore.onDisplayError(false);
		getUserInfo();
		phone.value = '';
		sms_verify_code.value = '';
		validatePhone.value = '';
		validateCode.value = '';
		disableButton.value = false;
		statusChange.value = '';
		checkEditPass.value = true;
		checkChangePhone.value = true;
		checkChangeAddress.value = true;
		checkBirthDay.value = true;
		checkGender.value = true
		clickButtonUpdatePhone.value = true;
	}
};

const onClickEditChangePassword = async () => {
	if (clickButton.value) {
		clickButton.value = false;
		const data = {
			old_password: old_password.value.trim(),
			new_password: new_password.value.trim(),
			confirm_password: confirm_password.value.trim(),
		};

		await userInforStore.postEditChangePassInput(data);
		userInforStore.onDisplayError(false);
		old_password.value = '';
		new_password.value = '';
		confirm_password.value = '';
		validatePassword.value = '';
		validateNewPassword.value = '';
		validateConfirmPassword.value = '';
		statusChange.value = '';
		disableButton.value = false;
		checkEditPass.value = true;
		checkChangePhone.value = true;
		checkChangeAddress.value = true;
		checkBirthDay.value = true;
		checkGender.value = true
		clickButton.value = true;
	}
};

const onClickEditChangeBirthDay = async () => {
	
	console.log('123 clickButton',selectProvince.value)
	if (clickButton.value) {
		clickButton.value = false;
		const day = formatDay(birthday.value);
		const data: any = {
			last_name: last_name.value,
			first_name: first_name.value,
			last_name_kana: last_name_kana.value,
			first_name_kana: first_name_kana.value,
			address1: address1.value,
			birthday: day,
			gender: selectGender.value,
			province:  selectProvince.value,
		};

		await userInforStore.postChangeAccInfo(data);
		userInforStore.onDisplayError(false);
		getUserInfo();
		statusChange.value = '';
		disableButton.value = false;
		checkEditPass.value = true;
		checkChangePhone.value = true;
		checkChangeAddress.value = true;
		checkBirthDay.value = true;
		checkGender.value = true
		clickButton.value = true;
	}
};

const _handleEditChangePhone = async () => {
	if (clickButton.value) {
		clickButton.value = false;
		const data: any = {
			gender: selectGender.value,
		};

		await userInforStore.postChangeGender(data);
		userInforStore.onDisplayError(false);
		getUserInfo();
		statusChange.value = '';
		disableButton.value = false;
		checkEditPass.value = true;
		checkChangePhone.value = true;
		checkChangeAddress.value = true;
		checkBirthDay.value = true;
		checkGender.value = true
		clickButton.value = true;
	}
}

const onClickCancelChange = (): any => {
	handleTimeCountDown(true);
	validatePhone.value = '';
	validateCode.value = '';
	validatePassword.value = '';
	validateNewPassword.value = '';
	validateConfirmPassword.value = '';
	// validateAddress.value = '';
	validateBirthDay.value = '';
	statusChange.value = '';
	disableButton.value = false;
	checkEditPass.value = true;
	checkChangePhone.value = true;
	checkChangeAddress.value = true;
	checkBirthDay.value = true;
	checkGender.value = true
	phone.value = addZero(dataUserInfor.value?.phone);
	sms_verify_code.value = '';
	address1.value = dataUserInfor.value?.address1;
	birthday.value = formatDay(dataUserInfor.value?.birthday);
	old_password.value = '';
	new_password.value = '';
	confirm_password.value = '';
	checkBirthDay.value = true;
	clickButtonUpdatePhone.value = true;
	selectGender.value = dataUserInfor.value?.gender
	selectProvince.value = dataUserInfor.value.province
};

watch(phone, (newValue: any) => {
	keyupChangeInfo('ChangePhone');
	phone.value = checkPasteNumber(newValue);
});

watch(sms_verify_code, (newValue: any) => {
	sms_verify_code.value = checkPasteNumber(newValue);
});

watch(last_name, (newValue: any) => {
	last_name.value = newValue;
});

watch(first_name, (newValue: any) => {
	first_name.value = newValue;
});

watch(last_name_kana, (newValue: any) => {
	last_name_kana.value = checkPasteKatakanaFullWidth(newValue);
});

watch(first_name_kana, (newValue: any) => {
	first_name_kana.value = checkPasteKatakanaFullWidth(newValue);
});

const keyupChangeInfo = async (dto: any) => {
	let data: any = {};
	let validateInput: any = '';
	disableButton.value = true;

	switch (dto) {
		case 'ChangePhone':
			phone.value = checkPasteNumber(phone.value);
			data = {
				phone: phone.value,
			};
			validateInput = ChangePhoneInput;
			break;

		case 'ChangeCode':
			phone.value = checkPasteNumber(phone.value);
			sms_verify_code.value = checkPasteNumber(sms_verify_code.value);
			data = {
				phone: phone.value,
				sms_verify_code: sms_verify_code.value,
			};
			validateInput = ChangeCodeInput;
			break;

		case 'ChangePassOld':
			data = {
				old_password: old_password.value.trim(),
			};
			validateInput = ChangePassInput;
			break;

		case 'ChangePassNew':
			data = {
				new_password: new_password.value.trim(),
			};
			validateInput = ChangePassInput;
			break;

		case 'ChangePassNewConfirm':
			data = {
				confirm_password: confirm_password.value.trim(),
			};
			validateInput = ChangePassInput;
			break;

		case 'ChangeLastName':
			data = {
				last_name: last_name.value,
			};
			validateInput = ChangeAccountInfoInput;
			break;

		case 'ChangeFirstName':
			data = {
				first_name: first_name.value,
			};
			validateInput = ChangeAccountInfoInput;
			break;

		case 'ChangeLastNameKana':
			data = {
				last_name_kana: checkPasteKatakanaFullWidth(last_name_kana.value),
			};
			validateInput = ChangeAccountInfoInput;
			break;

		case 'ChangeFirstNameKana':
			data = {
				first_name_kana: checkPasteKatakanaFullWidth(first_name_kana.value),
			};
			validateInput = ChangeAccountInfoInput;
			break;

		case 'ChangeAccountInfo':
			data = {
				// address1: address1.value,
				birthday: birthday.value,
			};
			validateInput = ChangeAccountInfoInput;
			break;

		default:
			break;
	}

	const res = await userInforStore.validateForm(data, validateInput);

	switch (dto) {
		case 'ChangePhone':
			if (res?.errors) {
				validatePhone.value = res?.errors?.phone || '';
			} else {
				validatePhone.value = '';
			}
			break;

		case 'ChangeCode':
			if (res?.errors) {
				validateCode.value = res?.errors?.sms_verify_code || '';
			} else {
				validateCode.value = '';
			}
			break;

		case 'ChangePassOld':
			if (res?.errors) {
				validatePassword.value = res?.errors?.old_password || '';
			} else {
				validatePassword.value = '';
			}
			break;

		case 'ChangePassNew':
			if (res?.errors) {
				validateNewPassword.value = res?.errors?.new_password || '';
			} else {
				validateNewPassword.value = '';
			}
			break;

		case 'ChangePassNewConfirm':
			if (res?.errors) {
				if (new_password.value === confirm_password.value) {
					validateConfirmPassword.value = '';
				} else {
					validateConfirmPassword.value = res?.errors?.confirm_password || '';
				}
			} else {
				validateConfirmPassword.value = '';
			}
			break;

		case 'ChangeLastName':
			if (res?.errors) {
				validateLastName.value = res?.errors?.last_name || '';
			} else {
				validateLastName.value = '';
			}
			break;

		case 'ChangeFirstName':
			if (res?.errors) {
				validateFirstName.value = res?.errors?.first_name || '';
			} else {
				validateFirstName.value = '';
			}
			break;

		case 'ChangeLastNameKana':
			if (res?.errors) {
				validateLastNameKana.value = res?.errors?.last_name_kana || '';
			} else {
				validateLastNameKana.value = '';
			}
			break;

		case 'ChangeFirstNameKana':
			if (res?.errors) {
				validateFirstNameKana.value = res?.errors?.first_name_kana || '';
			} else {
				validateFirstNameKana.value = '';
			}
			break;

		case 'ChangeAccountInfo':
			// if (res?.errors) {
			// 	validateAddress.value = res?.errors?.address1;
			// 	// validateBirthDay.value = res?.errors?.birthday;
			// } else {
			// 	validateAddress.value = '';
			// 	// validateBirthDay.value = '';
			// }
			break;

		default:
			break;
	}
};

const keyupChangeBirth = (e: any) => {
	if (e.key === 'Delete' || e.key === 'Backspace') {
		return e.preventDefault();
	}
};

const handleInternal = () => {
	if (new Date(birthday.value).getTime() > new Date(getMaxBirthday()).getTime()) {
		validateBirthDay.value = t('validate.birtday')
	} else {
		validateBirthDay.value = ''
	}
}

const onClickPhoneChangeStatus = async () => {
	statusChange.value = 'updatePhone';
	const data: any = {
		phone: phone.value,
		sms_verify_code: sms_verify_code.value,
	};
	const validateInput: any = ChangeCodeInput;

	const res = await userInforStore.validateForm(data, validateInput);

	if (res?.errors) {
		validatePhone.value = res?.errors?.phone;
		validateCode.value = res?.errors?.sms_verify_code;
	} else {
		validatePhone.value = '';
		validateCode.value = '';
		isShowModalUpdate.value = true;
	}
};

const onClickPassChangeStatus = async () => {
	statusChange.value = 'updatePassword';
	const data: any = {
		old_password: old_password.value.trim(),
		new_password: new_password.value.trim(),
		confirm_password: confirm_password.value.trim(),
	};
	const validateInput: any = ChangePassInput;

	const res = await userInforStore.validateForm(data, validateInput);

	if (res?.errors) {
		validatePassword.value = res?.errors?.old_password || '';
		validateNewPassword.value = res?.errors?.new_password || '';
		validateConfirmPassword.value = res?.errors?.confirm_password || '';
	} else {
		validatePassword.value = '';
		validateNewPassword.value = '';
		validateConfirmPassword.value = '';
		isShowModalUpdate.value = true;
	}
};

const onClickAddressChangeStatus = async () => {
	statusChange.value = 'updateAddress';
	await _validateAddress();

	if (
		validateLastName.value === '' &&
		validateFirstName.value === '' &&
		validateLastNameKana.value === '' &&
		validateFirstNameKana.value === '' &&
		validateBirthDay.value === ''
	) {
		textEditAddress.value = t("user_infor.want_to_change_address");
		isShowModalUpdate.value = true;
	}
};

const onClickEditChangeGender = () => {
	statusChange.value = 'updateGender';
	textEditAddress.value = t("user_infor.want_to_change");
	isShowModalUpdate.value = true;
}

const onClickChangeCreatedit = () => {
	router.push('/account/credit-card');
};

const _handleCloseModalUpdate = () => {
	isShowModalUpdate.value = false;
	textEditAddress.value = t("user_infor.want_to_change");
};
</script>

<template>
	<!-- <ModalLoading v-if="(showLoadding)"/> -->
	<div class="tab_wrapper_reservation_status content__member_cus">
		<div class="reservation_status__title">
			{{ t('user_infor.title') }}
		</div>

		<div class="member_information_name_cus">
			<button
				:class="dataUserInfor?.ekyc_status === NUMBER.FIRST ? 'btn_certified_eKYC' : 'btn_certified_no_eKYC'"
				class="member_information_name__btn"
			>
				{{
					dataUserInfor?.ekyc_status === NUMBER.FIRST
						? t('user_infor.btn_certified')
						: dataUserInfor?.ekyc_status === 0
						? t('user_infor.btn_certified_no_eKYC')
						: ''
				}}
			</button>
		</div>
		<hr class="hr_boder" />
		<!-- name -->
		<div class="member_information_name_infor member_info_name_cus">
			<div class="info_name_empty"></div>
			<div class="member_information_first_name member__name__mgr font__weigth_600">
				{{ t('user_infor.firstname') }}
			</div>
			<div class="member_information_last_name font__weigth_600">
				{{ t('user_infor.lastname') }}
			</div>
		</div>

		<template v-if="checkBirthDay">
			<div class="member_information_name_infor member_info_name_cus">
				<div class="info_name_empty"></div>
				<div class="member_information_first_name member__name__mgr pd_name">
					{{ dataUserInfor?.last_name || '' }}
				</div>
				<div class="member_information_last_name pd_name">
					{{ dataUserInfor?.first_name || '' }}
				</div>
			</div>
		</template>
		<template v-else>
			<div class="member_information_name_infor member_info_name_cus mg__top">
				<div class="info_name_empty"></div>
				<div class="member_information_first_name box_input member__name__mgr">
					<input
						v-model="last_name"
						@keyup="keyupChangeInfo('ChangeLastName')"
						type="text"
						name="last_name"
						maxlength="20"
						class="form-control add_credit_card__input information_input"
						:class="{ 'border-danger': validateLastName }"
					/>
				</div>
				<div class="member_information_first_name box_input">
					<input
						v-model="first_name"
						@keyup="keyupChangeInfo('ChangeFirstName')"
						type="text"
						name="first_name"
						maxlength="20"
						class="form-control add_credit_card__input information_input"
						:class="{ 'border-danger': validateFirstName }"
					/>
				</div>
			</div>
			<div class="member_information_name_infor member_info_name_cus mg__bottom">
				<div class="info_name_empty"></div>
				<div class="member_information_first_name box_input member__name__mgr">
					<div v-if="validateLastName" class="error__validate">{{ validateLastName }}</div>
				</div>
				<div class="member_information_first_name box_input">
					<div v-if="validateFirstName" class="error__validate">{{ validateFirstName }}</div>
				</div>
			</div>
		</template>

		<p v-if="checkBirthDay" class="hr_boder"></p>
		<div class="member_information_name_infor member_info_name_cus">
			<div class="info_name_empty"></div>
			<div class="member_information_first_name member__name__mgr font__weigth_600">
				{{ t('user_infor.firstnamekana') }}
			</div>
			<div class="member_information_last_name font__weigth_600">
				{{ t('user_infor.lastnamekana') }}
			</div>
		</div>

		<template v-if="checkBirthDay">
			<div class="member_information_name_infor member_info_name_cus">
				<div class="info_name_empty"></div>
				<div class="member_information_first_name member__name__mgr pd_name">
					{{ dataUserInfor?.last_name_kana || '' }}
				</div>
				<div class="member_information_last_name pd_name">
					{{ dataUserInfor?.first_name_kana || '' }}
				</div>
			</div>
		</template>
		<template v-else>
			<div class="member_information_name_infor member_info_name_cus mg__top">
				<div class="info_name_empty"></div>
				<div class="member_information_first_name box_input member__name__mgr">
					<input
						v-model="last_name_kana"
						v-on:input="last_name_kana = $event.target.value"
						@keyup="keyupChangeInfo('ChangeLastNameKana')"
						type="text"
						name="last_name_kana"
						maxlength="20"
						class="form-control add_credit_card__input information_input"
						:class="{ 'border-danger': validateLastNameKana }"
					/>
				</div>
				<div class="member_information_first_name box_input">
					<input
						v-model="first_name_kana"
						v-on:input="first_name_kana = $event.target.value"
						@keyup="keyupChangeInfo('ChangeFirstNameKana')"
						type="text"
						name="first_name_kana"
						maxlength="20"
						class="form-control add_credit_card__input information_input"
						:class="{ 'border-danger': validateFirstNameKana }"
					/>
				</div>
			</div>
			<div class="member_information_name_infor member_info_name_cus mg__bottom">
				<div class="info_name_empty"></div>
				<div class="member_information_first_name box_input member__name__mgr">
					<div v-if="validateLastNameKana" class="error__validate">{{ validateLastNameKana }}</div>
				</div>
				<div class="member_information_first_name box_input">
					<div v-if="validateFirstNameKana" class="error__validate">{{ validateFirstNameKana }}</div>
				</div>
			</div>
		</template>
		
		<div v-if="dataUserInfor?.user_license"  class="member_information_name_infor driving_license">
			<div class="label_name font__weigth_600">
				<span class="label_name_i__cus"></span>{{ t('user_infor.driving_license') }}
			</div>
			<div class="member_information_name">
				<div class="label_content">
					<span class="driving_license_info">{{ dataUserInfor?.user_license || '' }}</span>
				</div>
				<div class="btn_content"></div>
			</div>
		</div>

		<p v-if="checkBirthDay" class="hr_boder"></p>
		<!-- address & birdthday -->
		<div v-if="checkBirthDay" class="member_information_name_infor">
			<div class="label_name font__weigth_600">
				<span class="label_name_i__cus"><img src="/icons/home.svg" alt="" /></span>{{ t('user_infor.address') }}
			</div>
			<div class="member_information_name">
				<div class="label_content">
					<span>{{ dataUserInfor?.province || '' }}{{ dataUserInfor?.address1 || '' }}</span>
				</div>
				<div class="btn_content"></div>
			</div>
			<p class="hr_boder"></p>
		</div>

		<div v-else class="member_information_user_infor edit_province">
			<div class="label_name">
				<span class="label_name_i"><img src="/icons/home.svg" alt="" /></span>{{ t('user_infor.address') }}
			</div>
			<div class="label_content">
				<div class="box_input">
					<select class="list_province" v-model="selectProvince">					
						<option :value="province" v-for="(province,index) in listProvince" :key="index">{{province}}</option>
					</select>
				</div>
			
				<div class="box_input">
					<input
						v-model="address1"
						@keyup="keyupChangeInfo('ChangeAccountInfo')"
						type="text"
						name="address"
						maxlength="100"
						class="form-control add_credit_card__input information_input"
					/>
				</div>
			</div>
			<div v-if="!btnHidden" class="btn_content" />
		</div>

		<div v-if="checkBirthDay" class="member_information_name_infor">
			<div class="label_name font__weigth_600">
				<span class="label_name_i__cus"><img src="/icons/icon_day.svg" alt="" /></span
				>{{ t('user_infor.date_of_birth') }}
			</div>
			<div class="member_information_name">
				<div class="label_content">
					<span>{{ dataUserInfor?.birthday ? formatDayJP(dataUserInfor?.birthday) : 'yyyy/mm/dd' }}</span>
				</div>
			</div>
			<p class="hr_boder"></p>

			<!-- licence_remarks -->
			<div v-show="dataUserInfor?.licence_remarks" class="member_information_name_infor">
				<div class="info_name_empty"></div>
				<div class="label_name font__weigth_600"><span class="label_name_i__cus"></span
				>{{ '免許証裏面備考' }}</div>
			</div>

			<div class="member_information_name">
				<div class="label_content">
					<span>{{ dataUserInfor?.licence_remarks && dataUserInfor?.licence_remarks .replace('\n','') || ''  }}</span>
				</div>
			<div class="btn_content" style="margin-left: 20px">
				<button @click="onClickChangeBirthDay" class="btn_change__edit">
					{{ t('user_infor.change') }}
				</button>
			</div>
			</div>

		</div>


		<template v-else>
			<div class="member_information_user_infor">
				<div class="label_name">
					<span class="label_name_i"><img src="/icons/icon_day.svg" alt="" /></span>{{ t('user_infor.date_of_birth') }}
				</div>
				<div class="label_content">
					<Datepicker
						v-model="birthday"
						@keydown="keyupChangeBirth"
						@internalModelChange="handleInternal"
						:enableTimePicker="false"
						:clearable="false"
						:typeable="true"
						locale="ja-jp"
						format="yyyy/MM/dd"
						class="datepicker_input"
						:class="{ 'border-danger': validateBirthDay }"
					>
						<template #input-icon>
							<div class="icon ms-3 calendar-info"><bx:calendar /></div>
						</template>
					</Datepicker>
				</div>
			</div>

			<!-- licence_remarks -->
			<div v-show="dataUserInfor?.licence_remarks" class="member_information_name_infor">
				<div class="label_name"><span class="label_name_i__cus"></span
				>{{ '免許証裏面備考' }}</div>
			</div>

			<div class="member_information_name" style="font-size: 14px">
				<div class="label_name" style="word-break: break-word;">
					{{ dataUserInfor?.licence_remarks && dataUserInfor?.licence_remarks.replace('\n','') || ''  }}
				</div>
			</div>

			<div class="member_information_user_infor">
				<div class="label_name"></div>
				<div class="label_content">
					<div v-if="validateBirthDay" class="error__validate">{{ validateBirthDay }}</div>
				</div>
				<div class="btn_content" />
			</div>
		</template>

		<div v-if="!checkBirthDay" class="member_information_user_infor">
			<div>
				<span class="member_information_start">{{ t('user_infor.note_start') }}</span
				>{{ t('user_infor.note_address') }}
			</div>
		</div>

		<div v-if="!checkBirthDay" class="member_information_user_infor">
			<div class="label_name" />
			<div class="btn_content_change">
				<div class="add_credit_card__btn btn_information_cancel">
					<button class="credit_card__btn_cancel" @click="onClickCancelChange">
						{{ t('button.cancel') }}
					</button>
				</div>
				<div class="add_credit_card__btn btn_information_change">
					<button class="credit_card__btn_add" @click="onClickAddressChangeStatus">
						{{ t('user_infor.change') }}
					</button>
				</div>
			</div>
		</div>
		<hr class="hr_boder" />

		<template v-if="checkGender">
			<div class="member_information_name_infor">
				<div class="info_name_empty"></div>
				<div class="member_information_name">
					<div class="label_content">
						<span class="info_name_strong">{{ t('user_infor.gender') }}</span>
					</div>
					<div class="btn_content">
					</div>
				</div>
			</div>
			<div class="member_information_name_infor">
				<div class="info_name_empty"></div>
				<div class="member_information_name">
					<div class="label_content">
						<template v-if="selectGender === NUMBER.FIRST">{{ t('user_infor.male') }}</template>
						<template v-else-if="selectGender === NUMBER.SECOND">{{ t('user_infor.female') }}</template>
						<template v-else>{{ t('user_infor.other') }}</template>
					</div>
					<div class="btn_content">
						<button @click="onClickChangeGender" class="btn_change__edit">
							{{ t('user_infor.change') }}
						</button>
					</div>
				</div>
			</div>
		</template>
		<template v-else>
			<div class="member_information_name_infor member_info_name_cus mg__top">
				<div class="info_name_empty"></div>
				<div class="info_name_display">
					<span class="info_name_strong gender__name--mar">{{ t('user_infor.gender') }}</span>
					<div class="gender__radio">
						<label class="gender__radio--label">{{ t('user_infor.male') }}</label>
						<input 
							type="radio" 
							v-model="selectGender" 
							:value="NUMBER.FIRST" 
							:checked="selectGender === NUMBER.FIRST"
							name="gender" />
					</div>
					<div class="gender__radio">
						<label class="gender__radio--label">{{ t('user_infor.female') }}</label>
						<input
							type="radio" 
							v-model="selectGender" 
							:value="NUMBER.SECOND" 
							:checked="selectGender === NUMBER.SECOND"
							name="gender" />
					</div>
					<div class="gender__radio">
						<label class="gender__radio--label">{{ t('user_infor.other') }}</label>
						<input
							type="radio" 
							v-model="selectGender" 
							:value="NUMBER.THIRST" 
							:checked="selectGender === NUMBER.THIRST"
							name="gender" />
					</div>			
				</div>
			</div>
		</template>

		<div v-if="!checkGender" class="member_information_user_infor">
			<div class="label_name" />
			<div class="btn_content_change">
				<div class="add_credit_card__btn btn_information_cancel">
					<button class="credit_card__btn_cancel" @click="onClickCancelChange">
						{{ t('button.cancel') }}
					</button>
				</div>
				<div class="add_credit_card__btn btn_information_change">
					<button class="credit_card__btn_add" @click="onClickEditChangeGender">
						{{ t('user_infor.change') }}
					</button>
				</div>
			</div>
		</div>

		<hr class="hr_boder" />

		<div class="member_information_name_infor">
			<div class="label_name font__weigth_600">
				<span class="label_name_i__cus"><img src="/icons/email.svg" alt="" /></span>{{ t('user_infor.email') }}
			</div>
			<div v-if="dataUserInfor?.email" class="member_information_name">
				{{ dataUserInfor?.email }}
			</div>
		</div>
		<hr class="hr_boder" />
		<!-- telephone -->
		<div v-if="checkChangePhone" class="member_information_name_infor">
			<div class="label_name font__weigth_600">
				<span class="label_name_i__cus"><img src="/icons/telephone.svg" alt="" /></span
				>{{ t('user_infor.phone_number') }}
			</div>
			<div class="member_information_name">
				<div class="label_content">
					<span v-if="dataUserInfor?.phone">{{ addZero(dataUserInfor?.phone) }}</span>
				</div>
				<div class="btn_content">
					<button @click="onClickChangePhone" class="btn_change__edit">
						{{ t('user_infor.change') }}
					</button>
				</div>
			</div>
		</div>

		<template v-else>
			<div class="member_information_user_infor">
				<div class="label_name">
					<span class="label_name_i"><img src="/icons/telephone.svg" alt="" /></span>{{ t('user_infor.phone_number') }}
				</div>
				<div class="label_content">
					<input
						v-model="phone"
						@keyup="keyupChangeInfo('ChangePhone')"
						type="text"
						name="phone"
						maxlength="11"
						class="form-control add_credit_card__input information_input_phone"
						:class="{ 'border-danger': validatePhone }"
					/>
				</div>
				<div v-if="!btnHidden" class="btn_content btn_verify_code">
					<button
						@click="onClickPhoneVerifyCode"
						:disabled="disableButtonSendSMS"
						:class="{ disable_btn_send: disableButtonSendSMS }"
					>
						{{ t('user_infor.send_verification_code') }}
					</button>
				</div>
			</div>
			<div class="member_information_user_infor">
				<div class="label_name"></div>
				<div>
					<div v-if="validatePhone" class="error__validate">{{ validatePhone }}</div>
				</div>
				<div v-if="!btnHidden"></div>
			</div>

			<div v-if="btnHidden" class="member_information_user_infor">
				<div class="label_name"></div>
				<div class="label_content btn_content btn_verify_code btn_verify_code--cus">
					<button
						@click="onClickPhoneVerifyCode"
						:disabled="disableButtonSendSMS"
						:class="{ disable_btn_send: disableButtonSendSMS }"
					>
						{{ t('user_infor.send_verification_code') }}
					</button>
				</div>
			</div>

			<div v-if="disableButtonSendSMS && !btnHidden" class="member_information_user_infor">
				<div class="label_name"></div>
				<div class="label_content"></div>
				<div class="btn_content btn_verify_code text_count_down">
					<span>{{ timerCount }}{{ t('user_infor.second') }}</span>
				</div>
			</div>
			<div v-else-if="disableButtonSendSMS && btnHidden" class="member_information_user_infor">
				<div class="label_name"></div>
				<div class="label_content btn_content btn_verify_code text_count_down">
					<span>{{ timerCount }}{{ t('user_infor.second') }}</span>
				</div>
			</div>

			<div class="member_information_user_infor">
				<div class="label_name"><span class="label_name_i" />{{ t('user_infor.authentication_code') }}</div>
				<div class="label_content">
					<input
						v-model="sms_verify_code"
						@keyup="keyupChangeInfo('ChangeCode')"
						type="text"
						name="sms_verify_code"
						maxlength="6"
						class="form-control add_credit_card__input information_input_phone"
						:placeholder="$t('user_infor.authentication_code')"
						:class="{ 'border-danger': validateCode }"
					/>
				</div>
				<div v-if="!btnHidden" class="btn_content" />
			</div>
			<div class="member_information_user_infor">
				<div class="label_name"></div>
				<div>
					<div v-if="validateCode" class="error__validate">{{ validateCode }}</div>
				</div>
				<div v-if="!btnHidden"></div>
			</div>
		</template>

		<div v-if="!checkChangePhone" class="member_information_user_infor">
			<div class="label_name" />
			<div class="btn_content_change">
				<div class="add_credit_card__btn btn_information_cancel">
					<button class="credit_card__btn_cancel" @click="onClickCancelChange">
						{{ t('button.cancel') }}
					</button>
				</div>
				<div class="add_credit_card__btn btn_information_change">
					<button @click.prevent="onClickPhoneChangeStatus" class="credit_card__btn_add">
						{{ t('user_infor.keep') }}
					</button>
				</div>
			</div>
		</div>
		<hr class="hr_boder" />

		<!-- pass -->
		<div v-if="checkEditPass" class="member_information_name_infor">
			<div class="label_name font__weigth_600">
				<span class="label_name_i__cus"><img src="/icons/lock.svg" alt="" /></span>{{ t('user_infor.pasword') }}
			</div>
			<div class="member_information_name">
				<div class="label_content">
					<span>........</span>
				</div>
				<div class="btn_content">
					<button @click="onClickEdit" class="btn_change__edit">
						{{ t('user_infor.change') }}
					</button>
				</div>
			</div>
		</div>
		<template v-else>
			<div class="member_information_user_infor">
				<div class="label_name">
					<span class="label_name_i"><img src="/icons/lock.svg" alt="" /></span>{{ t('user_infor.pasword') }}
				</div>
				<div class="label_content" />
				<div class="btn_content" />
			</div>

			<div class="member_information_user_infor">
				<div class="label_name label_name--cus"><span class="label_name_i" />{{ t('user_infor.current_password') }}</div>
				<div class="label_content">
					<input
						v-model="old_password"
						@keydown.space.prevent
						@keyup="keyupChangeInfo('ChangePassOld')"
						id="inputPassword"
						type="password"
						name="password"
						maxlength="100"
						class="form-control add_credit_card__input information_input"
						:class="{ 'border-danger': validatePassword }"
					/>
				</div>
				<div v-if="!btnHidden" class="btn_content" />
			</div>
			<div class="member_information_user_infor">
				<div class="label_name"></div>
				<div>
					<div v-if="validatePassword" class="error__validate">{{ validatePassword }}</div>
				</div>
				<div></div>
			</div>

			<div class="member_information_user_infor">
				<div class="label_name label_name--cus"><span class="label_name_i" />{{ t('user_infor.new_password') }}</div>
				<div class="label_content">
					<input
						v-model="new_password"
						@keydown.space.prevent
						@keyup="keyupChangeInfo('ChangePassNew')"
						id="inputNewPassword"
						type="password"
						name="new_password"
						maxlength="100"
						class="form-control add_credit_card__input information_input"
						:class="{ 'border-danger': validateNewPassword }"
					/>
				</div>
				<div v-if="!btnHidden" class="btn_content" />
			</div>
			<div class="member_information_user_infor">
				<div class="label_name"></div>
				<div>
					<div v-if="validateNewPassword" class="error__validate">{{ validateNewPassword }}</div>
				</div>
				<div></div>
			</div>

			<div class="member_information_user_infor">
				<div class="label_name label_name--cus"><span class="label_name_i" />{{ t('user_infor.password_confirmation') }}</div>
				<div class="label_content">
					<input
						v-model="confirm_password"
						@keydown.space.prevent
						@keyup="keyupChangeInfo('ChangePassNewConfirm')"
						id="inputConfirmPassword"
						type="password"
						name="confirm_password"
						maxlength="100"
						class="form-control add_credit_card__input information_input"
						:class="{ 'border-danger': validateConfirmPassword }"
					/>
				</div>
				<div v-if="!btnHidden" class="btn_content" />
			</div>
			<div class="member_information_user_infor">
				<div class="label_name"></div>
				<div>
					<div v-if="validateConfirmPassword" class="error__validate">{{ validateConfirmPassword }}</div>
				</div>
				<div></div>
			</div>

			<div class="member_information_user_infor">
				<div class="label_name" />
				<div class="btn_content_change">
					<div class="add_credit_card__btn btn_information_cancel">
						<button class="credit_card__btn_cancel" @click="onClickCancelChange">
							{{ t('button.cancel') }}
						</button>
					</div>
					<div class="add_credit_card__btn btn_information_change">
						<button class="credit_card__btn_add" @click.prevent="onClickPassChangeStatus">
							{{ t('user_infor.change') }}
						</button>
					</div>
				</div>
			</div>
		</template>
		<hr class="hr_boder" />

		<div class="member_information_name_infor">
			<div class="label_name font__weigth_600">
				<span class="label_name_i__cus"><img src="/images/credit_card.svg" alt="" /></span
				>{{ t('user_infor.credit_card_change') }}
				<span class="ms-3">
					<button class="member_information_name__btn btn_num_credit">
						{{ numCredit > 0 ? t('user_infor.has_credit') : t('user_infor.no_credit') }}
					</button>
				</span>
			</div>
			<div class="member_information_name">
				<div class="label_content"></div>
				<div class="btn_content">
					<button @click.prevent="onClickChangeCreatedit" class="btn_change__edit">
						{{ t('user_infor.change') }}
					</button>
				</div>
			</div>
		</div>
		<hr class="hr_boder" />

		<div v-if="checkEditPass && checkChangePhone && checkBirthDay" class="modal_account btn__withdrawn">
			<button @click="goProblemLeaveGuild">{{ t('user_infor.withdrawal') }}</button>
			<!-- <button @click="isShowWithdrawModal = true">{{ t('user_infor.withdrawal') }}</button> -->
		</div>

		<WithdrawPopup v-if="isShowWithdrawModal" @close="isShowWithdrawModal = false" />

		<ConfirmUpdateModal
			v-if="isShowModalUpdate"
			@updateAddress="onClickEditChangeBirthDay"
			@updatePassword="onClickEditChangePassword"
			@updatePhone="onClickEditChangePhone"
			@closeCofirmUpdate="_handleCloseModalUpdate"
			@updateGender="_handleEditChangePhone"
			:statusChange="statusChange"
			:textEditAddress="textEditAddress"
		/>

		<ErrorModal v-if="isShowModalSendCode" @closeModalError="isShowModalSendCode = false" :resError="textError" :buttonCancel="buttonCancel" />
	</div>
</template>
<style scoped>
.calendar-info{
	color:black;
}
.list_province{
	width: 100px;
	padding: 0.375rem 0.375rem;
    font-size: 14px;
	height: 36.98px;
	border-radius: 1rem;
	border: 1px solid;
    border-color: #EBEBEB;
	margin-bottom: 10px;
}
.edit_province{
	display: flex;
	align-items: start;
	/* align-items: flex-start; */
}
.driving_license_info{
	color: #6B6B6B;
}
.driving_license{
	margin-top: 10px;
}
</style>
