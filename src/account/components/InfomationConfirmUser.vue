<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { numberWithCommas } from '~/common/utils/common';
import { scrollEle } from '~/common/utils/vScroll';
import { useBookingStore } from '~/booking/stores/booking';
import { TAB_ACCOUNT } from '~/common/utils/constant';
import { useReservationStore } from '../stores/ReservationStore';
import { useUserInfoStore } from '../stores/UserInfoStore';
import { useRentalHistoryStore } from '../stores/RentalHistoryStore';

const { t } = useI18n();
const { reservationDetail, checkPerson, listSubDriver ,vehicleInfo ,vehicleHistoryInfo } = storeToRefs(useReservationStore());
const bookingStore = useBookingStore();
const userInfoStore = useUserInfoStore();
const { tabAccount } = storeToRefs(userInfoStore);
const { rentalHistoryDetail } = storeToRefs(useRentalHistoryStore());
const dataReservation = computed(() => {
	if (tabAccount.value === TAB_ACCOUNT.SECOND) {
		return reservationDetail.value || '';
	} else if (tabAccount.value === TAB_ACCOUNT.THIRST) {
		return rentalHistoryDetail.value || '';
	}
});
</script>
<template>
	<div v-if="dataReservation.pick_up_info" class="text_user text_notify">
		<h4 class="title__notify">{{ dataReservation?.pick_up_title }}</h4>
		<p v-html="dataReservation.pick_up_info .split('\n').join('<br/>') " ></p>
	</div>
	<div v-if="dataReservation.info_to_station" class="text_user text_problem">
		<h4 class="title__notify">お店に伝えたい事項</h4>
		<p v-html="dataReservation.info_to_station.split('\n').join('<br/>') "></p>
	</div>
</template>
<style scoped lang="scss">
.text_user {
	width: 100%;
    word-break: break-all;
	.title__notify {
		font-size: 16px;
		margin: 0;
		font-weight: 550;
	}
	p {
		margin: 15px 0 15px 20px;
		font-size: 14px;
		color: #9d9da1;
	}
}
</style>
