<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { STATUS } from '~/common/dtos/base-output.dto';
import { useCommonStore } from '~/common/store/CommonStore';
import { autoConvertFullsizeToHalfsize } from '~/common/utils/common';
import { useDownloadStore } from '~/users/stores/download';
import { useUserCreateStore } from '~/users/stores/userCreate';

const { isMobile } = storeToRefs(useCommonStore());
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const { t } = useI18n();
const userCreateStore = useUserCreateStore();
const { data, verifyPhoneInput, checkSendCode } = storeToRefs(useUserCreateStore());

const code = ref('');
const timeId = ref<number | null>(null);
const maxCountdownTime = ref(20);
const countdownTime = ref(20);

function verifyPhone() {
	checkSendCode.value = true;
	userCreateStore.verifyPhone(code.value);
}
const errorMessage = computed(() => {
	return data.value.status === STATUS.ERROR && data.value.message.length > 0 ? data.value.message : '';
});

const onClickResend = async () => {
	if (countdownTime.value <= 0) {
		countdownTime.value = maxCountdownTime.value;
		await resendVerifyEmailCode();
		setCountdown();
	}
};

const resendVerifyEmailCode = async () => {
	await userCreateStore.sendSMSCode(verifyPhoneInput.value);
};

const setCountdown = () => {
	timeId.value = setInterval(() => {
		countdownTime.value--;

		if (countdownTime.value === 0) {
			clearInterval(timeId.value as number);
		}
	}, 1000);
};

watch(code, () => {
	nextTick(() => {
		code.value = code.value.replace(/\D/g, '');
	});
});

watch(code, (newValue: string) => {
	nextTick(() => {
		code.value = autoConvertFullsizeToHalfsize(newValue);
	});
});

onMounted(() => {
	setCountdown();
});

onUnmounted(() => {
	if (timeId.value) {
		clearInterval(timeId.value);
	}
});
</script>
<template>
	<section class="form">
		<div class="form__title" :class="{ mgtop_download: checkShowDownLoadUqey && isMobile }">
			<h1>{{ t('user.sms_authentication') }}</h1>
		</div>
		<div class="enter_confirmation_code">
			<ul class="enter_confirmation_code__text">
				<li>ご登録の携帯電話番号にSMSで認証コードを送信しました。</li>
				<li>受け取った6桁の数字を入力してください。</li>
				<li>認証コードの有効期限は24時間です。</li>
			</ul>
		</div>
		<form method="post">
			<div class="form__group">
				<label for="smscode" style="margin-top: 2rem">{{ t('user.authentication_code') }}</label>
				<input
					id="smscode"
					v-model="code"
					class="form-control register_input"
					:class="{ 'border-danger': errorMessage.length > 0 }"
					type="text"
					name="smscode"
					maxlength="6"
					outline="none active:none"
				/>
			</div>

			<div v-if="errorMessage.length > 0" class="alert alert-danger mt-2 error-message" role="alert">
				{{ t('user.login_error') }} {{ errorMessage }}
			</div>
			<div class="time">
				<p class="btn button1" :class="{ disabled: countdownTime > 0 }" @click="onClickResend">
					{{ t('user.retransmission_sms') }}{{ countdownTime ? `（${countdownTime}s）` : '' }}
				</p>
			</div>
			<button class="button" @click.prevent="verifyPhone" :disabled="checkSendCode">
				{{ t('user.certification') }}
			</button>
		</form>
	</section>
</template>
<style scoped>
.mgtop_download {
	margin-top: 4rem;
}
</style>
