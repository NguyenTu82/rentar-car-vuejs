<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInsuranceStore } from '../stores/insuranceStores';
import { useBookingStore } from '~/booking/stores/booking';
import { getMinute, numberWithCommas } from '~/common/utils/common';

const { t } = useI18n();
const { selected } = storeToRefs(useInsuranceStore());
const bookingStore = useBookingStore();
const { vehicleDetail, boardingTime, returnTime, selectedOption, numberOption, listSubDriver } =
	storeToRefs(bookingStore);
const selectedOptionSort = computed(() => {
	return selectedOption.value.sort(function (a: any, b: any) {
		if (a.display_rank === b.display_rank) {
			if (a.name > b.name) return 1;
			if (a.name < b.name) return -1;
			if (a.name === b.name) return 0;
		}
		return a.display_rank - b.display_rank;
	});
});
const totalPriceCar = computed(() => {
	let price = 0;
	let priceIsurance = 0;
	let calc_result_price = 0;
	selectedOption.value.map((item) => {
		price += item.price_latest * numberOption.value[item.id] || 0;
	});
	if (selected.value) {
		selected?.value.map((item) => {
			priceIsurance += item.price_latest || 0;
		});
	}
	if (vehicleDetail.value) {
		vehicleDetail.value?.calc_result.map((item) => {
			calc_result_price += item.amount || 0;
		});
	}

	if (selected.value && vehicleDetail.value && !vehicleDetail.value.calc_result) {
		return (
			vehicleDetail.value.unit_price +
			vehicleDetail?.value.per_night_price * vehicleDetail?.value.count_day +
			price +
			priceIsurance
		);
	} else if (vehicleDetail.value?.calc_result) {
		return calc_result_price + price + priceIsurance;
	} else {
		return 0;
	}
});

const timeRentCar = computed(() => {
	return getMinute(boardingTime.value, returnTime.value);
});

const priceRentCar = computed(() => {
	if (vehicleDetail.value) {
		return vehicleDetail.value.price;
	} else {
		return 0;
	}
});
</script>

<template>
	<div class="booking-infomation">
		<div class="list-info">
			<h4>{{ t('booking.reservation_overview') }}</h4>
			<!-- <div v-if="listSubDriver?.length">
				<p v-if="listSubDriver?.length">{{ t('rental_history.passenger_information') }}</p>
				<template v-for="(data, index) in listSubDriver">
					<div class="sub-price sub-price__cus">
						<p>{{index + 1}}{{ t("revervation.sign") }}{{ data?.email }}</p>
					</div>
				</template>
			</div> -->
			<div class="list-sub-price">
				<div class="sub-price">
					<p>{{ t('booking.plan_to_use') }}</p>
				</div>
				<div v-if="!vehicleDetail?.calc_result" class="option-info">
					<p class="option-name">{{ vehicleDetail?.pack_name }}</p>
					<p>
						<b class="option-price">￥{{ numberWithCommas(vehicleDetail?.unit_price) || 0 }}</b>
					</p>
				</div>
				<div v-else="vehicleDetail?.calc_result" v-for="calc in vehicleDetail?.calc_result" class="option-info">
					<p class="option-name">
						{{ calc.name }}
						<span class="calc_quatity" v-if="calc.quantity">x</span>
						<span v-if="calc.quantity">{{ calc.quantity }}</span>
					</p>
					<p>
						<b class="option-price"
							><span v-if="calc.amount < 0">-</span>￥{{ numberWithCommas(Math.abs(calc.amount)) || 0 }}</b
						>
					</p>
				</div>
				<div
					class="option-info"
					v-if="vehicleDetail?.count_day && vehicleDetail?.count_day > 0 && !vehicleDetail?.calc_result"
				>
					<p class="option-name">{{ vehicleDetail?.calc_name }} x {{ vehicleDetail?.count_day }}</p>
					<p>
						<b class="option-price"
							>￥{{ numberWithCommas(vehicleDetail?.per_night_price * vehicleDetail?.count_day) }}</b
						>
					</p>
				</div>
			</div>
			<!-- <div v-if="selected.price != 0" class="list-sub-price"> -->
			<!-- <div class="list-sub-price">
				<div class="sub-price">
					<p>{{ t('booking.title_insurance') }}</p>
					<p>
						<b>￥{{ numberWithCommas(selected.price_latest || 0) }}</b>
					</p>
				</div>
				<span>{{ selected.name || '' }}</span>
			</div> -->
			<div v-if="selected?.length" class="list-sub-price">
				<div class="sub-price">
					<p>{{ t('booking.title_insurance') }}</p>
				</div>
				<div class="option-info" v-for="select in selected" :key="select.id">
					<div class="show_isurance_select">
						<p class="option-name">{{ select.name || '' }}</p>
						<span v-if="select.calc_day > 0" class="countday">x</span>
						<span v-if="select.calc_day > 0" class="countday">{{ select?.calc_day }}日分</span>
					</div>
					<p>
						<b class="option-price">￥{{ numberWithCommas(select?.price_latest || 0) }}</b>
					</p>
				</div>
			</div>
			<div v-if="selectedOption.length > 0" class="list-sub-price">
				<div class="sub-price">
					<p>{{ t('booking.double_plan') }}</p>
				</div>
				<div class="option-info" v-for="opt in selectedOptionSort" :key="opt.id">
					<p class="option-name">
						{{ opt.name || '' }}<span class="option-number">x</span>
						<span class="option-number">{{ numberOption[opt.id] }}</span>
					</p>

					<p>
						<b class="option-price">￥{{ numberWithCommas(opt.price_latest * numberOption[opt.id] || 0) }}</b>
					</p>
				</div>
			</div>
		</div>
		<div class="sub-price total">
			<p>{{ t('booking.total_amount') }}</p>
			<p>
				<b>￥{{ numberWithCommas(totalPriceCar) }}</b>
			</p>
		</div>
	</div>
</template>

<style scoped>
.calc_quatity {
	margin: 0 10px;
}
.show_isurance_select {
	display: grid;
	grid-template-columns: 1fr 25px 60px;
	width: 100%;
}
p.option-name {
	margin: 0;
	color: #9d9da1;
	font-size: 16px;
}
.countday {
	margin-left: 10px;
	color: #9d9da1;
	font-size: 16px;
}
.option-number {
	margin-left: 10px;
}
.option-info {
	display: flex;
	justify-content: space-between;
}
.option-price {
	font-size: 14px;
}

@media screen and (max-width: 920px) {
	.reverconfirm.page-detail .car-box-right.reservation .booking-infomation .list-info h4,
	.page .page-detail.insurance-page .reservation .booking-infomation .list-info h4 {
		padding-bottom: 1rem;
	}
}

@media screen and (max-width: 480px) {
	.list-info h4 {
		padding-bottom: 1rem;
	}
}
</style>
