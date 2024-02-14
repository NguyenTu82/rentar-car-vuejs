import { acceptHMRUpdate, defineStore } from 'pinia'
import RentalHistoryService from '~/account/services/RentalHistoryService'
import { BaseOutput, STATUS } from '~/common/dtos/base-output.dto'
import { useReservationStore } from './ReservationStore'

export const useRentalHistoryStore = defineStore('RentalHistoryStore', () => {
  const reservationStore = useReservationStore()
  const rentalHistory = ref<BaseOutput>(new BaseOutput())
  const rentalHistoryDetail = ref<any>('')
  const errorValidate = ref('')
  const errorValidateGetHis = ref('')
  const successValidate = ref('')

  async function getRentalHistory() {
    errorValidateGetHis.value = ''
    const data = await RentalHistoryService.getReservationHistory().then((result) => {
      if (result?.status === STATUS.ERROR) {
        errorValidateGetHis.value = result?.message
      } 
      return result
    }).catch((reason) => {
      errorValidateGetHis.value = reason
    })
    if (data?.status === STATUS.SUCCESS)
      rentalHistory.value = data
  }

  async function getRentalHistoryDetail(data: any) {
    let tmpSub: any = []
    data?.subdrivers?.sort((a: any, b: any) => a.person_no !== b.person_no ? a.person_no < b.person_no ? -1 : 1 : 0);
    data?.subdrivers?.map((sub: any) => {
      return tmpSub.push({
        email: sub?.email,
        person_no: sub?.person_no || ''
      })
    })
    
    reservationStore.listSubDriver = tmpSub
    rentalHistoryDetail.value = data
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

  return {
    rentalHistory,
    rentalHistoryDetail,
    errorValidate,
    errorValidateGetHis,
    getRentalHistory,
    getRentalHistoryDetail,
  }
},
{
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useRentalHistoryStore, import.meta.hot),
  )
}
