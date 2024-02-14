import { validateInput } from '~/common/dtos/validate.dto';
import { NUMBER } from './../../common/utils/constant';
import { acceptHMRUpdate, defineStore } from 'pinia'
import ReservationService from '~/account/services/RevervationService'
import { BaseOutput, STATUS } from '~/common/dtos/base-output.dto'
import { ReservationOutput } from '../dtos/reservation-output.dto'

export const useReservationStore = defineStore('ReservationStore', () => {
  const reservationStatus = ref<BaseOutput>(new BaseOutput())
  const reservationDetail = ref<any>('')
  const errorValidate = ref('')
  const errorValidateGetReser = ref('')
  const successValidate = ref('')
  const checkReservationStatus= ref(true)
  const getPriceDelBoking= ref<number>(0)
  const stepPassenger = ref(NUMBER.FIRST)
  const listSubDriver = ref<any>([])
  const checkPerson = ref<any>(NUMBER.ZERO)
  const vehicleInfo = ref<any>('')
  const vehicleHistoryInfo = ref<any>('')
  const listReasonCancel = ref<any>([])
  const selectedOptionCancel = ref<any>([])
  const reasonCancelBooking = ref ('')
  async function getListCancelReason() {
    await ReservationService.getCancelReason().then((result) => {
      if (result?.status === STATUS.SUCCESS) {
        listReasonCancel.value = result.data
      } 
    }).catch((reason) => {
      errorValidate.value = reason
    })
  }

  async function getReservationStatus() {
    checkPerson.value = NUMBER.ZERO
    errorValidateGetReser.value = ''
    const data = await ReservationService.getReservationList().then((result) => {
      if (result?.status === STATUS.ERROR) {
        errorValidateGetReser.value = result?.message
      }
      return result
    }).catch((reason) => {
      errorValidateGetReser.value = reason
    })

    if (data?.status === STATUS.SUCCESS)
      reservationStatus.value = data
  }
  async function getReserverDetail(data: any) {
    errorValidate.value = ''
    await ReservationService.getReservationDetail(data).then((result) => {
      if (result?.status === STATUS.SUCCESS) {
        vehicleInfo.value = result.data
      } 
    }).catch((reason) => {
      errorValidate.value = reason
    })
  }
  async function getrentalHisDetail(data: any) {
    errorValidate.value = ''
    await ReservationService.getReservationDetail(data).then((result) => {
      if (result?.status === STATUS.SUCCESS) {
        vehicleHistoryInfo.value = result.data
      } 
    }).catch((reason) => {
      errorValidate.value = reason
    })
  }

  async function deleteReservationStatus(data: any) {
    errorValidate.value = ''
    successValidate.value = ''
    await ReservationService.deleteReservation(data).then((result) => {
      if (result?.status === STATUS.SUCCESS) {
        checkReservationStatus.value = true
      } else {
        checkReservationStatus.value = false
        errorValidate.value = result?.message
      }
    }).catch((reason) => {
      errorValidate.value = reason
    })
  }

  const setCheckReservation = (newValue: boolean) => {
		checkReservationStatus.value = newValue;
	};

  async function setReservationDetail(data: any) {
    let tmpSub: any = []
    data?.subdrivers?.sort((a: any, b: any) => a.person_no !== b.person_no ? a.person_no < b.person_no ? -1 : 1 : 0);
    data?.subdrivers?.map((sub: any) => {
      return tmpSub.push({
        email: sub?.email,
        person_no: sub?.person_no || ''
      })
    })
    
    listSubDriver.value = tmpSub
    reservationDetail.value = data
  }

  async function setSubDrive(data: any) {
    checkPerson.value = NUMBER.FIRST
    listSubDriver.value = data
  }

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

  async function getPriceDeleteBooking(data: any) {
    await ReservationService.getPricedelete(data).then((result) => {
      if (result?.status === STATUS.SUCCESS) {
        getPriceDelBoking.value = result.data
      } 
    }).catch((reason) => {
      errorValidate.value = reason
    })
  }

  async function checkSubDriver(sub_driver_email_list: any) {
    const data = {
      sub_driver_email_list
    }
    errorValidate.value = ''
    // successValidate.value = ''
    const res: any = await ReservationService.checkSubDriver(data).then((result) => {
      if (result?.status === STATUS.ERROR) {
        errorValidate.value = result?.message
      }
      return result
    }).catch((reason) => {
      errorValidate.value = reason
    })
    
    return res
  }

  async function updateSubDriver(sub_driver_email_list: any) {
    const data = {
      sub_driver_email_list
    }
    errorValidate.value = ''
    const res: any = await ReservationService.updateSubDriver(sub_driver_email_list).then((result) => {
      if (result?.status === STATUS.ERROR) {
        errorValidate.value = result?.message
      }
      return result
    }).catch((reason) => {
      errorValidate.value = reason
    })
    
    return res
  }

  const setStepPassenger = (val: any) => {
    stepPassenger.value = val
  }
  const resetStateCancelbooking = ()=>{
    listReasonCancel.value = []
    selectedOptionCancel.value = []
    reasonCancelBooking.value = ''
  }

  return {
    getPriceDelBoking,
    reservationStatus,
    reservationDetail,
    errorValidate,
    errorValidateGetReser,
    checkReservationStatus,
    stepPassenger,
    listSubDriver,
    checkPerson,
    getReservationStatus,
    setReservationDetail,
    deleteReservationStatus,
    setCheckReservation,
    getPriceDeleteBooking,
    setStepPassenger,
    checkSubDriver,
    updateSubDriver,
    setSubDrive,
    getReserverDetail,
    vehicleInfo,
    getrentalHisDetail,
    vehicleHistoryInfo,
    getListCancelReason,
    listReasonCancel,
    selectedOptionCancel,
    reasonCancelBooking,
    resetStateCancelbooking
  }
},
{
  persist: true,
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useReservationStore, import.meta.hot))
