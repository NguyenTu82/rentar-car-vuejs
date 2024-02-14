import { BaseOutput } from '~/common/dtos/base-output.dto';

export interface AvailableVehicleInput {
	start_time: string;
	end_time: string;
	category_id?: number;
	new_version: true;
}

export interface AvailableVehicle {
	id: string;
	id_detail: string;
	brand: string;
	name: string;
	img: string;
	vehicle_number: string;
	category_id: string;
	price: number;
}

export interface Category {
	id: number;
	name: string;
	description?: string;
	remarks?: string;
	created_at?: string;
	updated_at?: string;
}
export interface CalcResult {
	amount: number;
	name: string;
	quantity: number;
}

export interface VehicleDetail {
	id: string;
	station_id: string;
	franchise_id: string;
	status: number;
	created_at: string;
	updated_at: string;
	vehicle_id: string;
	vehicle_model_id: string;
	owner_station_id: string;
	fuel: string;
	img: string;
	img2: string;
	img3: string;
	img4: string;
	remarks: string;
	display_rank: number;
	wa_license_reg_date: string;
	wa_license_cancel_date: null;
	vehicle_number: string;
	vehicle_detail_remark: string;
	vehicle_detail_display_rank: number;
	vehicle_detail_img: string;
	price: number;
	category_id: string;
	brand: string;
	name: string;
	capacity: number;
	displacement: string;
	length: string;
	width: string;
	height: string;
	fuel_type: string;
	vehicle_model_remark: string;
	vehicle_model_display_rank: number;
	vehicle_model_img: string;
	max_load_capacity: number;
	vehicle_total_weight: number;
	auto_manual: number;
	licence_valid_alert: boolean;
	per_night_price:number;
	count_day:number;
	calc_name:string;
	pack_id:string;
	pack_name:string;
	unit_price:number;
	fc_terms: string;
	terms_url: any;
	fp_terms: string;
	calc_result: CalcResult[];
}

export class AvailableVehicleOutput extends BaseOutput {
	data: AvailableVehicle[] = [];
}

export class VehicleDetailOutput extends BaseOutput {
	data: VehicleDetail[] = [];
}

export class CategoryOutput extends BaseOutput {
	data: Category[] = [];
}
