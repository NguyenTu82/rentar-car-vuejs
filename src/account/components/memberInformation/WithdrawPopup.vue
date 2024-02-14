<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '~/account/stores/UserInfoStore';
import { useUserStore } from '~/users/stores/user';

const { t } = useI18n()
const router = useRouter();
const userStore = useUserStore();
const userInfoStore = useUserInfoStore();
const { checkWithdrawal, errorValidate } = storeToRefs(userInfoStore);
const { postWithDrawal, setCheckWithdrawal } = useUserInfoStore();

const emit = defineEmits(['close']);

const modalContent = ref<HTMLDivElement | null>(null);
const isWithdrew = ref(false);
const clickButton  = ref(true)

const onClose = () => {
	emit('close');
	setCheckWithdrawal(false);
};

const onWithdraw = async () => {
	if (clickButton.value) {
		clickButton.value = false
		await postWithDrawal();
		isWithdrew.value = true
		clickButton.value = true
	}
};

const onWithDrew = () => {
	emit('close');
	userStore.logout();
	router.push('/');
};

// onClickOutside(modalContent, () => onClose());
</script>

<template>
	<div class="withdraw-modal">
		<div class="overlay"></div>
		<div ref="modalContent" class="withdraw-modal-body">
			<template v-if="!isWithdrew">
				<div class="withdraw-modal-content">
					<p>{{ t("user_infor.leaving") }}</p>
					<p>{{ t("user_infor.it_ok") }}</p>
				</div>

				<div class="withdraw-modal-actions">
					<button class="withdraw-modal-btn withdraw-modal-close" @click="onClose">{{ t("button.cancel") }}</button>
					<button class="withdraw-modal-btn withdraw-modal-confirm" @click="onWithdraw">{{ t("user_infor.withdrawal") }}</button>
				</div>
			</template>
			<template v-else-if="checkWithdrawal === true">
				<div class="withdraw-modal-content">
					<p>{{ t("user_infor.i_withdrew") }}</p>
				</div>

				<div class="withdraw-modal-actions">
					<button class="withdraw-modal-btn withdraw-modal-confirm" @click="onWithDrew">{{ t("user_infor.confirmation") }}</button>
				</div>
			</template>
			<template v-else>
				<div class="withdraw-modal-content">
					<p>{{ errorValidate }}</p>
				</div>

				<div class="withdraw-modal-actions">
					<button class="withdraw-modal-btn withdraw-modal-confirm" @click="onClose">{{ t("user_infor.confirmation") }}</button>
				</div>
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.withdraw-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	display: flex;
	justify-content: center;
	align-items: center;

	.overlay {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1;
	}

	&-body {
		padding: 3rem;
		min-width: 500px;
		background-color: #fff;
		z-index: 2;
		border-radius: 20px;
	}

	&-content {
		margin-bottom: 2rem;
		text-align: center;
	}

	&-actions {
		display: flex;
		justify-content: center;
		align-items: center;

		& > *:not(:last-child) {
			margin-right: 20px;
		}
	}

	&-btn {
		padding: 0 20px;
		min-width: 160px;
		height: 48px;
		border: none;
		border-radius: 999px;
	}

	&-close {
		background-color: #eeeef3;
		color: #000;
	}

	&-confirm {
		background-color: #0c47a1;
		color: #ffffff;
	}
}
</style>
