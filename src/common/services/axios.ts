import axios from 'axios';
import { useUserStore } from '~/users/stores/user';
import { AUTHEN } from '../utils/constant';

const http = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

http.interceptors.request.use(async (config) => {
	const userStore = useUserStore();
	config.headers = {
		Authorization: `Bearer ${userStore.token}`,
		Accept: 'application/json',
	};
	return config;
});

http.interceptors.response.use(function (response) {
		return response;
	}, function (error) {
		if ((error?.response?.data?.message === AUTHEN.MESSAGE || error?.response?.data?.error === AUTHEN.UNAUTHORIZED_REQUEST) && 
			((window.location.pathname).startsWith('/account') || (window.location.pathname).startsWith('/booking'))) {
			return useUserStore().redirectHome(window.location.origin + '/?param=authenticated')
		}

		if (error?.response?.data?.code === "EUA999_999") {
			useUserStore().logout();
			return useUserStore().redirectHome(window.location.origin)
		}

		return Promise.reject(error);
	}
);

export default http;
