export class Station {
	name: string = '';
	always_open: number = 0;
	id: string = '';
	franchise_id: string = '';
	mail_address: string | null = null;
	city_id: string = '';
	name_en: string = '';
	name_jp: string = '';
	address: string = '';
	phone: string | null = null;
	latitude: number = 0;
	longitude: number = 0;
	status: number = 0;
	display_rank: number = 0;
	remarks: string = '';
	created_at: string = '';
	updated_at: string = '';
	oneway: number | null = null;
	start_business_time: any = '';
	end_business_time: any = '';
	pick_up_type: number = 0;
	show_pick_up_tittle: number = 0;
	info_from_station : string = ''
}
