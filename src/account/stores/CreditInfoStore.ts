import { error } from 'cypress/types/jquery'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { Ref } from 'vue'
import CreditInfoService from '~/account/services/CreditInfoService'
import { BaseOutput, STATUS } from '~/common/dtos/base-output.dto'
import { validateInput } from '~/common/dtos/validate.dto'
import AddCardInput from '../dtos/add-card-input.dto'
import { CreditCard } from '../dtos/value-creditcard.dto'
// import './token'

export const useCreditInfoStore = defineStore('CreditInfoStore', () => {
  const creditInfo = ref<BaseOutput>(new BaseOutput());
  const errorValidate = ref('')
  const errorValidateAdd = ref('')
  const successValidateAdd = ref('')
  const errorValidateGetCredit: Ref<any> = ref('')
  const successValidate = ref('')
  const addCreditInfo: any = ref('')
  const checkOnModal: Ref<any> = ref('false')
  const checkSuccess: Ref<any> = ref('false')

	const valueChoiceCard = ref<CreditCard | null >(null)

  async function getCreditInfo() {
    errorValidateGetCredit.value = ''
    const data = await CreditInfoService.getCreditInfo().then((result) => {
      if (result?.status === STATUS.ERROR) {
        errorValidateGetCredit.value = result?.message
      }
      return result
    }).catch((reason) => {
      errorValidateGetCredit.value = reason
    })
    if (data?.status === STATUS.SUCCESS){
      creditInfo.value = data
    }
  }

  async function postAddCard(data: any) {
    const validate = await validateInput(AddCardInput, data)
    if (validate.errors) {
      return validate
    }
    const values = {
      brand: data?.brand,
      token: data?.token
    }
    errorValidateAdd.value = ''
    successValidateAdd.value = ''
    const res = await CreditInfoService.addCreditInfo(values).then((result) => {
      if (result?.status === STATUS.ERROR) {
        errorValidateAdd.value = result?.message
      } else {
        successValidateAdd.value = result?.message
      }
      return result
    }).catch((reason) => {
      errorValidateAdd.value = reason
    })
    if (res?.status === STATUS.SUCCESS){
      checkOnModal.value = true

      addCreditInfo.value = res
      return res
    }
  }

  async function handleDelete(id: any) {
    errorValidate.value = ''
    const res = await CreditInfoService.deleteCreditInfo(id).then((result) => {
      if (result?.status === STATUS.SUCCESS) {
        checkSuccess.value = true
      } else {
        checkSuccess.value = false
        errorValidate.value = result?.message
      }
      return result
    }).catch((reason) => {
      errorValidate.value = reason
    })
  }

  async function validateForm(data: AddCardInput) {
    const validate = await validateInput(AddCardInput, data)
    if (validate.errors) {
      return validate
    }
  }
  async function resetError() {
    errorValidate.value = ''
    errorValidateAdd.value = ''
    successValidateAdd.value = ''
	}

  const setCheckCredit = (newValue: boolean) => {
		checkSuccess.value = newValue;
	};

  function resStatus(status: any, message: any) {
    switch (status) {
      case STATUS.ERROR:
        return errorValidate.value = message
      case STATUS.SUCCESS:
        return successValidate.value = message
  
      default:
        return
    }
  }
  const selectedCard = (data: CreditCard | null) => {
		valueChoiceCard.value = data;
	};
  const resetStateCard = () => {
    valueChoiceCard.value = null
 };

  return {
    creditInfo,
    errorValidate,
    errorValidateAdd,
    successValidateAdd,
    errorValidateGetCredit,
    checkSuccess,
		valueChoiceCard,
    checkOnModal,
    getCreditInfo,
    postAddCard,
    validateForm,
    handleDelete,
    resetError,
    setCheckCredit,
    selectedCard,
    resetStateCard,
  }
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCreditInfoStore, import.meta.hot))
