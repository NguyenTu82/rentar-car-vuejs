import type ChangeAccountInfoInput from '../dtos/change-account-info-input.dto'
import type { ChangeAccountInfoOutput } from '../dtos/change-account-info-output.dto'
import type { WithdrawOutput } from '../dtos/withdraw-output.dto'
import { urls } from '~/account/utils/urls'
import type { BaseOutput } from '~/common/dtos/base-output.dto'
import BaseService, { METHODS } from '~/common/services/BaseService'
import ChangePassInput from '../dtos/change-pass-input.dto'
import ChangePhoneInput from '../dtos/change-phone-input.dto'
import ChangeCodeInput from '../dtos/change-code-input.dto'

class UserInfoService extends BaseService {
  constructor(prefix: string) {
    super(prefix)
  }

  getlistProblem(): Promise<BaseOutput> {
    return this.performRequest(METHODS.GET, `${urls.get_withdrawal_reason}`)
  }
  
  getUserInfo(): Promise<BaseOutput> {
    return this.performRequest(METHODS.GET, `${urls.getUserInfoList}`,{new_version : true})
  }

  changeAccountInfo(data: ChangeAccountInfoInput): Promise<BaseOutput> {
    return this.performRequest(METHODS.POST, `${urls.postChangeAccInfo}`, data).then((result) => {
      return <BaseOutput>result
    })
  }

  changeGender(data: any): Promise<BaseOutput> {
    return this.performRequest(METHODS.POST, `${urls.postUpdateGender}`, data).then((result) => {
      return <BaseOutput>result
    })
  }

  changePass(data: ChangePassInput): Promise<BaseOutput> {
    return this.performRequest(METHODS.POST, `${urls.postChangePass}`, data).then((result) => {
      return <BaseOutput>result
    })
  }

  postSendSmsCode(data: ChangePhoneInput): Promise<BaseOutput> {
    return this.performRequest(METHODS.POST, `${urls.postSendSmsCode}`, data).then((result) => {
      return <BaseOutput>result
    })
  }

  changePhone(data: ChangeCodeInput): Promise<BaseOutput> {
    return this.performRequest(METHODS.POST, `${urls.postChangePhone}`, data).then((result) => {
      return <BaseOutput>result
    })
  }

  withdraw(data :any): Promise<BaseOutput> {
    return this.performRequest(METHODS.POST, `${urls.postWithDrawal}`,data).then((result) => {
      return <BaseOutput>result
    })
  }
}

export default new UserInfoService('')
