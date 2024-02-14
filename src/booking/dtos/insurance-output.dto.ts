import { BaseOutput } from '~/common/dtos/base-output.dto';
import { Insurance } from './insurance.dto'

export class InsuranceOutput extends BaseOutput {
  data: Insurance[] = [];
}
