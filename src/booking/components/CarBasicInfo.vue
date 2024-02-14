<script setup lang="ts">
import { formatDayTime } from '~/common/utils/common';
import { useBookingStore } from '../stores/booking';

const { t } = useI18n();
const showInfo = ref(false);
const { boardingTime, boardingPlace, returnTime, returnPlace } = useBookingStore();
const showInfoBooking = () => {
	showInfo.value = !showInfo.value;
};
</script>

<template>
	<div class="page-contain">
		<div class="car-info-basic" :class="[showInfo ? 'car-info-show' : 'car-info-hide']">
			<div class="show_info_booking">
				<h4 class="car-title">{{ t('booking.time_boarding') }}</h4>
				<p>{{ formatDayTime(boardingTime as Date) }}</p>
				<h4 class="car-title">{{ t('booking.boarding_place') }}</h4>
				<div class="car-info">
					<p>{{ boardingPlace?.name }}</p>
					<p>{{ boardingPlace?.name_jp }}</p>
					<p>{{ boardingPlace?.oneway == 2 ? '(ワンウェイ不可)' : '' }}</p>
					<div class="more">
						<p>{{ t('booking.location') }}: {{ boardingPlace?.address }}</p>
						<p>
							{{ t('booking.business_hours') }}:
							{{
								boardingPlace?.always_open == 1
									? '24時間営業'
									: `${boardingPlace?.start_business_time.slice(0, 5)} ~ ${boardingPlace?.end_business_time.slice(
											0,
											5,
									  )}`
							}}
						</p>
						<p>{{ t('booking.bk_phone') }}: {{ boardingPlace?.phone }}</p>
					</div>
				</div>
			</div>
			<div class="show_info_booking">
				<h4 class="car-title">{{ t('booking.return_time') }}</h4>
				<p>{{ formatDayTime(returnTime as Date) }}</p>
				<h4 class="car-title">{{ t('booking.place_return') }}</h4>
				<div class="car-info">
					<p>{{ returnPlace?.name }}</p>
					<p>{{ returnPlace?.name_jp }}</p>
					<p>{{ returnPlace?.oneway == 2 ? '(ワンウェイ不可)' : '' }}</p>
					<div class="more">
						<p>{{ t('booking.location') }}: {{ returnPlace?.address }}</p>
						<p>
							{{ t('booking.business_hours') }}:
							{{
								returnPlace?.always_open == 1
									? '24時間営業'
									: `${returnPlace?.start_business_time.slice(0, 5)} ~ ${returnPlace?.end_business_time.slice(0, 5)}`
							}}
						</p>
						<p>{{ t('booking.bk_phone') }}: {{ returnPlace?.phone }}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="action_show_hide" @click="showInfoBooking">
			<img class="action__img" v-if="showInfo" src="/icons/expand-up.svg" alt="" />
			<img class="action__img" v-else src="/icons/expand-down.svg" alt="" />
		</div>
	</div>
</template>
<style lang="scss" scoped>
@media screen and (max-width: 480px) {
	.page .page-contain .car-info-basic .info-item .car-title {
		font-size: 14px;
	}

	.show_info_booking {
		padding-left: 0;
	}
}
</style>
