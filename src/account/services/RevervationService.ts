import type { BaseOutput } from '~/common/dtos/base-output.dto'
import BaseService, { METHODS } from '~/common/services/BaseService'
import { urls } from '~/account/utils/urls'

class ReservationService extends BaseService {
  constructor(prefix: string) {
    super(prefix)
  }

  getCancelReason(): Promise<BaseOutput> {
      return this.performRequest(METHODS.GET, `get_cancel_reason`)
    }
  getReservationList(): Promise<BaseOutput> {
    return this.performRequest(METHODS.GET, `${urls.getReservationList}`,{new_version : true})
  }
  getReservationDetail(data :any): Promise<BaseOutput> {
    return this.performRequest(METHODS.POST, `${urls.getReservationDetail}`,{vehicle_id: data})
  }
  deleteReservation(data: any): Promise<BaseOutput> {
    return this.performRequest(METHODS.POST, `${urls.deleteReservation}`, data ).then((result) => {
      return <BaseOutput>result
    })
  }
  getPricedelete(data: any): Promise<BaseOutput> {
    return this.performRequest(METHODS.POST, `${urls.getPriceDelete}`, {reservation_id : data} ).then((result) => {
      return <BaseOutput>result
    })
  }

  checkSubDriver(data: any): Promise<BaseOutput> {
    return this.performRequest(METHODS.POST, `${urls.checkSubDriver}`, data ).then((result) => {
      return <BaseOutput>result
    })
  }

  updateSubDriver(data: any): Promise<BaseOutput> {
    return this.performRequest(METHODS.POST, `${urls.updateSubDriver}`, data ).then((result) => {
      return <BaseOutput>result
    })
  }
}

export default new ReservationService('')
