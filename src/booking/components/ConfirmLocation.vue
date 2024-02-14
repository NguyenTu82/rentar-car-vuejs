<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBookingStore } from '../stores/booking';

const { modalActive, confirmText } = defineProps<{
	modalActive: boolean;
	confirmText: string;
}>();

const bookingStore = useBookingStore();
const { selectedStation, twoWay } = storeToRefs(bookingStore);

const { t } = useI18n();
const emit = defineEmits(['onClose', 'onConfirm']);

const modalInner = ref<HTMLDivElement | null>(null);
onClickOutside(modalInner, () => {
	emit('onClose');
});
</script>

<template>
	<transition name="modal-animation">
		<div v-if="!!selectedStation" v-show="modalActive" class="modal">
			<transition name="modal-animation-inner">
				<div v-show="modalActive" class="modal-inner text-center" ref="modalInner">
					<h3 class="title">{{ t('search.modal_uqey_title') }}</h3>

					<h4 v-if="selectedStation?.name" class="sub-title">{{ selectedStation?.name }}</h4>
					<h4 class="sub-title">{{ selectedStation?.name_jp }}</h4>
					<p v-if="twoWay">（ワンウェイ不可）</p>
					<p class="sub-title">{{ selectedStation?.address }}</p>
					<p class="always_open">{{ selectedStation?.always_open==1 ? "24時間営業" : `${selectedStation?.start_business_time.slice(0,5)} ~ ${selectedStation?.end_business_time.slice(0,5)}`}}</p>
					<p>{{ selectedStation?.phone }}</p>
					<p class="info_station"  v-html="selectedStation?.info_from_station?.split('\r\n').join('<br/>') || ''"></p>
					<button class="btn button-confirm" @click="emit('onConfirm')">{{ confirmText }}</button>
				</div>
			</transition>
		</div>
	</transition>
</template>

<style lang="scss" scoped>
.info_station{
	word-break: break-all;
}
.always_open{
	margin: 0;
}
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
	.modal-inner {
		position: relative;
		max-width: 500px;
		max-height: 90%;
		width: auto;
		box-shadow: 0 4px 6px 2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		background-color: #163aba;
		color: #fff;
		padding: 30px 16px;
		border-radius: 30px;

		.title {
			margin-bottom: 30px;
			font-weight: 400;
		}

		.sub-title {
			margin-bottom: 10px;
			word-wrap: break-word
		}
		i {
			position: absolute;
			top: 15px;
			right: 15px;
			font-size: 20px;
			cursor: pointer;
			&:hover {
				color: crimson;
			}
		}

		a {
			display: inline-flex;
			text-decoration: none;
			color: white;
			background-color: #5faab0;
			background-image: linear-gradient(90deg, #267486, #5faab0);
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 50px;
			font-size: 14px;
			border-radius: 25px;
			font-weight: 500;
			padding: 0 1.2rem;
			margin-top: 1rem;
		}

		a:hover {
			background: #0c47a1;
			cursor: pointer;
			transition: all 0.3s ease-out;
		}

		.button-confirm {
			width: 100%;
			padding: 6px 20px;
			background-color: #fff;
			color: #000;
			border-radius: 999px;
		}
	}
}
</style>
