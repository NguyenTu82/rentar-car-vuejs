export interface Insurance {
	id: string;
	name: string;
	description?: string;
	price: number;
	price_latest: number;
	created_at?: string;
	updated_at?: string;
	required?:number;
	calc_day?:number;
	display_rank :number;
	reasons:string;

}
