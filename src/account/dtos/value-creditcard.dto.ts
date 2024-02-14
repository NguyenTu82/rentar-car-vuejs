import { BaseOutput } from "~/common/dtos/base-output.dto"

export interface CreditCard {
	card_holder: string
    card_number: string
    card_seq: number
    created_at:string
    expire_date:string
    id:string
    status:number
    token:string
    updated_at:string
    user_id:string
}
export class CreditCardOutput extends BaseOutput {
	data: CreditCard[] = [];
}