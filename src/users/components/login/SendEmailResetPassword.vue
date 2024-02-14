<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { STATUS } from '~/common/dtos/base-output.dto';
import { useUserLoginStore } from '~/users/stores/userLogin';
import { useDownloadStore } from '~/users/stores/download';
import { useCommonStore } from '~/common/store/CommonStore';

const { isMobile } = storeToRefs(useCommonStore());
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const { t } = useI18n();
const { data } = storeToRefs(useUserLoginStore());
const userStore = useUserLoginStore();
const email = ref('');

const errorMessage = computed(() => {
	return data.value.status === STATUS.ERROR && data.value.message.length > 0 ? data.value.message : '';
});

function sendEmail() {
	userStore.sendEmail(email.value);
}
</script>

<template>
	<section class="form">
		<div class="form__title" :class="{ mgtop_download: checkShowDownLoadUqey && isMobile }">
			<h1 class="title_resetpw">{{ t('user.reset_password') }}</h1>
		</div>
		<form method="post">
			<div class="form__group">
				<label for="email">{{ t('user.input_email_address') }}</label>
				<input
					id="email"
					v-model="email"
					class="form-control login_input"
					:class="{ 'border-danger': errorMessage.length > 0 }"
					type="email"
					outline="none active:none"
					required
				/>
			</div>

			<div v-if="errorMessage.length > 0" class="alert alert-danger mt-2 error-message" role="alert">
				{{ t('user.login_error') }} {{ errorMessage }}
			</div>
			<a class="button" @click="sendEmail">{{ t('user.send_password') }}</a>
			<div class="forgot-password">
				<router-link to="/login">{{ t('user.return_login') }}</router-link>
			</div>
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
