<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBookingStore } from '~/booking/stores/booking';
import { useCommonStore } from '~/common/store/CommonStore';
import { NUMBER } from '~/common/utils/constant';
import { useDownloadStore } from '~/users/stores/download';

const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const { isMobile } = storeToRefs(useCommonStore());

const router = useRouter();
const { t } = useI18n();
const bookingStore = useBookingStore();
const { availableVehicles, listCategories, selectedCategory, resError } = storeToRefs(bookingStore);
const curPage = ref<any>(NUMBER.FIRST);
const dataVehicles = ref<any>([]);
const isShowModalErrorBooking = ref(false);
const buttonCancel = ref(t('button.ok'));

onMounted(() => {
	_getVehicles();
	bookingStore.resetStationProblemUser();
	if (resError.value) {
		isShowModalErrorBooking.value = true;
	}
	bookingStore.setListSubDriver('');
});

watch(curPage, () => {
	_getVehicles();
});

watch(resError, () => {
	if (resError.value) {
		isShowModalErrorBooking.value = true;
	}
});

watch(availableVehicles, () => {
	_getVehicles();
});

const _getVehicles = () => {
	dataVehicles.value = availableVehicles.value?.slice(
		(curPage.value - 1) * NUMBER.LIMMIT_PAGE,
		curPage.value * NUMBER.LIMMIT_PAGE,
	);
};

const onChange = async (id: number) => {
	await bookingStore.fetchAvailableVehicle(id);
	bookingStore.setSelectedCategory(id);
	curPage.value = NUMBER.FIRST;
};

const goDetailCar = async (id: any) => {
	await bookingStore.fetchVehicleDetail(id);
	router.push({ path: `/booking/${id}/detail` });
};

const handleCurrentPage = (cur: any) => {
	console.log('cur', cur);
	curPage.value = cur;
};

const backHome = computed(() => {
	return '/';
});
</script>
<template>
	<main class="single-page">
		<div>
			<section class="dashboard">
				<div class="page" :class="{ mg_top__info: checkShowDownLoadUqey && isMobile }">
					<CarBasicInfo />
					<div class="d-flex d-flex--cus">
						<div class="title-typecar">{{ t('booking.category') }}</div>
						<div class="filters">
							<div v-for="item in listCategories" :key="item.id" class="category-tag">
								<a :class="{ active: selectedCategory == item.id }" @click="onChange(item.id)">{{ item.name }}</a>
							</div>
						</div>
					</div>
					<hr />
					<template v-if="availableVehicles?.length">
						<div class="list_cars">
							<div class="car-item" v-for="(car, index) in dataVehicles" :key="index">
								<div @click="goDetailCar(car.id)">
									<div class="img-car"><img width="300" :src="car.img" /></div>
									<div class="card-content">
										<div class="list__car_title">{{ car.vehicle_number }}</div>
										<div class="list__car_title">{{ car.brand }}</div>
										<div class="list__car_title">{{ car.name }}</div>
									</div>
								</div>
							</div>
						</div>
					</template>

					<template v-else>
						<div class="not-found">
							{{ t('not-found') }}
						</div>
					</template>

					<div class="return__home">
						<router-link :to="backHome" class="return__home--btn">
							{{ t('booking.return_previous') }}
						</router-link>
					</div>

					<template v-if="(availableVehicles?.length || NUMBER.ZERO) > NUMBER.LIMMIT_PAGE">
						<Paginate :totalItems="availableVehicles?.length" @currentPage="handleCurrentPage" :curPage="curPage" />
					</template>
				</div>
			</section>
		</div>
	</main>
	<ErrorModal
		v-if="isShowModalErrorBooking"
		@closeModalError="isShowModalErrorBooking = false"
		:resError="resError"
		:buttonCancel="buttonCancel"
	/>
</template>
<style scoped lang="scss">
.return__home {
	display: flex;
	justify-content: center;
	text-align: center;
	margin: 10px 0;
	margin-left: -10px;
	.return__home--btn {
		border-radius: 20px;
		background: #9d9da1;
		padding: 5px 20px;
		color: white;
		border: none;
		min-width: 90px;
		font-size: 15px;
	}
}

.page hr {
	border: solid 1px #000;
	margin: 0.5rem 0rem 1rem;
}
.title-typecar {
	min-width: 8rem;
	font-weight: bold;
	font-size: 20px;
	margin: auto 3rem;
}
.filters .category-tag {
	margin: 10px 1rem;
}

.filters {
	font-size: 14px;
	display: flex;
	flex-wrap: wrap;
}

.filters a {
	border: 1px solid blue;
	padding: 5px 20px;
	border-radius: 25px;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: break-word;
}

.filters a.active {
	background: blue;
	color: white;
	cursor: default;
	pointer-events: none;
}

.car-item {
	overflow: hidden;
	border: 1px solid #000;
	border-radius: 24px;
	padding: 10px 10px 0rem;
	// margin: 6px;
	// width: 15rem;
	// height: 15rem;
	font-size: 15px;
	width: calc(16.6% - 11.5px);
	margin-left: 12px;
	margin-bottom: 12px;
	cursor: pointer;
	span {
		font-size: 20px;
		font-weight: bold;
	}
}

.img-car img {
	height: 10rem;
	width: 100%;
	object-fit: contain;
	flex-shrink: 0;
	border-radius: 10px;
	margin-bottom: 10px;
}
.list_cars {
	--spacing: 12px;
	display: flex;
	flex-wrap: wrap;
	margin-left: calc(-1 * var(--spacing));
}
.list__car_title {
	line-height: 28px;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: break-word;
}

.card-content {
	flex: 1;
	display: flex;
	flex-direction: column;
}

@media only screen and (max-width: 1500px) {
	.list_cars {
		margin-left: calc(-1 * 18px);
	}
	.car-item {
		width: calc(20% - 18px);
		margin-left: 18px;
		margin-bottom: 18px;
	}
}

@media screen and (max-width: 1224px) {
	.list_cars {
		margin-left: calc(-1 * 18px);
	}
	.car-item {
		width: calc(25% - 18px);
		margin-left: 18px;
		margin-bottom: 18px;
	}
}

@media screen and (max-width: 1024px) {
	.list_cars {
		margin-left: calc(-1 * 18px);
	}
	.car-item {
		width: calc(33.3% - 18px);
		margin-left: 18px;
		margin-bottom: 18px;
	}
}

@media screen and (max-width: 768px) {
	.list_cars {
		margin-left: calc(-1 * 18px);
	}
	.car-item {
		width: calc(50% - 18px);
		margin-left: 18px;
		margin-bottom: 18px;
	}
	.img-car img {
		height: 12rem;
	}
}

@media screen and (max-width: 480px) {
	.list_cars {
		margin-left: 0;
	}
	.car-item {
		width: calc(100%);
		margin-left: 0;
		margin-bottom: 18px;
	}
	.img-car img {
		height: 12rem;
	}
	.title-typecar {
		margin: 10px 0;
	}
}
</style>
<route lang="yaml">
meta:
  layout: booking
</route>
