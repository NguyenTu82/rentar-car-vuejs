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
const code = ref('');
const timeId = ref<number | null>(null);
const maxCountdownTime = ref(20);
const countdownTime = ref(20);

const { data, createInput, checkSendCode } = storeToRefs(useUserCreateStore());
const userCreateStore = useUserCreateStore();

const verifyEmail = async () => {
	checkSendCode.value = true;
	await userCreateStore.verifyEmail(code.value);
};
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
	await userCreateStore.createUser(createInput.value);
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
	checkSendCode.value = false;
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
			<h1 class="">{{ t('user.email_verification') }}</h1>
		</div>
		<!-- <div class="">
			<span class="confirm__identity_text">{{ t('user.confirm_your_identity') }}</span>
		</div> -->
		<!-- <div class="enter_confirmation_code">
			<span class="enter_confirmation_code__text">{{ t('user.enter_confirmation_code') }}</span>
		</div> -->
		<div class="note_enter_confirmation">
			<div>
				ご登録のメールアドレスに認証コードを送信しました。<br />
				メッセージに記載された認証コードを入力してください。<br />
				認証コードの有効期限は24時間です。
			</div>
		</div>
		<form method="post">
			<div class="form__group">
				<label for="verification">{{ t('user.verification_code') }}</label>
				<input
					id="verification"
					v-model="code"
					class="form-control register_input"
					:class="{ 'border-danger': errorMessage.length > 0 }"
					type="text"
					maxlength="6"
					outline="none active:none"
				/>
			</div>

			<div v-if="errorMessage.length > 0" class="alert alert-danger mt-2 error-message" role="alert">
				{{ t('user.login_error') }} {{ errorMessage }}
			</div>
			<button class="button" @click.prevent="verifyEmail" :disabled="checkSendCode">{{ t('user.to_the_next') }}</button>
		</form>
	</section>
	<div class="row time">
		<p class="" :class="{ disabled: countdownTime > 0 }" @click="onClickResend">
			{{ t('user.retransmission_email') }}{{ countdownTime ? `（${countdownTime}s）` : '' }}
		</p>
	</div>
</template>
<style scoped lang="scss">
.time {
	text-align: center;
	p {
		margin-top: 10px;
		color: #7d7d82;
	}
}
.mgtop_download {
	margin-top: 4rem;
}
</style>
