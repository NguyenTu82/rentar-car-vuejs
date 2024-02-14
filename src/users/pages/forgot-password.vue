<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { STATUS } from '~/common/dtos/base-output.dto';
import { LOGIN_STEPS, useUserLoginStore } from '~/users/stores/userLogin';

const { t } = useI18n()
const { data, currentStep } = storeToRefs(useUserLoginStore());
const userStore = useUserLoginStore();

const errorMessage = computed(() => {
	return data.value.status === STATUS.ERROR && data.value.message.length > 0 ? data.value.message : '';
});

onUnmounted(() => {
	userStore.changeStep(LOGIN_STEPS.SEND_EMAIL);
	data.value.message = '';
});
</script>

<template>
	<div class="main">
		<div class="overflow-hidden flex-fill d-flex">
			<div class="container flex-fill">
				<div class="row">
					<div class="container_left">
						<div v-if="currentStep === LOGIN_STEPS.SEND_EMAIL">
							<SendEmailResetPassword />
						</div>
						<div v-if="currentStep === LOGIN_STEPS.RESET_PASSWORD">
							<ResetPassword />
						</div>
						<div v-if="currentStep === LOGIN_STEPS.FINAL">
							<Success />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
