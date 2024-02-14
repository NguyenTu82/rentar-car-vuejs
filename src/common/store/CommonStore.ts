import { acceptHMRUpdate, defineStore } from 'pinia';

export const useCommonStore = defineStore('CommonStore', () => {
	const isMobile = ref(window.innerWidth <= 480);

	addEventListener("resize", (event) => {		
		isMobile.value = window.innerWidth <= 480;
	});

	return {
		isMobile,
	};
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useCommonStore, import.meta.hot));
