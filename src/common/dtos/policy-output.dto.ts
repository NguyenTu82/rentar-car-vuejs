import { BaseOutput } from './base-output.dto';
import { Policy } from './policy.dto';

export class PolicyOutput extends BaseOutput {
	data: Array<Policy> = [];
}
