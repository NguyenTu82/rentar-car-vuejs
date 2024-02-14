<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBookingStore } from '~/booking/stores/booking';
import { useInsuranceStore } from '~/booking/stores/insuranceStores';
import { useCommonStore } from '~/common/store/CommonStore';
import { numberWithCommas } from '~/common/utils/common';
import { NUMBER } from '~/common/utils/constant';
import { toFormattedDateTime } from '~/common/utils/formatter';
import { useDownloadStore } from '~/users/stores/download';

const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const { isMobile } = storeToRefs(useCommonStore());

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const bookingStore = useBookingStore();
const insuranceStore = useInsuranceStore();
const { resError, checkError } = storeToRefs(useInsuranceStore());
const { vehicleDetail, boardingTime, returnTime, boardingPlace, totalUsageFee } = storeToRefs(bookingStore);
const isShowModalErrorInsurance = ref(false);
const checkStation = ref(false);
const buttonCancel = ref(t('button.ok'));

onMounted(() => {
	insuranceStore.resetSelect();
	bookingStore.resetSelectOption();
	bookingStore.totalFee();
});

const data = {
	owner_station_id: vehicleDetail.value?.owner_station_id || '',
	start_time: toFormattedDateTime(boardingTime.value as Date, 24),
	end_time: toFormattedDateTime(returnTime.value as Date, 24),
};
const go = async () => {
	await insuranceStore.getListInsurance(data);
	await bookingStore.getListOption(data);
	if (!checkError.value) {
		router.push({ path: `/booking/${route.params.id}/insurance` });
	}
};

watch(resError, () => {
	if (resError.value) {
		isShowModalErrorInsurance.value = true;
	}
});

watch(checkStation, () => {
	if (checkStation.value) {
		router.push({ path: `/booking/${route.params.id}/insurance` });
	}
});

const closePopup = () => {
	isShowModalErrorInsurance.value = false;
	checkStation.value = true;
	return false;
};
</script>
<template>
	<section class="dashboard">
		<div class="page" :class="{ mg_top__info: checkShowDownLoadUqey && isMobile }">
			<CarBasicInfo />
			<div class="page-detail row">
				<div class="col">
					<CarImage />
				</div>
				<div v-if="vehicleDetail" class="col box__detail--mag">
					<div v-if="vehicleDetail?.appeal_point" class="appeal_point">
						<p v-html="vehicleDetail?.appeal_point.split('\r\n').join('<br/>') || ''"></p>
					</div>
					<div class="base-detail">
						<p v-if="vehicleDetail?.name">{{ t('booking.car_model_name') }} {{ vehicleDetail?.name || '' }}</p>
						<p v-if="vehicleDetail?.brand">{{ t('booking.manufacturer') }} {{ vehicleDetail?.brand || '' }}</p>
						<p v-if="vehicleDetail?.color">{{ t('booking.color_car') }} {{ vehicleDetail?.color || '' }}</p>
						<p>
							{{ t('booking.capacity') }} {{ numberWithCommas((+vehicleDetail?.capacity)?.toFixed(0))
							}}{{ t('booking.capacity_name') }}
						</p>
						<p v-if="vehicleDetail?.displacement">
							{{ t('booking.displacement') }} {{ numberWithCommas((+vehicleDetail?.displacement))
							}}{{ t('booking.displacement_cc') }}
						</p>
						<p v-if="vehicleDetail?.fuel_type">{{ t('booking.fuel_type_car') }} {{ vehicleDetail?.fuel_type || '' }}</p>
						<p v-if="vehicleDetail?.fuel">
							{{ t('booking.fuel_consumption') }} {{ numberWithCommas((+vehicleDetail?.fuel))
							}}{{ t('booking.fuel_consumption_km') }}
						</p>
						<p v-if="vehicleDetail?.wheel_drive_type">
							{{ t('booking.4WD/2WD') }} {{ numberWithCommas((+vehicleDetail?.wheel_drive_type)?.toFixed(0))
							}}{{ t('booking.WD') }}
						</p>
						<p v-if="vehicleDetail?.length || vehicleDetail?.width || vehicleDetail?.height">
							{{ t('booking.size') }}
							{{ vehicleDetail?.length ? numberWithCommas((+vehicleDetail?.length)) : '-' }}/{{
								vehicleDetail?.width ? numberWithCommas((+vehicleDetail?.width)) : '-'
							}}/{{ vehicleDetail?.height ? numberWithCommas((+vehicleDetail?.height)) : '-'
							}}{{ vehicleDetail?.height ? t('booking.size_mmm') : '' }}
						</p>
						<p v-if="vehicleDetail?.car_navi && vehicleDetail?.car_navi == 1">
							{{ t('booking.car_navi') }} {{ t('booking.yes_checkbox') }}
						</p>
						<p v-else-if="vehicleDetail?.car_navi && vehicleDetail?.car_navi == 2">
							{{ t('booking.car_navi') }} {{ t('booking.no_checkbox') }}
						</p>
						<p v-if="vehicleDetail?.etc && vehicleDetail?.etc == 1">
							{{ t('booking.car_etc') }} {{ t('booking.yes_checkbox') }}
						</p>
						<p v-else-if="vehicleDetail?.etc && vehicleDetail?.etc == 2">
							{{ t('booking.car_etc') }} {{ t('booking.no_checkbox') }}
						</p>
						<p v-if="vehicleDetail?.max_load_capacity">
							{{ t('booking.maximum_loading_capacity') }} {{ vehicleDetail?.max_load_capacity || '' }}
							{{ t('booking.weight_kg') }}
						</p>
						<p v-if="vehicleDetail?.vehicle_total_weight">
							{{ t('booking.vehicle_total_weight') }} {{ vehicleDetail?.vehicle_total_weight || '' }}
							{{ t('booking.weight_kg') }}
						</p>
						<p v-if="vehicleDetail?.auto_manual === NUMBER.FIRST">{{ t('booking.type_car_AT') }}</p>
						<p v-if="vehicleDetail?.auto_manual === NUMBER.SECOND">{{ t('booking.type_car_MT') }}</p>
					</div>
					<div class="note">
						<p
							v-if="boardingPlace?.info_from_station"
							v-html="boardingPlace?.info_from_station.split('\r\n').join('<br/>') || ''"
							class="info_from_station"
						></p>
					</div>
					<div class="price">
						<p class="fee">{{ t('booking.applicable_fee') }}</p>
						<p class="amount">{{ numberWithCommas(totalUsageFee) }}{{ t('booking.circle') }}</p>
					</div>
					<div class="box-action">
						<button type="button" class="btn btn-secondary m-2 btn_back" @click="router.push('/booking/list')">
							{{ t('booking.return_vehicle') }}
						</button>
						<button type="button" class="btn btn-primary m-2" @click="go()">{{ t('booking.book_vehicle') }}</button>
					</div>
				</div>

				<div v-else class="col box__detail--mag">
					<div class="base-detail">
						<p>{{ t('booking.car_model_name') }}</p>
						<p>{{ t('booking.manufacturer') }}</p>
						<p>{{ t('booking.capacity') }}</p>
						<p>{{ t('booking.displacement') }}</p>
						<p>{{ t('booking.fuel_consumption') }}</p>
						<p>{{ t('booking.4WD/2WD') }}</p>
						<p>{{ t('booking.size') }}</p>
						<p>{{ t('booking.car_navi') }}</p>
						<p>{{ t('booking.maximum_loading_capacity') }} {{ t('booking.weight_kg') }}</p>
						<p>{{ t('booking.vehicle_total_weight') }} {{ t('booking.weight_kg') }}</p>
						<p>{{ t('booking.type_car') }}</p>
					</div>
					<div class="price">
						<p class="fee">{{ t('booking.applicable_fee') }}</p>
						<p class="amount">{{ t('booking.circle') }}</p>
					</div>
					<div class="box-action">
						<button type="button" class="btn btn-secondary m-2" @click="router.push('/booking/list')">
							{{ t('booking.return_vehicle') }}
						</button>
						<button type="button" class="btn btn-primary m-2 " @click="go()">{{ t('booking.book_vehicle') }}</button>
					</div>
				</div>
			</div>
		</div>
		<ErrorModal
			v-if="isShowModalErrorInsurance"
			@closeModalError="closePopup"
			:resError="resError"
			:buttonCancel="ok"
		/>
	</section>
</template>
<style lang="scss" scoped>

.box-action{
	display: flex;
	justify-content: flex-start !important;
	.btn_back{
		margin: 0!important;
		height: 48px;
		min-width: 180px;
		padding: 0.5rem 2rem;
		
	}
	button{
		min-width: 180px !important;
		padding: 0.5rem 2rem;
	}
	@media screen and (max-width: 480px) {
		button {
			min-width: 130px !important;
			padding: 0;
			padding: 0.5rem 1rem;
		}
	}


}
.price {
	display: flex;
	p {
		font-weight: 500;
		font-size: 30px;
		line-height: 40px;
		color: #000000;
	}
	.amount {
		font-weight: bold;
		margin-left: 10%;
	}
}
.base-detail {
	p {
		margin-bottom: 10px;
		@media screen and (max-width: 480px) {
			overflow-wrap: break-word;
		}
	}
}
.appeal_point {
	width: 800px;
	p {
		font-weight: bold;
		word-wrap: break-word;
	}
	@media screen and (max-width: 920px) {
		width: 100%;
	}
}
.info_from_station {
	width: 800px;
	word-wrap: break-word;
	@media screen and (max-width: 920px) {
		width: 100%;
	}
}
@media screen and (max-width: 920px) {
	.price p {
		font-size: 24px;
	}

	.page .page-detail .box-action button.btn-primary {
		margin-left: 2% !important;
		min-width: 130px;
	}
}

@media screen and (max-width: 480px) {
	.price p {
		font-size: 22px;
	}

	.page .page-detail .box-action {
		justify-content: space-between;
	}
	.page .page-detail .box-action button.btn-primary{
		margin-left: 3% !important;
	}
}
</style>
<route lang="yaml">
 meta:
  layout: booking
</route>
