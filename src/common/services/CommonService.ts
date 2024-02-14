import BaseService, { METHODS } from '~/common/services/BaseService';
import { BaseOutput } from '../dtos/base-output.dto';
import { PolicyOutput } from '../dtos/policy-output.dto';

class CommonService extends BaseService {
	constructor(prefix: string) {
		super(prefix);
	}

	getPolicy(): Promise<PolicyOutput> {
		return this.performRequest(METHODS.GET, 'get_policy');
	}
	getSpecifiedCommercialTransaction(): Promise<BaseOutput> {
		return this.performRequest(METHODS.GET, 'specified_commercial_transaction');
	}
}

export default new CommonService('');
