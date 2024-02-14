import { BaseOutput } from '~/common/dtos/base-output.dto'

export class ReservationOutput extends BaseOutput {
  data: {
    accessories: any | null
    brand: string
    capacity: number
    current_dt: string
    displacement: string
    end_time: string
    fuel: string
    fuel_type: string
    height: string
    id: string
    img: string
    img2: string | null
    img3: string | null
    img4: string | null
    insurance_fee: string | null
    insurances: []
    length: string
    name: string
    overtime: string | null
    start_time: string
    station_end_address: string
    station_end_name_jp: string
    station_start_address: string
    station_start_name_jp: string
    total_amount: number
    usage_fee: number
    vehicle_number: number | null
    width: string
    sub_driver_check: any
    subdrivers: any
  } | null = null
}
