import {
	AvailableVehicleInput,
	AvailableVehicleOutput,
	CategoryOutput,
	VehicleDetailOutput,
} from '~/booking/dtos/available-vehicle.dto';
import { AvailableStation, StationOutput } from '~/booking/dtos/station-output.dto';
import { WorkDayOutput } from '~/booking/dtos/work-day-output.dto';
import BaseService, { METHODS } from '~/common/services/BaseService';

class BookingService extends BaseService {
	constructor(prefix: string) {
		super(prefix);
	}

	searchStations(location: any): Promise<StationOutput> {
		const newVersion = {
			new_version : true
		}
		const data = location ? Object.assign(location,newVersion) : newVersion
		return this.performRequest(METHODS.GET, 'search_station', data);
	}

	checkStationAvailable(data: { start_time: string; end_time: string }): Promise<AvailableStation> {
		return this.performRequest(METHODS.POST, 'check_station_avaiable', data);
	}

	getWorkingDays(): Promise<WorkDayOutput> {
		return this.performRequest(METHODS.GET, 'get_work_day');
	}

	getAvailableVehicle(stationId: string, data: AvailableVehicleInput): Promise<AvailableVehicleOutput> {
		return this.performRequest(METHODS.GET, `vehicle/available/${stationId}`, data);
	}

	getCategory(data: any): Promise<CategoryOutput> {
		return this.performRequest(METHODS.GET, 'get_category', data);
	}

	getVehicleDetail(data: any): Promise<VehicleDetailOutput> {
		return this.performRequest(METHODS.GET, `vehicle/detail/${data.vehicle_id}`, {
			start_time: data.start_time,
			end_time: data.end_time,
		});
	}
	confirmBooking(data: any): Promise<VehicleDetailOutput> {
		return this.performRequest(METHODS.POST, `create_reservation`, data);
	}
	searchOptions(data: any): Promise<VehicleDetailOutput> {
		return this.performRequest(METHODS.GET, `option_search`, data);
	}
}

export default new BookingService('');
