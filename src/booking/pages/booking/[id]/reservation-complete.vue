<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCreditInfoStore } from '~/account/stores/CreditInfoStore';
import { useBookingStore } from '~/booking/stores/booking';
import { useInsuranceStore } from '~/booking/stores/insuranceStores';
import { STATUS } from '~/common/dtos/base-output.dto';
import { useCommonStore } from '~/common/store/CommonStore';
import { AUTHEN } from '~/common/utils/constant';
import { useDownloadStore } from '~/users/stores/download';

const { isMobile } = storeToRefs(useCommonStore());
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());

const { t } = useI18n();
const bookingStore = useBookingStore();
const { resError ,boardingPlace } = storeToRefs(bookingStore);
const isShowModal = ref(false);
const isShowModalErrorBooking = ref(false);
const buttonCancel = ref(t('button.ok'));
const isLicenceValid = ref(false);
const clickButtonBooking = ref(true);

const router = useRouter();
const route = useRoute();
function handleRedirectBack() {
	router.push({
		path: `/booking/${route.params.id}/select-credit-card`,
		query: {},
	});
}

async function finishBookingCar() {
	if (clickButtonBooking.value == true) {
		clickButtonBooking.value = false;
		const restBooking = await bookingStore.finishBooking();
		if (restBooking.status) {
			clickButtonBooking.value = true;
		}
		if (restBooking.status == STATUS.SUCCESS) {
			useCreditInfoStore().selectedCard(null);
			isShowModal.value = true;
			isLicenceValid.value = restBooking.data.licence_valid_alert;
		}
	}
}

watch(resError, () => {
	if (resError.value && resError.value !== AUTHEN.MESSAGE) {
		isShowModalErrorBooking.value = true;
	}
});

function goHome() {
	bookingStore.resetStateBooking();
	router.push({
		path: '/account/reservation-status',
		query: {},
	});
}
</script>
<template>
	<section class="dashboard">
		<div class="page" :class="{ mg_top__info: checkShowDownLoadUqey && isMobile }">
			<CarBasicInfo />
			<div class="page-detail insurance-page row">
				<div class="col-12 col-md-6 col-lg-6">
					<CarImage />
				</div>
				<div class="base-detail col-12 col-md-6 col-lg-2">
					<InfomationCar />
					<div class="note">
						<p v-if="boardingPlace?.info_from_station" 
						v-html="boardingPlace?.info_from_station.split('\r\n').join('<br/>')  || ''" class="info_from_station">
						</p>
					</div>
				</div>
				<div class="col reservation">
					<TotalRentalCar />
					<ProblemTextUser />
					<InfoCancelBooking />
					<div class="box-action">
						<button type="button" class="btn btn-secondary m-2" @click="handleRedirectBack()">
							{{ t('booking.return_vehicle') }}
						</button>
						<button type="button" class="btn btn-primary m-2" @click="finishBookingCar">
							{{ t('button.reserve') }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
	<div v-if="isShowModal" class="modal modal_confirm_success">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-body">
					<div class="text-left" v-if="isLicenceValid">
						<p>{{ t('booking.licence_valid_alert') }}</p>
					</div>
					<div class="text-left" v-if="!isLicenceValid">
						<p>{{ t('booking.your_reservation') }}</p>
						<p>{{ t('booking.available_boarding_date_time') }}</p>
						<p>{{ t('booking.forward_to_seeing') }}</p>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="goHome">
						{{ t('booking.reservation_list') }}
					</button>
				</div>
			</div>
		</div>
	</div>
	<ErrorModal
		v-if="isShowModalErrorBooking"
		@closeModalError="isShowModalErrorBooking = false"
		:resError="resError"
		:buttonCancel="buttonCancel"
	/>
</template>

<style lang="scss" scoped>
.info_from_station {
	width: 100%;
	word-wrap: break-word;
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
}
.form__input_group {
	text-align: left;
	label {
		font-weight: bold;
	}
}
.modal_confirm_success {
	.modal-footer {
		justify-content: center;
		border-top: none;
		button {
			background: #2d419a;
			border-radius: 30px;
			padding-left: 1.75rem;
			padding-right: 1.75rem;
		}
	}
	.modal-body {
		margin-bottom: 0;
		padding-left: 70px;
		padding-right: 70px;
	}
	.modal-content {
		background: #ffffff;
		border: 1px solid #86868b;
		box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
		border-radius: 32px;
	}
}
@media screen and (max-width: 920px) {
	.page .page-detail .box-action {
		justify-content: end;
	}
}
@media screen and (max-width: 480px) {
	.base-detail {
		margin-bottom: 20px;
	}
	.page .page-detail .box-action {
		justify-content: space-between;
	}
}
</style>

<route lang="yaml">
 meta:
  layout: booking
</route>