import { BaseOutput } from '~/common/dtos/base-output.dto';
import { Station } from './station.dto';

export class StationOutput extends BaseOutput {
	data: Array<Station> | null = [];
}

export class AvailableStation extends BaseOutput {
	data: Array<string> | null = [];
}
