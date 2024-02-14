import BaseService, { METHODS } from '~/common/services/BaseService';
import { InsuranceOutput } from '../dtos/insurance-output.dto';


class InsuranceService extends BaseService {
  constructor(prefix: string) {
    super(prefix);
  }
  insurances(data: any): Promise<InsuranceOutput> {
    return this.performRequest(METHODS.GET, 'insurance_search', data);
  }
}

export default new InsuranceService('');
