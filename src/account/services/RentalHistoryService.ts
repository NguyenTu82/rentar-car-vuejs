import { urls } from '~/account/utils/urls'
import type { BaseOutput } from '~/common/dtos/base-output.dto'
import BaseService, { METHODS } from '~/common/services/BaseService'

class RentalHistoryService extends BaseService {
  constructor(prefix: string) {
    super(prefix)
  }

  getReservationHistory(): Promise<BaseOutput> {
    return this.performRequest(
      METHODS.GET,
      `${urls.getReservationHistoryList}`,
    )
  }
}

export default new RentalHistoryService('')
