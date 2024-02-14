import { acceptHMRUpdate, defineStore } from 'pinia';
import { STATUS } from '~/common/dtos/base-output.dto';
import { Commercial } from '../dtos/specified-commercial-transaction.dto';
import CommonService from '../services/CommonService';

export const useCommercialStore = defineStore('SpecifiedCommercialStore', () => {
	const listCommercial = ref<Array<Commercial>>([]);
	async function getCommercial() {
		CommonService.getSpecifiedCommercialTransaction().then((response) => {
			if (response?.status === STATUS.SUCCESS) {
				listCommercial.value = response.data;
			}
		});
	}
	return {
		listCommercial,
		getCommercial,
	};
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useCommercialStore, import.meta.hot));
