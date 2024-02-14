<script setup lang="ts">
import Token from 'markdown-it/lib/token';
import { storeToRefs } from 'pinia';
import { STATUS } from '~/common/dtos/base-output.dto';
import { NUMBER } from '~/common/utils/constant';
import { UserLoginInput } from '~/users/dtos/user-login-input.dto';
import { LOGIN_STEPS, useUserLoginStore } from '~/users/stores/userLogin';
import { STEPS, useUserCreateStore } from '~/users/stores/userCreate';

const { t } = useI18n()
const userCreate = useUserCreateStore();
const loginStore = useUserLoginStore();
const { data, currentStep } = storeToRefs(useUserLoginStore());

const router = useRouter();

const loginInput = ref<UserLoginInput>(new UserLoginInput());
	const emit = defineEmits(['checkLogin'])

function onLogin() {
	loginStore.login(loginInput.value).then((response) => {
		if (response.status === STATUS.SUCCESS) {
			if (response?.data?.user?.reg_step === NUMBER.FIRST) {
				userCreate.changeStep(STEPS.SEND_SMS);
				router.push('/register')
			}
			emit('checkLogin')
		}
	});
}

function onForgotPassword() {
	loginStore.changeStep(LOGIN_STEPS.SEND_EMAIL);
}

const errorMessage = computed(() => {
	return data.value.status === STATUS.ERROR && data.value.message.length > 0 ? data.value.message : '';
});

function goRegister() {
	router.push('/register');
}

onMounted(() => {
	loginStore.changeStep(LOGIN_STEPS.LOGIN);
});

onUnmounted(() => {
	loginStore.changeStep(LOGIN_STEPS.SEND_EMAIL);
});
</script>

<template>
	<div id="modalLogin" class="modal-add-car-login modal_account">
		<div id="withdrawalModal" class="modal" >
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-body">
						<div v-if="currentStep === LOGIN_STEPS.LOGIN">
							<section class="form">
								<div class="form__title">
									<h1>{{ t('booking.modal_login_lg') }}</h1>
									<div class="__text">
										<h3>{{ t('booking.modal_login_member') }}</h3>
										<a href="/register" @click.prevent="goRegister">{{ t('booking.modal_login_register') }}</a>
									</div>
								</div>
								<form method="post">
									<div class="form__group">
										<label for="email">{{ t('booking.modal_login_email') }}</label>
										<input
											id="email"
											v-model="loginInput.email"
											class="form-control login_input"
											:class="{ 'border-danger': errorMessage.length > 0 }"
											type="email"
											outline="none active:none"
											required
										/>
									</div>
									<div class="form__group">
										<label for="password">{{ t('booking.modal_login_pasword') }}</label>
										<input
											id="password"
											v-model="loginInput.password"
											class="form-control login_input"
											:class="{ 'border-danger': errorMessage.length > 0 }"
											type="password"
											outline="none active:none"
											required
											@keyup.enter="onLogin"
										/>
									</div>
									<a type="button" class="button" @click="onLogin">{{ t('booking.modal_login_lg') }}</a>
									<div class="forgot-password">
										<a type="button" @click="onForgotPassword">{{ t('booking.modal_login_forgot_pasword') }}</a>
									</div>
								</form>
							</section>
						</div>
						<div v-if="currentStep === LOGIN_STEPS.SEND_EMAIL">
							<SendEmailResetPassword />
						</div>
						<div v-if="currentStep === LOGIN_STEPS.RESET_PASSWORD">
							<ResetPassword />
						</div>
						<div v-if="currentStep === LOGIN_STEPS.FINAL">
							<Success />
						</div>
						<div v-if="errorMessage.length > 0" class="alert alert-danger mt-2 error-message" role="alert">
							{{ t('booking.modal_login_error') }} {{ errorMessage }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
	.modal-animation-enter-active,
	.modal-animation-leave-active {
		transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
	}
	.modal-animation-enter-from,
	.modal-animation-leave-to {
		opacity: 0;
	}
	.modal-animation-inner-enter-active {
		transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
	}
	.modal-animation-inner-leave-active {
		transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
	}
	.modal-animation-inner-enter-from {
		opacity: 0;
		transform: scale(0.8);
	}
	.modal-animation-inner-leave-to {
		transform: scale(0.8);
	}
	.modal {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(255, 255, 255, 0.7);
	}
	.form__input_group {
		text-align: left;
		label {
			font-weight: bold;
		}
	}
	</style>
	  