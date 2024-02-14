<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '~/account/stores/UserInfoStore';
import { TAB_ACCOUNT } from '~/common/utils/constant';
import { getLocalStorage } from '~/common/utils/localStorage';
import { useUserStore } from '~/users/stores/user';
import { STEPS, useUserCreateStore } from '~/users/stores/userCreate';
import { useCommonStore } from '../store/CommonStore';

const { isMobile } = storeToRefs(useCommonStore());
const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const userCreate = useUserCreateStore();
const userInfoStore = useUserInfoStore();
const { isLoggedIn } = storeToRefs(userStore);
const { currentStep } = storeToRefs(userCreate);
const isShowModalLogout = ref(false);
const windowWidth = ref<any>(window.innerWidth);
const btnHidden = ref<any>(false);
const menuHidden = ref<any>(false);
const hideButtonDownloadApp = ref<any>(false);
const userInfoUrl = computed(() => {
	return '/account/member-information';
});

const dataUserInf = computed(() => {
	return userStore.data?.data || '';
});

onMounted(async () => {
	hideButtonDownloadApp.value = getLocalStorage('checkShowDownLoadUqey');
	if (windowWidth.value <= 480) {
		btnHidden.value = true;
		menuHidden.value = true;
	}
});

const hiddenMenu = () => {
	menuHidden.value = true;
};

const isPageregister = asyncComputed(() => {
	return (
		router.currentRoute.value.name === 'register-update-information' ||
		router.currentRoute.value.name === 'register-sms-verification'
	);
}, true);

function register() {
	hiddenMenu();
	userCreate.changeStep(STEPS.CREATE);
	router.push('/register');
}

const handleReservationStatus = () => {
	hiddenMenu();
	router.push('/account/reservation-status');
};

const hanldeToHome = () => {
	hiddenMenu();
	router.push('/');
};

const handleHiddenMenu = () => {
	menuHidden.value = !menuHidden.value;
};

const hanldeLogout = () => {
	isShowModalLogout.value = true;
	handleHiddenMenu();
};

const hanldeLogin = () => {
	hiddenMenu();
	router.push('/login');
};

const handleUserInfor = () => {
	hiddenMenu();
};
const handleClick = (val: any) => {
	userInfoStore.setTabAccount(val);

	switch (val) {
		case TAB_ACCOUNT.FIRST:
			router.push('/account/member-information');
			break;
		case TAB_ACCOUNT.SECOND:
			router.push('/account/reservation-status');
			break;
		case TAB_ACCOUNT.THIRST:
			router.push('/account/rental-history');
			break;
		case TAB_ACCOUNT.FOUR:
			router.push('/account/credit-card');
			break;

		default:
			break;
	}
};
</script>

<template>
	<div class="header__Home">
		<template v-if="isMobile && !hideButtonDownloadApp">
			<Mobile />
		</template>
		<header class="header">
			<nav class="header__container">
				<span @click="hanldeToHome" class="text-logo">
					<img src="/images/LogoUqey.png" height="55" alt="" />
				</span>

				<div class="top-menu">
					<div v-if="!isPageregister && isLoggedIn && isMobile" class="user_infor_login">
						<template v-if="dataUserInf?.last_name && dataUserInf?.first_name">
							<router-link @click="handleUserInfor" :to="userInfoUrl" class="p-2 cursor-pointer">
								<img v-if="isMobile" class="logo_login_user" src="/icons/user.png" alt="" />
							</router-link>
						</template>
					</div>
					<nav class="header__menu">
						<button v-if="btnHidden && isLoggedIn" class="menu__button" type="button">
							<svg @click="handleHiddenMenu" class="menu__icon" width="32" height="32" aria-hidden="true">
								<use v-if="menuHidden" class="menu__open-icon" href="/images/menu.svg#open" />
								<use v-else class="menu__close-icon" href="/images/menu.svg#close" />
							</svg>
						</button>
						<!-- <ul :class="menuHidden ? 'menu_hidden' : ''" class="header__item" v-if="!isLoggedIn"> -->
						<ul :class="isMobile ? 'notlogin' : 'header__item'" v-if="!isLoggedIn">
							<li :class="isMobile ? 'regester-logo' : 'd-block'" @click="register">
								<img v-if="isMobile" class="logo_login_user" src="/icons/icuser.svg" alt="" />
								<router-link to="/register" class="p-2 cursor-pointer bheader__item--a">{{
									t('button.register')
								}}</router-link>
							</li>
							<li :class="isMobile ? 'login-logo' : 'd-block'" @click="hanldeLogin">
								<img v-if="isMobile" class="logo_login_user ic_login_user" src="/icons/iconloginblue.svg" alt="" />
								<router-link to="/login" class="p-2 cursor-pointer header__item--a">{{
									t('button.login')
								}}</router-link>
							</li>
						</ul>
						<ul :class="menuHidden ? 'menu_hidden' : ''" class="header__item" v-else>
							<!-- <ul class="header__item" v-else> -->

							<li
								v-if="currentStep !== STEPS.SEND_SMS && currentStep !== STEPS.VERIFY_SMS && !isMobile"
								class="d-block"
							>
								<button @click="handleReservationStatus" class="d-block header__booking">
									{{ t('home.booking_confirmation_btn') }}
								</button>
							</li>
							<li v-if="!isPageregister" class="d-block text-end">
								<template v-if="dataUserInf?.last_name && dataUserInf?.first_name">
									<router-link @click="handleUserInfor" :to="userInfoUrl" class="p-2 cursor-pointer">
										{{ `${dataUserInf?.last_name} ${dataUserInf?.first_name} 様` }}
									</router-link>
								</template>
							</li>
							<li
								v-if="currentStep !== STEPS.SEND_SMS && currentStep !== STEPS.VERIFY_SMS && isMobile"
								class="d-block text-end"
								id="scroll__leave"
							>
								<router-link to="/" class="p-2 cursor-pointer header__item--a">TOP</router-link>
							</li>
							<!-- <TabMenuAccount @click="handleHiddenMenu"/> -->
							<li v-if="isMobile && dataUserInf.last_name" class="d-block text-end" @click="handleHiddenMenu">
								<a class="nav-link menu__account" @click="handleClick(TAB_ACCOUNT.SECOND)">{{
									t('user_infor.reservation_list')
								}}</a>
							</li>
							<li v-if="isMobile && dataUserInf.last_name" class="d-block text-end" @click="handleHiddenMenu">
								<a class="nav-link menu__account" @click="handleClick(TAB_ACCOUNT.THIRST)">{{
									t('user_infor.reservation_history')
								}}</a>
							</li>
							<li v-if="isMobile && dataUserInf.last_name" class="d-block text-end" @click="handleHiddenMenu">
								<a class="nav-link menu__account" @click="handleClick(TAB_ACCOUNT.FOUR)">{{
									t('user_infor.credit_card')
								}}</a>
							</li>

							<li class="d-block text-end">
								<a class="cursor-pointer header__item--a" @click="hanldeLogout">
									{{ t('button.logout') }}
								</a>
							</li>
						</ul>
						<div v-if="!menuHidden" @click="handleHiddenMenu" class="model_show"></div>
					</nav>
				</div>
			</nav>
		</header>
		<ModalLogout v-if="isShowModalLogout" @logout="isShowModalLogout = false" />
	</div>
</template>
<style lang="scss">
.header {
	background-color: #fff;
	.text-logo {
		margin-left: 15px;
		font-weight: bold;
		font-size: 32px;
		color: #2d419a;
	}

	.header__booking {
		border-radius: 20px;
		background: #173ab8;
		padding: 3px 10px;
		color: white;
		border: none;
		min-width: 90px;
		margin-left: 20px;
		font-size: 15px !important;
	}
	.ic_login_user {
		color: #2d419a;
	}
}
</style>
