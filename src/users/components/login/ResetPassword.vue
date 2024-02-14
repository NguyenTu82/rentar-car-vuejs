<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { STATUS } from '~/common/dtos/base-output.dto';
import { UserResetPasswordInput } from '~/users/dtos/user-resetpassword-input.dto';
import { useUserLoginStore } from '~/users/stores/userLogin';
import { autoConvertFullsizeToHalfsize } from '~/common/utils/common';
import { useDownloadStore } from '~/users/stores/download';
import { useCommonStore } from '~/common/store/CommonStore';

const { isMobile } = storeToRefs(useCommonStore());
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const { t } = useI18n();
const { data } = storeToRefs(useUserLoginStore());
const userStore = useUserLoginStore();

const inputResetPassword = ref<UserResetPasswordInput>(new UserResetPasswordInput());
const email_verify_code = ref('');

function resetPassword() {
	userStore.resetPassword(inputResetPassword.value);
}

function resendCode() {
	userStore.resendCode();
}
const errorMessage = computed(() => {
	return data.value.status === STATUS.ERROR && data.value.message.length > 0 ? data.value.message : '';
});

watch(email_verify_code, (newValue: string) => {
	nextTick(() => {
		email_verify_code.value = autoConvertFullsizeToHalfsize(newValue);
		inputResetPassword.value.email_verify_code = email_verify_code.value;
	});
});
</script>

<template>
	<section class="form">
		<div class="form__title" :class="{ mgtop_download: checkShowDownLoadUqey && isMobile }">
			<h1 class="title_resetpw">{{ t('user.reset_password') }}</h1>
			<div class="__text">
				<h3>{{ t('user.send_password_reset_email') }}</h3>
			</div>
		</div>
		<form method="post">
			<div class="form__group">
				<label for="newpassword1">{{ t('user.new_password') }} <span class="text-danger">*</span></label>
				<input
					id="password"
					v-model="inputResetPassword.password"
					class="form-control login_input"
					:class="{ 'border-danger': errorMessage.length > 0 }"
					type="password"
					outline="none active:none"
					required
				/>
			</div>
			<div class="form__group">
				<label for="newpassword2">{{ t('user.re_enter_password') }} <span class="text-danger">*</span></label>
				<input
					id="confirm_password"
					v-model="inputResetPassword.confirm_password"
					class="form-control login_input"
					:class="{ 'border-danger': errorMessage.length > 0 }"
					type="password"
					outline="none active:none"
					required
				/>
			</div>
			<div class="form__group">
				<label for="code">{{ t('user.authentication_code') }} <span class="text-danger">*</span></label>
				<input
					id="email_verify_code"
					v-model.trim="email_verify_code"
					class="form-control login_input"
					:class="{ 'border-danger': errorMessage.length > 0 }"
					type="text"
					outline="none active:none"
					required
				/>
			</div>
			<div class="forgot-password">
				<a type="button" @click="resendCode">{{ t('user.resend_verification_code') }}</a>
			</div>

			<div v-if="errorMessage.length > 0" class="alert alert-danger mt-2 error-message" role="alert">
				{{ t('user.login_error') }} {{ errorMessage }}
			</div>
			<a class="button" @click="resetPassword"> {{ t('user.keep') }} </a>
		</form>
	</section>
</template>
<style scoped lang="scss">
.mgtop_download {
	margin-top: 6rem;
}
.title_resetpw {
	@media screen and (max-width: 480px) {
		margin-top: 14px;
	}
}
</style>
