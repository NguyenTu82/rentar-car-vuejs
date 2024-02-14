<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { generateTimeRangeToEndDate } from '~/common/utils/generator';
import { useBookingStore } from '../stores/booking';
import { STRING } from '~/common/utils/constant';

const { t } = useI18n();

const onSearch = async () => {
	const input = document.getElementById('mapInput') as HTMLInputElement;

	google.maps.event.trigger(input, 'focus');

	google.maps.event.trigger(input, 'keypress', {
		keyCode: 13,
	});
};
const searchLocation = ref();

const bookingStore = useBookingStore();
const { boardingPlace, returnPlace, workingDays, boardingTime, returnTime, listCategories, selectedCategory, twoWay } =
	storeToRefs(bookingStore);

const isBoardingPlaceClearable = computed(() => {
	return !!boardingPlace.value && (!returnPlace.value || !twoWay.value);
});

const isReturnPlaceClearable = computed(() => {
	return !!returnPlace.value && !!twoWay.value;
});

const onClearBoardingPlace = () => {
	if (isBoardingPlaceClearable) {
		bookingStore.setBoardingPlace(null);
	}
};

const onClearReturnPlace = () => {
	if (isReturnPlaceClearable) {
		bookingStore.setReturnPlace(null);
	}
};

const dateRange = computed(() => {
	let result: any[] = [];

	workingDays.value.forEach((date) => {
		result = [...result, ...generateTimeRangeToEndDate(date)];
	});

	return result;
});

const datePickRange = computed(() => {
	if (returnTime.value) {
		return dateRange.value.filter((date) => date < (returnTime.value as Date));
	}

	return dateRange.value.slice(0, dateRange.value.length - 1);
});

const dateReturnRange = computed(() => {
	if (boardingTime.value) {
		return dateRange.value.filter((date) => date > (boardingTime.value as Date));
	}

	return dateRange.value.slice(1);
});

watch(boardingTime, () => bookingStore.checkStationAvailable());
watch(returnTime, () => bookingStore.checkStationAvailable());

onMounted(() => {
	bookingStore.fetchWorkingDay();
	// bookingStore.fetchCategory();
});
</script>
<template>
	<div class="search__component bg-white">
		<!-- <form> -->
		<div class="search__map search-d-flex flex-row row align-items-center">
			<label class="control-label" for="mapInput">{{ t('search.map_search') }}</label>
		</div>
		<div class="d-flex flex-row row align-items-center__cus">
			<div class="form-group col-12">
				<input
					v-model="searchLocation"
					type="text"
					class="form-control search-location"
					id="mapInput"
					:placeholder="$t('search.map_search_pla')"
				/>
				<span class="iconify" data-icon="fa-solid fa-magnifying-glass"></span>
				<font-awesome-icon icon="fa-solid fa-magnifying-glass" size="2x" />
			</div>
		</div>
		<div class="d-flex flex-row row align-items-center__cus">
			<div class="form-group col-12 col-md-6 col-lg-3">
				<label class="label-datepicker">{{ t('search.date_time_boarding') }}</label>
				<BookingTimePicker :date-range="datePickRange" :dateTimeBoarding="STRING.START" v-model="boardingTime" />
			</div>
			<div class="form-group col-12 col-md-6 col-lg-3">
				<label class="label-datepicker">{{ t('search.return_date_time') }}</label>
				<BookingTimePicker :date-range="dateReturnRange" :dateTimeBoarding="STRING.RETURN" v-model="returnTime" />
			</div>
			<div class="form-group col-12 col-md-6 col-lg-3">
				<label>{{ t('search.boarding_place') }}</label>
				<div class="form-address">
					<div class="icon me-1"><bx:map width="28" height="28" inline /></div>
					<div class="text">{{ boardingPlace?.address }}</div>
					<div v-if="isBoardingPlaceClearable" class="icon btn-clear ms-1" @click="onClearBoardingPlace">
						<carbon:close />
					</div>
				</div>
			</div>
			<div v-if="boardingPlace" class="form-group col-12 col-md-6 col-lg-3">
				<label>{{ t('search.place_return') }}</label>
				<div class="form-address">
					<div class="icon me-1"><bx:map width="28" height="28" inline /></div>
					<div class="text" :style="[twoWay ? { color: '#E9E9E9' } : {}]">{{ returnPlace?.address }}</div>
					<div v-if="isReturnPlaceClearable" class="icon btn-clear ms-1" @click="onClearReturnPlace">
						<carbon:close />
					</div>
				</div>
				<!-- v-if="!isReturnPlaceClearable" -->
				<button class="btn-same-as-boarding-place mt-2" @click="bookingStore.setReturnPlace(boardingPlace)">
					{{ t('button.boarding_station') }}
				</button>
			</div>
		</div>
		<!-- </form> -->
	</div>
</template>
<style lang="scss">
.vehicle-selection {
	width: 40%;
}
.search__component {
	.search__map {
		padding-top: 1rem;
		justify-content: space-between;
		label {
			width: 120px;
			margin: auto 0;
		}
	}
	.form-datepicker input,
	.form-select,
	.form-address {
		border-radius: 30px;
		border: 1px solid #bfbfbf !important;
	}

	label {
		margin-bottom: 10px;
	}

	.form-address {
		padding: 6px;
		padding-left: 20px;
		max-height: 40px;
		min-height: 40px;
		font-weight: 400;
		display: flex;
		align-items: center;

		.icon {
			width: 20px;
			height: 20px;
			display: flex;
			justify-content: center;
			align-items: center;

			svg {
				padding: 0;
			}

			&.btn-clear {
				cursor: pointer;
			}
		}

		.text {
			flex: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.btn-same-as-boarding-place {
		padding: 6px 20px;
		background-color: #173ab8;
		color: #fff;
		border: none;
		border-radius: 999px;
	}

	.control-label {
		width: 120px;
	}
	.search-location {
		border: 1px solid #bfbfbf;
		margin: 10px 0;
	}
}
</style>
