import { acceptHMRUpdate, defineStore } from 'pinia';
import { getLocalStorage } from '~/common/utils/localStorage';

export const useDownloadStore = defineStore('download', () => {
	const checkShowDownLoadUqey = ref(false);
	const getCoo = getLocalStorage('checkShowDownLoadUqey');

	if (getCoo == undefined) {
		checkShowDownLoadUqey.value = true;
	}

	return { checkShowDownLoadUqey };
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useDownloadStore, import.meta.hot));
