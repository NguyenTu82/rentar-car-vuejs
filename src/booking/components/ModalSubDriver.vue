<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useReservationStore } from '~/account/stores/ReservationStore';
import { useUserInfoStore } from '~/account/stores/UserInfoStore';
import { useBookingStore } from '~/booking/stores/booking';
import { STATUS } from '~/common/dtos/base-output.dto';
import { NUMBER } from '~/common/utils/constant';
import EmailInput from '~/account/dtos/reservation-email-input.dto';

const { t } = useI18n()
const router = useRouter()
const emit = defineEmits(['closeModalSubDri'])
const userInforStore = useUserInfoStore();
const reservationStore = useReservationStore()
const { vehicleDetail, listSubDriver } = storeToRefs(useBookingStore())
// const { reservationDetail, stepPassenger, errorValidate } = storeToRefs(useReservationStore())
const { stepPassenger, errorValidate } = storeToRefs(useReservationStore())

const isShowModalError  = ref(false)
const isShowModalErrorYesNo  = ref(false)
const textError  = ref<any>('')
const textErrorYesNo = ref<any>('')
const passError = ref('')
const buttonCancel  = ref(t("button.ok"))
const buttonReturn = ref(t("button.keep_fixing"))
const buttonConfirm  = ref(t("button.return_previous_screen"))
const isShowButton = ref(true);
const valuePassengers = ref<{email: string}[]>([]);
const valueSubDrive = ref<any>('');
const tmpValuePassengers = ref<any>('');
const errorValidateEmail = ref<any>([]);
const checkError = ref<any>(false)
const hiddenButtonAdd = ref<any>(true)
const enableSub = ref<any>(true)
const checkDelete = ref<any>('')

onMounted(async () => {
  let listEmail: any = []
  
  if (listSubDriver.value?.length) {
    listSubDriver.value?.map((value: any) => {
      listEmail.push({email: value?.email})
    })
    valuePassengers.value = listEmail
  }

  valueSubDrive.value = listSubDriver.value
  reservationStore.setStepPassenger(NUMBER.FIRST)
  tmpValuePassengers.value = valuePassengers.value

  if (
    valuePassengers.value?.length === vehicleDetail.value?.capacity - NUMBER.FIRST &&
    vehicleDetail.value?.capacity - NUMBER.FIRST < 7
  ) {
    hiddenButtonAdd.value = false;
  } 
  if (
    vehicleDetail.value?.capacity - NUMBER.FIRST > 7 &&
    valuePassengers.value?.length === 7
  ) {
    hiddenButtonAdd.value = false;
  }
})

const confirmModalErrorYesNo = () => {
  // if (checkDelete.value) {
  //   _handleDeleteUI(checkDelete.value - NUMBER.FIRST)
  //   return
  // }
  _handleBack()
}

const handleBack = (val: any = '') => {
  if (stepPassenger.value === NUMBER.FIRST && tmpValuePassengers.value !== valuePassengers.value) {
    textErrorYesNo.value = t("revervation.text_error_back")
    isShowModalErrorYesNo.value = true
  } else if (stepPassenger.value === NUMBER.SECOND && tmpValuePassengers.value !== valuePassengers.value) {
    textErrorYesNo.value = t("revervation.text_error_back2")
    isShowModalErrorYesNo.value = true
  } else {
    _handleBack()
  }
}

const _handleBack = (param: any = '') => {
  emit('closeModalSubDri', param);
}

const handleChangeButton = async () => {
  let checkErrorEmailExits = NUMBER.ZERO
  _validateEmail1(valuePassengers.value.length - 1);
  errorValidateEmail.value?.map((value: any) => {
    if (value?.err) {
      checkErrorEmailExits = NUMBER.FIRST
    }
  })
  if (checkErrorEmailExits) {
    return
  }
  await checkErrorFunc()
  const timeOut = setTimeout(async () => {
    if (checkError.value) {
      return
    }  
    
    if (tmpValuePassengers.value !== valuePassengers.value) {
      let sub_driver_email_list: any = []
      valuePassengers.value?.map((valuePassenger: any) => {
        sub_driver_email_list.push(valuePassenger?.email)
      })

      if (enableSub.value && sub_driver_email_list?.length) {
        enableSub.value = false
        const res = await reservationStore.checkSubDriver(sub_driver_email_list)

        if (res?.status === STATUS.ERROR) {
          textError.value = errorValidate.value
          isShowModalError.value = true
          passError.value = 'errCheck'
        } else {
          textError.value = t('revervation.text_check_success')
          isShowModalError.value = true
          if (valuePassengers.value) {
            passError.value = 'succCheck'
          } else {
            passError.value = 'succCheck2'
          }
          valueSubDrive.value = res?.data || []
          tmpValuePassengers.value = valuePassengers.value
        }
        const timeOut = setTimeout(() => {
          enableSub.value = true
          clearTimeout(timeOut)
        }, 500)
      } else {
        passError.value = 'checkEmailNull'
        handleBackError()
      }
    } else if (tmpValuePassengers.value === valuePassengers.value && !valuePassengers.value) {
      passError.value = 'errCheck'
      handleBackError()
    } else {
      passError.value = 'succCheck'
      handleBackError()
    }

    clearTimeout(timeOut)
  }, 300)
}

const handleBackError = () => {
  switch (passError.value) {
    case 'checkEmailNull':
      _handleBack('emailNull')
      break;
    case 'succCheck':
      isShowButton.value = false
      reservationStore.setStepPassenger(NUMBER.SECOND)
      break;

    case 'succCheck2':
    case 'succUpdateSub':
      isShowButton.value = true
      reservationStore.setStepPassenger(NUMBER.FIRST)
      _handleBack()
      break;

    case 'errCheck':
    default:
      break;
  }
  isShowModalError.value = false
}

const handleBackEdit = () => {
  isShowButton.value = true
}

const handleEditSubDriver = async () => {
  let sub_driver_email_list: any = []
  
  valueSubDrive.value?.map((valuePassenger: any, i: any) => {
    let value = {
      id: valuePassenger?.id,
      email: valuePassenger?.email,
      person_no: i + 1
    }
    sub_driver_email_list.push(value)
  })
 
  _handleBack(sub_driver_email_list)
}

const checkErrorFunc = async () => {
  checkError.value = false
  let errors: any = [...errorValidateEmail.value]
  if (valuePassengers.value?.length) {
    await valuePassengers.value?.map(async (item: any, i: any) => {
      const res = await userInforStore.validateForm({ email: item.email }, EmailInput)
      if (res?.errors?.email) {
        checkError.value = true
      }
      let errors = [...errorValidateEmail.value]
      let err = res?.errors?.email || ''
      errors[i] = {...errors[i], err}
      errorValidateEmail.value = errors
    })
  }
}

const handleAddUI = () => {
  if (valuePassengers.value?.length < vehicleDetail.value?.capacity - NUMBER.FIRST && valuePassengers.value?.length < NUMBER.TEN) {
    valuePassengers.value = [...valuePassengers.value, {email: null}]
    _validateEmail1(valuePassengers.value.length - 1);
    if (vehicleDetail.value?.capacity > 7 && valuePassengers.value?.length === 7) {
      hiddenButtonAdd.value = false
    } else if (vehicleDetail.value?.capacity <= NUMBER.TEN && valuePassengers.value?.length === vehicleDetail.value?.capacity - NUMBER.FIRST) {
      hiddenButtonAdd.value = false
    }
  }
}

const _handleDeleteUI = async (index: any) => {
  let checkEmail: any = NUMBER.FIRST
  let arr = [...valuePassengers.value]
  let validate = [...errorValidateEmail.value]
  let emailDelete = arr[index]?.email?.toLowerCase()
  arr.splice(index, NUMBER.FIRST)
  valuePassengers.value = arr
  validate.splice(index, NUMBER.FIRST)
  errorValidateEmail.value = validate
  
  valuePassengers.value?.map(async (data: any, i: any) => {
    if (checkEmail && data?.email && data?.email?.toLowerCase() === emailDelete) {
      checkEmail = 0
      errorValidateEmail.value[i] = ''
    } else if (i >= index && data?.email && data?.email?.toLowerCase() === emailDelete) {
      let err = t("booking.text_email_exist") + emailDelete
      validate[i] = {...validate[i], err}
      errorValidateEmail.value = validate
    }
  })
  
  hiddenButtonAdd.value = true
  checkDelete.value = ''
}

const handleDeleteUI = (index: any) => {
  checkDelete.value = ''
  if (valuePassengers.value?.length) {
    checkDelete.value = index + NUMBER.FIRST
    _handleDeleteUI(index)
    // textErrorYesNo.value = t("revervation.delete_all_subdrive")
    // buttonReturn.value = t("button.return")
    // buttonConfirm.value = t("button.keep_fixing")
    // isShowModalErrorYesNo.value = true
  }
}
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
  let checkEmail: any = NUMBER.ZERO
  let dataEmail: any = ''
  valuePassengers.value?.map((data: any, i: any) => {
    if (i < index && data?.email?.toLowerCase() === values[index]?.email?.toLowerCase()) {
      dataEmail = data?.email?.toLowerCase()
      checkEmail = checkEmail + NUMBER.FIRST
    }
  })
  
  if (checkEmail >= NUMBER.FIRST && dataEmail === values[index]?.email?.toLowerCase()) {
    let errors = [...errorValidateEmail.value]
    let err = t("booking.text_email_exist") + dataEmail
    errors[index] = {...errors[index], err}
    errorValidateEmail.value = errors
  } else {
    const res = await userInforStore.validateForm(values[index], EmailInput)
    let errors = [...errorValidateEmail.value]
    let err = res?.errors?.email || ''
    errors[index] = {...errors[index], err}
    errorValidateEmail.value = errors
  }
}
const onChange = async (e: any, index: any) => {
  if (e.key !== 'Shift' && e.key !== 'Control') {
    let values = [...valuePassengers.value]
    values[index] = {...values[index], email: e.target.value.trim() }
    await _validateEmail(values, index)
    valuePassengers.value = values
  }
}
</script>

<template>
  <transition name="modal-animation">
		<div class="modal">
			<transition name="modal-animation-inner">
				<div class="text-center modal__add--card">
					<div class="box_add__create_card">
            <div v-if="isShowButton" class="list-info list__info--cus">
              <h4>{{ t("revervation.add_passenger") }}</h4>
              <div class="space__margin"></div>
              <div v-for="(data, index) in valuePassengers" class="form__input_group input__group--cus">
                <label for="">{{ index + NUMBER.FIRST }}{{ t('revervation.passenger_person') }}</label>
                <div class="revervation__add--text">
                  <div class="group__email">
                    <img src="/icons/email_pass.svg" alt="" />
                    <input
                      type="text"
                      v-model="data.email"
                      maxlength="100"
                      class="form-control add_credit_card__input revervation__add--input"
                      :class="{'border-danger': errorValidateEmail[index]?.err}"
                    >
                  </div>
                  <button @click="handleDeleteUI(index)" class="revervation__add--btn-abs">
                    <i class="fa-regular fa-circle-minus"></i>
                  </button>
                </div>
                
                <div v-if="errorValidateEmail && errorValidateEmail[index]?.err" class="error__validate">{{ errorValidateEmail[index]?.err }}</div>
              </div>

              <div v-if="hiddenButtonAdd" class="revervation__add">
                <button @click="handleAddUI" class="revervation__add--btn">
                  <i class="fa-regular fa-circle-plus"></i>
                </button>
              </div>
              <h4></h4>
            </div>
						
            <div v-else class="list-info list__info--cus">
              <h4>{{ t("revervation.passenger_list") }}</h4>
              <div v-for="(data, index) in valuePassengers" class="form__input_group input__group--cus">
                <label for="">{{ index + NUMBER.FIRST }}{{ t('revervation.passenger_person') }}</label>
                <div class="revervation__add--text">
                  <div class="group__email">
                    <img src="/icons/email_pass.svg" alt="" />
                    <input
                      type="text"
                      :value="data?.email"
                      disabled
                      class="form-control add_credit_card__input revervation__add--input"
                    >
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="isShowButton" class="box__action--cus">
              <button @click="handleBack" class="button button-normal">
                {{ t("revervation.return") }}
              </button>

              <button @click="handleChangeButton" class="button btn-primary">
                {{ t("revervation.keep") }}
              </button>
            </div>

            <div v-else class="box__action--create">
              <button @click="handleBackEdit" class="btn btn__primary">
                {{ t("revervation.btn_fix") }}
              </button>

              <button @click="handleEditSubDriver" class="btn btn__primary">
                {{ t("revervation.btn_keep_booking") }}
              </button>
            </div>
					</div>
				</div>
			</transition>

      <ErrorModal v-if="isShowModalError" @closeModalError="handleBackError" :resError="textError" :buttonCancel="buttonCancel" />
      <ErrorModalYesNo 
        v-if="isShowModalErrorYesNo" 
        @closeModalErrorYesNo="isShowModalErrorYesNo = false"
        @confirmModalErrorYesNo="confirmModalErrorYesNo"
        :resError="textErrorYesNo" 
        :buttonReturn="buttonReturn" 
        :buttonConfirm="buttonConfirm" />
		</div>
	</transition>
</template>