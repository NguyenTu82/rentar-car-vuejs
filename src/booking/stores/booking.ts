import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { CreditCard } from '~/account/dtos/value-creditcard.dto';
import { useCreditInfoStore } from '~/account/stores/CreditInfoStore';
import { AvailableVehicle, AvailableVehicleInput, Category, VehicleDetail } from '~/booking/dtos/available-vehicle.dto';
import { Station } from '~/booking/dtos/station.dto';
import BookingService from '~/booking/services/BookingService';
import { BaseOutput, STATUS } from '~/common/dtos/base-output.dto';
import { toFormattedDateTime } from '~/common/utils/formatter';
import { Insurance } from '../dtos/insurance.dto';
import { useInsuranceStore } from './insuranceStores';

export const useBookingStore = defineStore('booking', () => {
	const stationList = ref<Array<Station>>([]);
	const availableStationIds = ref<Array<string>>([]);
	const data = ref<BaseOutput>(new BaseOutput());
	const boardingPlace = ref<Station | null>(null);
	const returnPlace = ref<Station | null>(null);
	const workingDays = ref<string[]>([]);
	const boardingTime = ref<Date | null>(null);
	const returnTime = ref<Date | null>(null);
	const availableVehicles = ref<AvailableVehicle[]>();
	const listCategories = ref<Category[]>([]);
	const vehicleDetail = ref<VehicleDetail | null>(null);
	const totalBooking = ref(0);
	const { selected } = storeToRefs(useInsuranceStore());
	const { valueChoiceCard } = storeToRefs(useCreditInfoStore());
	const selectedCategory = ref<any>();
	const resError = ref<any>('');
	const selectedStation = ref();
	const twoWay = ref(false);
	const checkCallApiStation = ref(true);
	const checkCallApiDate = ref(true);
	const listOptions = ref<Insurance[]>([]);
	const selectedOption = ref<Insurance[]>([]);
	const listSubDriver = ref<any>([]);
	const numberOption = ref<any>({});
	const checkPickup = ref(false);
	const text_notify_user = ref<string>('');
	const text_problem_user = ref<string>('');
	const checkErrorInput = ref(false);
	const totalUsageFee = ref(0);
	async function selectOptions(data: any) {
		selectedOption.value = data;
	}
	async function selectNumberOptions(data: any) {
		numberOption.value = data;
	}
	const isReadyToSearch = computed(() => {
		return Boolean(boardingPlace.value && returnPlace.value && boardingTime.value && returnTime.value);
	});

	async function searchStations(location?: any) {
		return BookingService.searchStations(location).then((output) => {
			data.value = output;

			if (output.status === STATUS.SUCCESS) {
				// TODO: need to improve
				stationList.value = output.data || [];
				checkCallApiStation.value = false;
			}

			return output.data || [];
		});
	}

	const fetchWorkingDay = async () => {
		return BookingService.getWorkingDays().then((res) => {
			if (res.status === STATUS.SUCCESS) {
				workingDays.value = res.data;
				checkCallApiDate.value = false;
			}

			return res.data || [];
		});
	};

	const fetchAvailableVehicle = async (category_id?: number) => {
		const data: AvailableVehicleInput = {
			start_time: toFormattedDateTime(boardingTime.value as Date, 24),
			end_time: toFormattedDateTime(returnTime.value as Date, 24),
			new_version: true,
		};

		if (category_id) {
			data.category_id = category_id;
		}

		const station_id = boardingPlace.value?.id ?? '';
		resError.value = '';
		const res = await BookingService.getAvailableVehicle(station_id, data);
		if (res.status === STATUS.SUCCESS) {
			availableVehicles.value = res.data;
		} else {
			availableVehicles.value = [];
			resError.value = res?.message;
		}
	};

	const fetchCategory = async (franchise_id: any) => {
		const data = {
			franchise_id,
		};
		const res = await BookingService.getCategory(data);
		if (res.status === STATUS.SUCCESS) {
			const listData = [{ id: 0, name: 'すべて' }, ...res.data];
			listCategories.value = listData;
		}
		return res.data || [];
	};

	const fetchVehicleDetail = async (id: string) => {
		const data = {
			vehicle_id: id,
			start_time: toFormattedDateTime(boardingTime.value as Date, 24),
			end_time: toFormattedDateTime(returnTime.value as Date, 24),
		};
		const res = await BookingService.getVehicleDetail(data);
		if (res.status === STATUS.SUCCESS) {
			vehicleDetail.value = res.data;
		}
	};

	const setBoardingPlace = (place: Station | null) => {
		boardingPlace.value = place;

		if (place === null) {
			twoWay.value = false;
			setReturnPlace(null);
		}

		if (place?.oneway === 2) {
			setReturnPlace(place);
		}
	};

	const setReturnPlace = (place: Station | null) => {
		returnPlace.value = place;
	};

	const setSelectedCategory = (id: number) => {
		selectedCategory.value = id;
	};

	const setClearSelectedCategory = () => {
		selectedCategory.value = '';
	};

	const setListSubDriver = (data: any = '') => {
		listSubDriver.value = data;
	};
	const totalFee = () =>{
		let fee = 0;
		if (!vehicleDetail.value?.calc_result) {
			fee = vehicleDetail.value?.unit_price || 0;
		} else {
			for (const calc of vehicleDetail.value?.calc_result) {
				fee += calc.amount;
			}
		}

		if (vehicleDetail.value?.count_day && vehicleDetail.value?.count_day > 0 && !vehicleDetail.value?.calc_result) {
			fee += vehicleDetail.value?.per_night_price * vehicleDetail.value?.count_day;
		}
		totalUsageFee.value = fee
	}
	const usage_fee = computed(() => {
		let fee = 0;
		if (!vehicleDetail.value?.calc_result) {
			fee = vehicleDetail.value?.unit_price || 0;
		} else {
			for (const calc of vehicleDetail.value?.calc_result) {
				fee += calc.amount;
			}
		}

		if (vehicleDetail.value?.count_day && vehicleDetail.value?.count_day > 0 && !vehicleDetail.value?.calc_result) {
			fee += vehicleDetail.value?.per_night_price * vehicleDetail.value?.count_day;
		}

		return fee;
	});

	const finishBooking = async () => {
		resError.value = '';
		let arrayIdIsurance = selected.value.map((item) => {
			return item.id;
		});
		let araylistOption: any = [];
		selectedOption.value.map((item) => {
			if (numberOption.value[item.id] !== '') {
				araylistOption.push({ id: item.id, quantity: Number(numberOption.value[item.id]) });
			}
		});
		const data = {
			start_time: toFormattedDateTime(boardingTime.value as Date, 24),
			end_time: toFormattedDateTime(returnTime.value as Date, 24),
			station_start_id: (boardingPlace.value as Station).id,
			station_end_id: (returnPlace.value as Station).id,
			vehicle_id: (vehicleDetail.value as VehicleDetail).vehicle_id,
			user_payments_id: (valueChoiceCard.value as CreditCard).id,
			vehicle_insurance_id: JSON.stringify(arrayIdIsurance),
			usage_fee: usage_fee.value,
			vehicle_option_id_list: JSON.stringify(araylistOption),
			pack_id: (vehicleDetail.value as VehicleDetail).pack_id,
			pack_name: (vehicleDetail.value as VehicleDetail).pack_name,
			unit_price: (vehicleDetail.value as VehicleDetail).unit_price,
			count_day: (vehicleDetail.value as VehicleDetail).count_day,
			calc_name: (vehicleDetail.value as VehicleDetail).calc_name,
			list_sub_driver: listSubDriver.value,
			pick_up_type: checkPickup.value == true ? 1 : 0,
			show_info_to_station: boardingPlace.value.show_info_to_station,
			pick_up_info: checkPickup.value ? text_notify_user.value : null,
			info_to_station: text_problem_user.value.replaceAll(' ', '').length == 0 ? null : text_problem_user.value,
			new_version: true,
			calc_result: vehicleDetail.value?.calc_result,
			pack_season: vehicleDetail.value?.pack_season,
		};
		const res = await BookingService.confirmBooking(data);
		console.log('🚀 ~ file: booking.ts:203 ~ finishBooking ~ res', res);
		console.log('🚀 ~ file: booking.ts:203 ~ finishBooking ~ data', data);
		if (res.status === STATUS.ERROR) {
			resError.value = res?.message;
		}
		return res;
	};
	const setTotalBooking = (total: number) => {
		totalBooking.value = total;
	};
	const resetStateBooking = () => {
		boardingTime.value = null;
		returnTime.value = null;
		boardingPlace.value = null;
		returnPlace.value = null;
		checkPickup.value = false;
		text_notify_user.value = '';
		text_problem_user.value = '';
		checkErrorInput.value = false;
	};
	const resetStationProblemUser = () => {
		checkPickup.value = false;
		text_notify_user.value = '';
		text_problem_user.value = '';
		checkErrorInput.value = false;
	};

	const updateSelectedStation = (selected: any) => {
		if (!!selected && !!returnPlace.value) {
			return;
		}
		selectedStation.value = selected;
		if (selected?.oneway === 2) {
			twoWay.value = true;
		} else {
			twoWay.value = false;
		}
	};
	const getListOption = async (data: any) => {
		resError.value = '';
		const res = await BookingService.searchOptions(data);
		if (res?.status === STATUS.SUCCESS) {
			const listData1 = [...res.data];
			let listDataSort = listData1.sort(function (a, b) {
				if (a.display_rank === b.display_rank) {
					if (a.name > b.name) return 1;
					if (a.name < b.name) return -1;
					if (a.name === b.name) return 0;
				}
				return a.display_rank - b.display_rank;
			});
			listOptions.value = listDataSort;
		} else if (res?.status === STATUS.ERROR) {
			resError.value = res?.message;
		}
	};
	async function resetSelectOption() {
		selectedOption.value = [];
	}

	async function checkStationAvailable() {
		if (boardingTime.value && returnTime.value) {
			checkCallApiStation.value = true;
			BookingService.checkStationAvailable({
				start_time: toFormattedDateTime(boardingTime.value as Date, 24),
				end_time: toFormattedDateTime(returnTime.value as Date, 24),
			}).then((output) => {
				data.value = output;

				if (output.status === STATUS.SUCCESS) {
					// TODO: need to improve
					availableStationIds.value = output.data || [];
					checkCallApiStation.value = false;
				}

				return output.data || [];
			});
		}
	}

	const availableStationList = computed(() => {
		if (availableStationIds.value.length === 0) return stationList.value;
		if (!boardingTime.value || !returnTime.value) return stationList.value;
		return stationList.value.filter((s) => availableStationIds.value.find((a) => a === s.id));
	});

	return {
		totalUsageFee,
		checkPickup,
		text_notify_user,
		text_problem_user,
		data,
		resError,
		listOptions,
		selectedOption,
		numberOption,
		checkCallApiStation,
		checkCallApiDate,
		boardingPlace,
		returnPlace,
		boardingTime,
		returnTime,
		stationList: availableStationList,
		availableStationIds,
		workingDays,
		isReadyToSearch,
		availableVehicles,
		listCategories,
		vehicleDetail,
		selectedCategory,
		selectedStation,
		twoWay,
		listSubDriver,
		checkStationAvailable,
		fetchWorkingDay,
		setBoardingPlace,
		setReturnPlace,
		searchStations,
		fetchAvailableVehicle,
		fetchCategory,
		fetchVehicleDetail,
		finishBooking,
		setTotalBooking,
		resetStateBooking,
		setSelectedCategory,
		setClearSelectedCategory,
		updateSelectedStation,
		getListOption,
		selectOptions,
		resetSelectOption,
		setListSubDriver,
		selectNumberOptions,
		resetStationProblemUser,
		checkErrorInput,
		totalFee
	};
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useBookingStore, import.meta.hot));
