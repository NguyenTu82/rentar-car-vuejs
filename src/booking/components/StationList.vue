<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBookingStore } from '../stores/booking';

const { t } = useI18n();
const bookingStore = useBookingStore();
const { stationList, boardingPlace } = storeToRefs(bookingStore);
</script>
<template>
	<div class="placeList__component">
		<h1>{{ t('search.drop_off_station') }}</h1>
		<div v-if="stationList.length">
			<template v-for="(station, index) in stationList" :key="index">
				<Station :key="station.id" :station="station" v-if="!boardingPlace || station.franchise_id === boardingPlace.franchise_id" />
			</template>
		</div>
		<div v-else class="text-center">{{ t('search.no_station') }}</div>
	</div>
</template>
<style scoped lang="scss">
.placeList__component {
	flex-wrap: nowrap;
	margin-top: 16px;
	padding: 0 20px;
	width: 100%;
	height: 40vh;
	position: relative;
	overflow-y: auto;
}
.placeList__component::-webkit-scrollbar {
	width: 13px;
	background-color: #f5f5f5;
}
.placeList__component::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background-color: #c1c1c1;
}
.placeList__component::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 3px rgb(0 0 0 / 30%);
	border-radius: 10px;
	background-color: #f5f5f5;
}
</style>
