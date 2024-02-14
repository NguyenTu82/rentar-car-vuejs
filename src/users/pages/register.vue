<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { STATUS } from '~/common/dtos/base-output.dto';
import { STEPS, useUserCreateStore } from '~/users/stores/userCreate';
import { useUserStore } from '~/users/stores/user';
import { AUTHEN, NUMBER } from '~/common/utils/constant';

const { t } = useI18n()
const router = useRouter();
const userStore = useUserStore();
const userCreate = useUserCreateStore();
const { data, currentStep } = storeToRefs(useUserCreateStore());
const isShowModalError = ref(false)
const textErrorAuthen = ref(AUTHEN.TEXT_ERROR_AUTHEN)
const buttonCancel  = ref(t("button.ok"))

const errorMessage = computed(() => {
	if (data.value.status === STATUS.ERROR && data.value.message === AUTHEN.MESSAGE) {
		return isShowModalError.value = true
	}
	return data.value.status === STATUS.ERROR && data.value.message.length > 0 ? data.value.message : '';
});

onMounted(() => {
	if (userStore.user.reg_step === NUMBER.FIRST) {
	    userCreate.changeStep(STEPS.SEND_SMS);
	}
})

watch(currentStep, (step) => {
	if (step === STEPS.FINAL) {
		router.push('/');
	}
});

onUnmounted(() => {
	data.value.message = '';
});
</script>

<template>
	<div class="main">
		<div class="flex-fill d-flex">
			<div class="container flex-fill">
				<div class="row">
					<div class="container_left container_left--cus">
						<div v-if="currentStep === STEPS.CREATE">
							<SendEmail />
						</div>
						<div v-if="currentStep === STEPS.VERIFY_EMAIL">
							<VerifyEmail />
						</div>
						<div v-if="currentStep === STEPS.SEND_SMS">
							<UpdateInfo />
						</div>
						<div v-if="currentStep === STEPS.VERIFY_SMS">
							<VerifySMS />
						</div>
						<ErrorModal v-if="isShowModalError" @closeModalError="isShowModalError = false" :resError="textErrorAuthen" :buttonCancel="buttonCancel" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
	.main {
		margin-top: 2rem;
	}
</style>
