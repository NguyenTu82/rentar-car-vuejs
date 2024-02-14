<script setup lang="ts">
import { useBookingStore } from '~/booking/stores/booking';
import { numberWithCommas } from '~/common/utils/common';
const { t } = useI18n()
const { vehicleDetail ,boardingPlace } = useBookingStore();
const type = 1
const route = useRoute()
const checkScreenConfirm = ref(false);
onMounted(()=>{
	if(route.path.includes('reservation-confirmation') || route.path.includes('reservation-complete') ||  route.path.includes('select-credit-card')){
		checkScreenConfirm.value =  true
	}
})
</script>


<template>
	
	<div v-if="vehicleDetail" class="base-detail" >
		<div  v-if="vehicleDetail?.appeal_point" class="appeal_point" :class="{'css_base_detail' : checkScreenConfirm}">
			<p v-html="vehicleDetail?.appeal_point.split('\r\n').join('<br/>') || ''"></p>			
		</div>
		<p v-if="vehicleDetail?.name">{{ t('booking.car_model_name') }} {{ vehicleDetail?.name || '' }}</p>
		<p v-if="vehicleDetail?.brand">{{ t('booking.manufacturer') }} {{ vehicleDetail?.brand || '' }}</p>
		<p v-if="vehicleDetail?.color">{{ t('booking.color_car') }} {{ vehicleDetail?.color || '' }}</p>
		<p>{{ t('booking.capacity') }} {{ numberWithCommas((+vehicleDetail?.capacity)?.toFixed(0)) }}{{ t('booking.capacity_name') }}</p>
		<p v-if="vehicleDetail?.displacement">{{ t('booking.displacement') }} {{ numberWithCommas((+vehicleDetail?.displacement)) }}{{ t('booking.displacement_cc') }}</p>
		<p v-if="vehicleDetail?.fuel_type">{{ t('booking.fuel_type_car') }} {{ vehicleDetail?.fuel_type || '' }}</p>
		<p v-if="vehicleDetail?.fuel">{{ t('booking.fuel_consumption') }} {{ numberWithCommas((+vehicleDetail?.fuel)) }}{{ t('booking.fuel_consumption_km') }}</p>
		<p v-if="vehicleDetail?.wheel_drive_type">{{ t('booking.4WD/2WD') }} {{ numberWithCommas((+vehicleDetail?.wheel_drive_type)?.toFixed(0)) }} {{ t('booking.WD') }}</p>
		<p v-if="vehicleDetail?.length  || vehicleDetail?.width || vehicleDetail?.height">
			{{ t('booking.size') }} {{ vehicleDetail?.length ? numberWithCommas((+vehicleDetail?.length)) : '-'}}/{{vehicleDetail?.width ? numberWithCommas((+vehicleDetail?.width)) : '-'}}/{{ vehicleDetail?.height ? numberWithCommas((+vehicleDetail?.height)) : '-' }}{{ vehicleDetail?.height ? t('booking.size_mmm') : '-'}}
		</p>
		<p v-if="vehicleDetail?.car_navi && vehicleDetail?.car_navi ==1">{{ t('booking.car_navi') }}{{ t('booking.yes_checkbox') }}</p>
		<p v-else-if="vehicleDetail?.car_navi && vehicleDetail?.car_navi ==2">{{ t('booking.car_navi') }} {{ t('booking.no_checkbox') }}</p>
		<p v-if="vehicleDetail?.etc && vehicleDetail?.etc ==1">{{ t('booking.car_etc') }} {{ t('booking.yes_checkbox') }}</p>
		<p v-if="vehicleDetail?.etc && vehicleDetail?.etc ==2">{{ t('booking.car_etc') }} {{ t('booking.no_checkbox') }}</p>
		<p v-if="vehicleDetail?.max_load_capacity">{{t('booking.maximum_loading_capacity')}} {{vehicleDetail?.max_load_capacity || '' }} {{t('booking.weight_kg')}}</p>
		<p v-if="vehicleDetail?.vehicle_total_weight">{{t('booking.vehicle_total_weight')}} {{vehicleDetail?.vehicle_total_weight || '' }} {{t('booking.weight_kg')}}</p>
		<p v-if="vehicleDetail?.auto_manual==1">{{t('booking.type_car_AT')}}</p>
		<p v-if="vehicleDetail?.auto_manual==2">{{t('booking.type_car_MT')}}</p>
	</div>
	<div v-else class="base-detail">
		<p>{{ t('booking.car_model_name') }}</p>
		<p>{{ t('booking.capacity') }}</p>
		<p>{{ t('booking.displacement') }}</p>
		<p>{{ t('booking.fuel_consumption') }}</p>
		<p>{{ t('booking.size') }}</p>
		<p>{{t('booking.maximum_loading_capacity')}} {{t('booking.weight_kg')}}</p>
		<p>{{t('booking.vehicle_total_weight')}} {{t('booking.weight_kg')}}</p>
		<p>{{t('booking.type_car')}}</p>
	</div>
</template>

<style lang="scss" scoped>

.info_from_station {
	width: 800px;
	word-wrap: break-word;
}
.base_tetail_confirm{
	width: 100%;
	word-wrap: break-word;
}
p{
	margin-bottom: 10px;
}
.appeal_point{
	width: 800px;
	p {
		font-weight: bold !important;
		word-wrap: break-word;
	}
}
.css_base_detail{
	width: 100%;
	word-wrap: break-word;
}
</style>
