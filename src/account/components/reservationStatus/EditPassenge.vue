<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useReservationStore } from '~/account/stores/ReservationStore';
import { useUserInfoStore } from '~/account/stores/UserInfoStore';
import { STATUS } from '~/common/dtos/base-output.dto';
import { NUMBER } from '~/common/utils/constant';
import EmailInput from '../../dtos/reservation-email-input.dto';

const { t } = useI18n();
const router = useRouter();
const emit = defineEmits(['backReservation']);
const userInforStore = useUserInfoStore();
const reservationStore = useReservationStore();
const { reservationDetail, stepPassenger, errorValidate, listSubDriver } = storeToRefs(useReservationStore());

const isShowModalError = ref(false);
const isShowModalErrorYesNo = ref(false);
const textError = ref<any>('');
const textErrorYesNo = ref<any>('');
const passError = ref('');
const buttonCancel = ref(t('button.ok'));
const buttonReturn = ref(t('button.keep_fixing'));
const buttonConfirm = ref(t('button.return_previous_screen'));
const isShowButton = ref(true);
const valuePassengers = ref<{email: string}[]>([]);
const valueSubDrive = ref<any>('');
const tmpValuePassengers = ref<any>('');
const tmpCheckUpdate = ref<any>('');
const errorValidateEmail = ref<any>([]);
const checkError = ref<any>(false);
const hiddenButtonAdd = ref<any>(true);
const checkHandleDelete = ref<any>(false);
const checkDelete = ref<any>('');
const enableSub = ref<any>(true);

onMounted(async () => {
	if (listSubDriver.value?.length) {
		reservationStore.setStepPassenger(NUMBER.SECOND);
		valuePassengers.value = listSubDriver.value;
		isShowButton.value = false;
	} else {
		reservationStore.setStepPassenger(NUMBER.FIRST);
		isShowButton.value = true;
	}

	valueSubDrive.value = valuePassengers.value;
	tmpValuePassengers.value = valuePassengers.value;
	tmpCheckUpdate.value = valuePassengers.value;

	if (
    valuePassengers.value?.length === reservationDetail.value?.capacity - NUMBER.FIRST &&
    reservationDetail.value?.capacity - NUMBER.FIRST < 7
	) {
		hiddenButtonAdd.value = false;
	}  
	if (
		reservationDetail.value?.capacity - NUMBER.FIRST > 7 &&
		valuePassengers.value?.length === 7
	) {
		hiddenButtonAdd.value = false;
	}
});

const confirmModalErrorYesNo = () => {
	// if (checkDelete.value) {
	//   _handleDeleteUI(checkDelete.value - NUMBER.FIRST)
	//   return
	// }
	if (checkHandleDelete.value) {
		valuePassengers.value = [];
	} else {
		_handleBack();
	}
};

const handleBack = (val: any = '') => {
	checkHandleDelete.value = false;
	if (stepPassenger.value === NUMBER.FIRST && tmpValuePassengers.value !== valuePassengers.value) {
		textErrorYesNo.value = t('revervation.text_error_back');
		isShowModalErrorYesNo.value = true;
	} else if (stepPassenger.value === NUMBER.SECOND && tmpValuePassengers.value !== valuePassengers.value) {
		textErrorYesNo.value = t('revervation.text_error_back2');
		isShowModalErrorYesNo.value = true;
	} else {
		_handleBack();
	}
};

const _handleBack = (param: any = '') => {
	emit('backReservation', param);
};

const handleChangeButton = async () => {
	let checkErrorEmailExits = NUMBER.ZERO;
  _validateEmail1(valuePassengers.value.length - 1);
	console.log(checkError.value);
	errorValidateEmail.value?.map((value: any) => {
		if (value?.err) {
			checkErrorEmailExits = NUMBER.FIRST;
		}
	});
	if (checkErrorEmailExits) {
		return;
	}

	await checkErrorFunc();
	console.log(checkError.value);
	const timeOut = setTimeout(async () => {
		if (checkError.value) {
			return;
		}
		let sub_driver_email_list: any = [];
		if (valuePassengers.value?.length) {
			valuePassengers.value?.map((value: any, i: any) => {
				sub_driver_email_list.push({
					email: value?.email,
					person_no: i + 1,
				});
			});
		}

		const valueUpdate: any = {
			reservation_id: reservationDetail.value?.id,
			sub_driver_email_list,
		};

		if (enableSub.value) {
			enableSub.value = false;
			const res = await reservationStore.updateSubDriver(valueUpdate);
			if (res?.status === STATUS.ERROR) {
				if (res?.code === 'EUA041_006') {
					passError.value = 'errStarted';
				} else {
					passError.value = 'errUpdateSub';
				}
			} else {
				reservationStore.setSubDrive(sub_driver_email_list);
				if (sub_driver_email_list?.length) {
					passError.value = 'succCheck';
				} else {
					passError.value = 'succCheck2';
				}
			}
			textError.value = res?.message;
			enableSub.value = true;
			isShowModalError.value = true;
		}
		clearTimeout(timeOut);
	}, 300);
};

const handleBackError = () => {
	switch (passError.value) {
		case 'succCheck':
			isShowButton.value = false;
			reservationStore.setStepPassenger(NUMBER.SECOND);
			break;
		case 'succCheck2':
			// isShowButton.value = true
			// reservationStore.setStepPassenger(NUMBER.FIRST)
			_handleBack('null');
			break;

		case 'errStarted':
			_handleBack();
			break;

		case 'errUpdateSub':
			isShowButton.value = true;
			reservationStore.setStepPassenger(NUMBER.FIRST);
			break;
		case 'succUpdateSub':
			_handleBack(valuePassengers.value);
			break;

		case 'errCheck':
		case 'notSubDrive':
		default:
			break;
	}
	isShowModalError.value = false;
};

const handleBackEdit = () => {
	isShowButton.value = true;
};

const handleEditSubDriver = async () => {
	passError.value = 'succUpdateSub';
	handleBackError();
};

const checkErrorFunc = async () => {
	checkError.value = false;

	if (valuePassengers.value?.length) {
		let errors: any = [...errorValidateEmail.value];
		await valuePassengers.value?.map(async (item: any, i: any) => {
			const res = await userInforStore.validateForm({ email: item?.email }, EmailInput);
			console.log(res);
			if (res?.errors?.email) {
				checkError.value = true;
			}
			let errors = [...errorValidateEmail.value];
			let err = res?.errors?.email || '';
			errors[i] = { ...errors[i], err };
			errorValidateEmail.value = errors;
		});
	}
};

const handleAddUI = () => {
	if (
		valuePassengers.value?.length < reservationDetail.value?.capacity - NUMBER.FIRST &&
		valuePassengers.value?.length + NUMBER.FIRST <= NUMBER.TEN
	) {
		valuePassengers.value = [...valuePassengers.value, { email: '' }];
		_validateEmail1(valuePassengers.value.length - 1);
		if (reservationDetail.value?.capacity > 7 && valuePassengers.value?.length === 7) {
			hiddenButtonAdd.value = false;
		} 
		else if (
			reservationDetail.value?.capacity <= NUMBER.TEN &&
			valuePassengers.value?.length === reservationDetail.value?.capacity - NUMBER.FIRST
		) {
			hiddenButtonAdd.value = false;
		}
	}
};

const _handleDeleteUI = async (index: any) => {
	let checkEmail: any = NUMBER.FIRST;
	let arr = [...valuePassengers.value];
	let validate = [...errorValidateEmail.value];
	let emailDelete = arr[index]?.email?.toLowerCase();
	arr.splice(index, NUMBER.FIRST);
	valuePassengers.value = arr;
	validate.splice(index, NUMBER.FIRST);
	errorValidateEmail.value = validate;

	valuePassengers.value?.map(async (data: any, i: any) => {
		if (checkEmail && data?.email && data?.email?.toLowerCase() === emailDelete) {
			checkEmail = 0;
			errorValidateEmail.value[i] = '';
		} else if (i >= index && data?.email && data?.email?.toLowerCase() === emailDelete) {
			let err = t('booking.text_email_exist') + emailDelete;
			validate[i] = { ...validate[i], err };
			errorValidateEmail.value = validate;
		}
	});

	hiddenButtonAdd.value = true;
	checkDelete.value = '';
};

const handleDeleteUI = (index: any) => {
	checkDelete.value = '';
	if (valuePassengers.value?.length) {
		checkDelete.value = index + NUMBER.FIRST;
		_handleDeleteUI(index);
		// textErrorYesNo.value = t("revervation.delete_all_subdrive")
		// buttonReturn.value = t("button.return")
		// buttonConfirm.value = t("button.keep_fixing")
		// isShowModalErrorYesNo.value = true
	}
};
const _validateEmail1 = async (index: any) => {
  errorValidateEmail.value = [];
	let checkEmail: any = NUMBER.ZERO;
	let dataEmail: any = '';
	let valueEmailCheck = '';
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	console.log('index', index);
  console.log('valuePassengers', valuePassengers.value);
  const valuePassengersLength = valuePassengers.value.length
	if (valuePassengersLength > 1) {
    const valuePassengersCopied = [...valuePassengers.value].reverse()
    valuePassengersCopied.forEach((emailData, i) => {
      if(i !== index && emailData.email) {
        console.log({
          arr: valuePassengersCopied.slice(i + 1),
          email: emailData.email.toLowerCase()
        })
        const isDuplicate = valuePassengersCopied.slice(i + 1).map((eml) => eml.email.toLowerCase()).includes(emailData.email.toLowerCase())

        console.log({isDuplicate, index})
        if(isDuplicate) {
          let errors = [...errorValidateEmail.value];
          let err = t('booking.text_email_exist') + emailData.email;
          errors[valuePassengersLength - 1 - i] = { err };
          errorValidateEmail.value = errors;
        }
      }
    })

    for (let i = 0; i < valuePassengers.value.length - 1; i++) {
				console.log(valuePassengers.value[i]);
				const res = await userInforStore.validateForm(valuePassengers.value[i], EmailInput);
				let errors = [...errorValidateEmail.value];
				let err = res?.errors?.email;
        if(err) {
          errors[i] = { ...errors[i], err };
          errorValidateEmail.value = errors;
        }
			}

	}
};


const _validateEmail = async (values: any, index: any) => {
	let checkEmail: any = NUMBER.ZERO;
	let dataEmail: any = '';
	valuePassengers.value?.map((data: any, i: any) => {
		if (i < index && data?.email?.toLowerCase() === values[index]?.email?.toLowerCase()) {
			dataEmail = data?.email?.toLowerCase();
			checkEmail = checkEmail + NUMBER.FIRST;
		}
	});

	if (checkEmail >= NUMBER.FIRST && dataEmail === values[index]?.email?.toLowerCase()) {
		let errors = [...errorValidateEmail.value];
		let err = t('booking.text_email_exist') + dataEmail;
		errors[index] = { ...errors[index], err };
		errorValidateEmail.value = errors;
	} else {
		const res = await userInforStore.validateForm(values[index], EmailInput);
		let errors = [...errorValidateEmail.value];
		let err = res?.errors?.email || '';
		errors[index] = { ...errors[index], err };
		errorValidateEmail.value = errors;
	}
};
const onChange = async (e: any, index: any) => {
	if (e.key !== 'Shift' && e.key !== 'Control') {
		let values = [...valuePassengers.value];
		values[index] = { ...values[index], email: e.target.value.trim() };
		valuePassengers.value = values;
	}
};

const handleDeleteSubDrive = () => {
	if (valuePassengers.value?.length) {
		checkHandleDelete.value = true;
		textErrorYesNo.value = t('revervation.delete_all_subdrive');
		buttonReturn.value = t('button.return');
		buttonConfirm.value = t('button.keep_fixing');
		isShowModalErrorYesNo.value = true;
	} else {
		passError.value = 'notSubDrive';
		textError.value = t('revervation.passengers_not_yet');
		isShowModalError.value = true;
	}
};
</script>

<template>
	<div class="car-box-right reservation">
		<div v-if="isShowButton" class="booking-infomation">
			<div class="list-info">
				<h4>{{ t('revervation.add_passenger') }}</h4>

				<div class="btn__delete--subdrive">
					<button @click="handleDeleteSubDrive" class="btn btn__delete--red">
						{{ t('button.remove_passengers') }}
					</button>
				</div>

				<div v-for="(data, index) in valuePassengers" class="form__input_group" :key="index">
					<label for="">{{ index + NUMBER.FIRST }}{{ t('revervation.passenger_person') }}</label>
					<div class="revervation__add--text">
						<div class="group__email">
							<img src="/icons/email_pass.svg" alt="" />
								<!-- @keyup="onChange($event, index)" -->
							<input
								type="text"
								v-model="data.email"
								maxlength="100"
								class="form-control add_credit_card__input revervation__add--input"
								:class="{ 'border-danger': errorValidateEmail[index]?.err }"
							/>
						</div>
						<button @click="handleDeleteUI(index)" class="revervation__add--btn-abs">
							<i class="fa-regular fa-circle-minus"></i>
						</button>
					</div>
					<div v-if="errorValidateEmail && errorValidateEmail[index]?.err" class="error__validate">
						{{ errorValidateEmail[index]?.err }}
					</div>
				</div>

				<div v-if="hiddenButtonAdd" class="revervation__add">
					<button @click="handleAddUI" class="revervation__add--btn">
						<i class="fa-regular fa-circle-plus"></i>
					</button>
				</div>
				<h4></h4>
			</div>
		</div>

		<div v-else class="booking-infomation">
			<div class="list-info">
				<h4>{{ t('revervation.passenger_list') }}</h4>
				<div v-for="(data, index) in valuePassengers" class="form__input_group" :key="index">
					<label for="">{{ index + NUMBER.FIRST }}{{ t('revervation.passenger_person') }}</label>
					<div class="revervation__add--text">
						<div class="group__email">
							<img src="/icons/email_pass.svg" alt="" />
							<input
								type="text"
								:value="data?.email"
								disabled
								class="form-control add_credit_card__input revervation__add--input"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="isShowButton" class="box-action">
			<button @click="handleBack" class="button button-normal">
				{{ t('revervation.return') }}
			</button>

			<button @click="handleChangeButton" class="btn btn-primary m-2">
				{{ t('revervation.keep') }}
			</button>
		</div>

		<div v-else class="box-action">
			<button @click="handleEditSubDriver" class="btn btn__primary">
				{{ t('button.return') }}
			</button>

			<button @click="handleBackEdit" class="btn btn__primary">
				{{ t('revervation.btn_fix') }}
			</button>
		</div>
	</div>

	<ErrorModal
		v-if="isShowModalError"
		@closeModalError="handleBackError"
		:resError="textError"
		:buttonCancel="buttonCancel"
	/>
	<ErrorModalYesNo
		v-if="isShowModalErrorYesNo"
		@closeModalErrorYesNo="isShowModalErrorYesNo = false"
		@confirmModalErrorYesNo="confirmModalErrorYesNo"
		:resError="textErrorYesNo"
		:buttonReturn="buttonReturn"
		:buttonConfirm="buttonConfirm"
	/>
</template>
