import { urls } from '~/account/utils/urls';
import BaseService, { METHODS } from '~/common/services/BaseService';
import { CreditCardOutput } from '../dtos/value-creditcard.dto';

class CreditInfoService extends BaseService {
	constructor(prefix: string) {
		super(prefix);
	}

	getCreditInfo(): Promise<CreditCardOutput> {
		return this.performRequest(METHODS.GET, `${urls.getCreditInforList}`, {
			new_version: true,
		});
	}

	addCreditInfo(data: any) {
		return this.performRequest(METHODS.POST, `add_credit_card`, data);
	}

	deleteCreditInfo(id: any) {
		return this.performRequest(METHODS.POST, `delete_credit`, id);
	}
	saveErrorTokenGmo(data: any) {
		return this.performRequest(METHODS.POST, `save_error_token_gmo`, data);
	}
}

export default new CreditInfoService('');
