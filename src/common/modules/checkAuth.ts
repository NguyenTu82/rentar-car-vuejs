import type { UserModule } from '~/types';
import { useUserStore } from '~/users/stores/user';
import { useBookingStore } from '~/booking/stores/booking';
import { NUMBER } from '~/common/utils/constant';
import { STEPS, useUserCreateStore } from '~/users/stores/userCreate';
import {setLocalStorage} from '~/common/utils/localStorage';

/**
 *
 * Redirect to home if access login page while logged in
 *
 */
export const install: UserModule = ({ isClient, router }) => {
	if (isClient) {
		router.beforeEach(async (to, from, next) => {
			const pathTo = to.path;
			const bookingStore = useBookingStore();
			if (!bookingStore.isReadyToSearch && pathTo.startsWith('/booking')) {
				return next({ path: '/' });
			}

			const userStore = useUserStore();
			if (userStore.token) {
				if (userStore.data?.data?.reg_step === NUMBER.FIRST) {
					const redirectToHomePaths = [
						'/',
						'/login',
						'/account/member-information',
						'/account/reservation-status',
						'/account/reservation-status/detail',
						'/account/rental-history',
						'/account/rental-history/detail',
						'/account/credit-card'
					]
					if (!redirectToHomePaths.includes(pathTo)) {
						return next();
					}
		
					await userStore.load();
					if (userStore.isLoggedIn) {
						const userCreateStore = useUserCreateStore()
						if (userCreateStore.currentStep === STEPS.FINAL) {
							return next({ path: '/' });
						}
						return next({ path: '/register' });
					}
					return next()
				}
				
				
				const redirectToHomePaths = ['/login', '/register'];
				if (!redirectToHomePaths.includes(pathTo)) {
					return next();
				}
	
				await userStore.load();
				if (userStore.isLoggedIn) {
					return next({ path: '/' });
				}
			} else {
				const redirectToHomePaths = [
					'/account/member-information',
					'/account/reservation-status',
					'/account/reservation-status/detail',
					'/account/rental-history',
					'/account/rental-history/detail',
					'/account/credit-card'
				]
				if (redirectToHomePaths.includes(pathTo)) {
					if ('/account/rental-history' === pathTo){
						setLocalStorage("url_previous","/account/rental-history")
					}
					return next({ path: '/login'});
				}
			}

			next();
		});
	}
};
