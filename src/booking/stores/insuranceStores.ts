import { acceptHMRUpdate, defineStore } from 'pinia';
import { Ref } from 'vue';
import { Insurance } from '~/booking/dtos/insurance.dto';
import { STATUS } from '~/common/dtos/base-output.dto';
import insuranceService from '../services/insuranceService';

export const useInsuranceStore = defineStore('Insurance', () => {
	const listInsurances = ref<Insurance[]>([]);
	const selected = ref<Insurance[]>([]);
	const resError = ref<any>('');
	const checkError = ref<any>(false);

	async function selectInsurance(data: Insurance[]) {
		selected.value = data;
	}

	async function getListInsurance(data: any) {
		resError.value = '';
		checkError.value = false;
		const res = await insuranceService.insurances(data);
		if (res?.status === STATUS.SUCCESS) {
			const listData = [...res.data];
			selected.value = listData.filter(item => item.required ==1)
			listData.sort(function(a,b){
				if(a.required != b.required ){
					return (a.required || 0) -  (b.required||0)
				}
				if(b.display_rank === a.display_rank){
					if(a.name > b.name)
						return 1 
					if(a.name < b.name)
						return -1
					if(a.name === b.name)
						return 0
				}
				return a.display_rank - b.display_rank
			})
			listInsurances.value = listData;
		} else if (res?.status === STATUS.ERROR) {
			checkError.value = true;
			resError.value = res?.message;
		}
	}

	async function resetSelect() {
		selected.value = [];
	}

	return {
		listInsurances,
		selected,
		resError,
		checkError,
		getListInsurance,
		selectInsurance,
		resetSelect,
	};
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useInsuranceStore, import.meta.hot));
