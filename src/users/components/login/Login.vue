<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { STATUS } from '~/common/dtos/base-output.dto';
import { useCommonStore } from '~/common/store/CommonStore';
import { NUMBER } from '~/common/utils/constant';
import { getLocalStorage, removeLocalStorage } from '~/common/utils/localStorage';
import { UserLoginInput } from '~/users/dtos/user-login-input.dto';
import { useDownloadStore } from '~/users/stores/download';
import { STEPS, useUserCreateStore } from '~/users/stores/userCreate';
import { useUserLoginStore } from '~/users/stores/userLogin';

const { isMobile } = storeToRefs(useCommonStore());
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const { t } = useI18n();
const userCreate = useUserCreateStore();
const loginStore = useUserLoginStore();
const { data } = storeToRefs(loginStore);
const router = useRouter();
const urlPrevious = getLocalStorage('url_previous');
removeLocalStorage('url_previous');
const loginInput = ref<UserLoginInput>(new UserLoginInput());
function onLogin() {
	loginStore.login(loginInput.value).then((response) => {
		if (response.status === STATUS.SUCCESS) {
			if (response?.data?.user?.reg_step === NUMBER.FIRST) {
				userCreate.changeStep(STEPS.SEND_SMS);
				return router.push('/register');
			}
			if (urlPrevious == '/account/rental-history') {
				router.push('/account/rental-history');
			} else {
				router.replace('/');
			}
		}
	});
}

const errorMessage = computed(() => {
	return data.value.status === STATUS.ERROR && data.value.message.length > 0 ? data.value.message : '';
});

watch(loginInput.value, () => {
	nextTick(() => {
		loginInput.value.password = loginInput.value.password.replace(/\s+/g, '');
	});
});

onUnmounted(() => {
	data.value.message = '';
});
</script>

<template>
	<section class="form">
		<div class="form__title" :class="{ mgtop_download: checkShowDownLoadUqey && isMobile }">
			<h1>{{ t('user.login') }}</h1>
			<div class="__text">
				<h3>{{ t('user.login_member') }}</h3>
				<router-link to="/register">{{ t('user.login_register') }}</router-link>
			</div>
		</div>
		<form method="post" @submit.prevent="onLogin">
			<div class="form__group">
				<label for="email">{{ t('user.login_email') }}</label>
				<input
					id="email"
					v-model="loginInput.email"
					class="form-control login_input"
					:class="{ 'border-danger': errorMessage.length > 0 }"
					type="email"
					outline="none active:none"
				/>
			</div>
			<div class="form__group">
				<label for="password">{{ t('user.login_pasword') }}</label>
				<input
					id="password"
					v-model="loginInput.password"
					class="form-control login_input"
					:class="{ 'border-danger': errorMessage.length > 0 }"
					type="password"
					outline="none active:none"
					@keyup.enter="onLogin"
				/>
			</div>
			<div v-if="errorMessage.length > 0" class="alert alert-danger mt-2 error-message" role="alert">
				{{ t('user.login_error') }} {{ errorMessage }}
			</div>
			<button class="button border">{{ t('user.login') }}</button>
			<div class="forgot-password">
				<router-link to="/forgot-password">{{ t('user.login_forgot_pasword') }}</router-link>
			</div>
		</form>
	</section>
</template>
<style scoped lang="scss">
.mgtop_download {
	margin-top: 4rem;
}
</style>
