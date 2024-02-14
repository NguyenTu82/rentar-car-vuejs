import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { BaseOutput, STATUS } from '~/common/dtos/base-output.dto';
import { clearLocalStorage } from '~/common/utils/localStorage';
import { UserInfo } from '../dtos/user-info.dto';
import UserService from '../services/UserService';
import { STEPS, useUserCreateStore } from './userCreate';
import { useUserInfoStore } from '~/account/stores/UserInfoStore';
import { useUserLoginStore } from './userLogin';
export const useUserStore = defineStore(
	'user',
	() => {
		const userCreateStore = useUserCreateStore();
		const data = ref<BaseOutput>(new BaseOutput());
		const token = ref('');
		const refreshToken = ref('');
		const user = ref<UserInfo>(new UserInfo());
		const UserInfoStore = useUserInfoStore()
		const {userInfo} = storeToRefs(UserInfoStore)
		const checkShowModal = ref(false)
		const UserLoginStore = useUserLoginStore()
		const {data:dataLogin} = storeToRefs(UserLoginStore)
		const checkShowDownLoadUqey= ref(true)
		watch(token, (newToken) => {
			console.log({
				newToken,
			});

			load();

			setTimeout(() => refresh(), 1000 * 60 * 15);
		});

		function refresh() {
			UserService.refresh(user.value.email, refreshToken.value)
				.then((response) => {
					const { AccessToken, RefreshToken } = response.data?.data ?? {};
					token.value = AccessToken ?? '';
					refreshToken.value = RefreshToken ?? '';
				})
				.catch(() => logout());
		}

		function changeToken(newToken: string, refresh: string) {
			token.value = newToken;
			refreshToken.value = refresh;
		}

		function load() {
			if (!token.value) {
				logout();
				return;
			}

			return UserService.load().then((response) => {
				data.value = response;
				if (response.status === STATUS.SUCCESS && response.data) {
					user.value = response.data;
				} else {
					logout();
				}
			});
		}
		async function logoutApi(){
			await UserService.logout()
		}
		function logout() {
		
			clearLocalStorage();
			token.value = '';
			data.value.data = null;
			user.value = new UserInfo();
			userInfo.value.data = null
			dataLogin.value.data = null;
			userCreateStore.changeStep(STEPS.CREATE);
			checkShowModal.value = true
			const timeOut = setTimeout(() => {
				checkShowModal.value = false
				clearTimeout(timeOut)
			}, 2000)
		}

		const isLoggedIn = computed(() => {
			return (token.value.length > 0 || refreshToken.value.length > 0) && user.value.email.length > 0;
		});

		function redirectHome(page: any) {
			window.location.href = page;
		}

		return {
			checkShowDownLoadUqey,
			data,
			token,
			user,
			isLoggedIn,
			changeToken,
			load,
			logout,
			redirectHome,
			checkShowModal,
			logoutApi
		};
	},
	{
		persist: true,
	},
);

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
