<script setup lang="ts">
    import { defineEmits  } from 'vue'

	const { t } = useI18n()
	const emit = defineEmits(['closeCreditSuccessModal'])
	const clickButton  = ref(true)

	const success: any = defineProps({
		resSuccess: String
	})

	const onClose = () => {
			emit('closeCreditSuccessModal');
	};
    
</script>
<template>
	<transition name="modal-animation">
		<div class="modal">
			<div name="modal-animation-inner" class="modal-animation-inner">
				<div class="custom-modal-content">
					<p>{{ success.resSuccess || '' }}</p>
				</div>

				<div class="custom-modal-actions">
					<button class="custom-modal-btn custom-modal-confirm" @click="onClose">{{ t('button.ok') }}</button>
				</div>
			</div>
		</div>
	</transition>
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
    .modal-animation-inner{
        padding: 20px 0;
        width: 500px;
        background: #fff;
        box-shadow: 0px 0px 4px rgb(0 0 0 / 25%);
        border-radius: 10px;
        font-style: normal;
        line-height: 24px;
        color: #000;
    }
	</style>
	  