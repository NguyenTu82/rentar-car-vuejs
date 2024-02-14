<script setup lang="ts">
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { useBookingStore } from '~/booking/stores/booking';
import { useDownloadStore } from '~/users/stores/download';
import { useUserStore } from '~/users/stores/user';
import { useCommonStore } from '../store/CommonStore';
import { useCommercialStore } from '../store/SpecifiedCommercial';
import { AUTHEN } from '../utils/constant';

const { isMobile } = storeToRefs(useCommonStore());
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const { t } = useI18n();
const bookingStore = useBookingStore();
const { boardingPlace, returnPlace, boardingTime, returnTime, checkCallApiStation, checkCallApiDate } =
	storeToRefs(bookingStore);
const { checkShowModal } = storeToRefs(useUserStore());
const router = useRouter();
const isShowModalError = ref(false);
const textErrorAuthen = ref<any>(AUTHEN.TEXT_ERROR_AUTHEN);
const scrollButtonSubmit = ref<HTMLButtonElement | null>(null);
const buttonCancel = ref(t('button.ok'));
const userCommerStore = useCommercialStore();
onMounted(() => {
	checkShowModal.value = false;
	if (router?.currentRoute?.value?.query?.param === 'authenticated') {
		buttonCancel.value = t('button.cancel');
		isShowModalError.value = true;
	}
	bookingStore.setListSubDriver('');
	bookingStore.setClearSelectedCategory();
	userCommerStore.getCommercial();
});
const checkShowModal1 = computed(() => {
	return checkShowModal.value;
});
const onSubmit = async () => {
	let parseTime = (timeString: any) => moment(timeString, 'HH:mm');
	const boardingPlaceStartTime = boardingPlace.value?.start_business_time?.slice(0, 5);
	const boardingPlaceEndTime = boardingPlace.value?.end_business_time?.slice(0, 5);
	const boardingTimePlace: any = moment(boardingTime.value).format('HH:mm');
	const returnPlaceStartTime = returnPlace.value?.start_business_time?.slice(0, 5);
	const returnPlaceEndTime = returnPlace.value?.end_business_time?.slice(0, 5);
	const returnTimePlace: any = moment(returnTime.value).format('HH:mm');

	if (
		boardingPlaceStartTime &&
		boardingPlaceEndTime &&
		!(
			(parseTime(boardingTimePlace).isSame(parseTime(boardingPlaceStartTime)) ||
				parseTime(boardingTimePlace).isAfter(parseTime(boardingPlaceStartTime))) &&
			(parseTime(boardingTimePlace).isSame(parseTime(boardingPlaceEndTime)) ||
				parseTime(boardingTimePlace).isBefore(parseTime(boardingPlaceEndTime)))
		)
	) {
		textErrorAuthen.value =
			t('booking.text_error_start_time1') +
			boardingPlaceStartTime +
			'～' +
			boardingPlaceEndTime +
			t('booking.text_error_start_time2');
		buttonCancel.value = t('button.ok');
		isShowModalError.value = true;
		return;
	}

	if (
		returnPlaceStartTime &&
		returnPlaceEndTime &&
		!(
			(parseTime(returnTimePlace).isSame(parseTime(returnPlaceStartTime)) ||
				parseTime(returnTimePlace).isAfter(parseTime(returnPlaceStartTime))) &&
			(parseTime(returnTimePlace).isSame(parseTime(returnPlaceEndTime)) ||
				parseTime(returnTimePlace).isBefore(parseTime(returnPlaceEndTime)))
		)
	) {
		textErrorAuthen.value =
			t('booking.text_error_end_time') +
			returnPlaceStartTime +
			'～' +
			returnPlaceEndTime +
			t('booking.text_error_start_time2');
		buttonCancel.value = t('button.ok');
		isShowModalError.value = true;
		return;
	}

	await bookingStore.fetchCategory(boardingPlace?.value?.franchise_id);
	if (!bookingStore.selectedCategory) {
		bookingStore.setSelectedCategory(bookingStore.listCategories[0].id);
	}
	await bookingStore.fetchAvailableVehicle(bookingStore.selectedCategory);
	bookingStore.setClearSelectedCategory();

	router.push('/booking/list');
};

watch(
	() => bookingStore.isReadyToSearch,
	() => {
		if (bookingStore.isReadyToSearch == true) {
			nextTick(() => {
				scrollButtonSubmit.value?.focus();
			});
		}
	},
);
const handlrClose = () => {
	buttonCancel.value = t('button.cancel');
	isShowModalError.value = false;
};
</script>
<template>
	<ModalLoading v-if="checkCallApiStation && checkCallApiDate" />
	<main class="home__Car">
		<div class="wrapper">
			<Header />
		</div>
		<div
			class="booking booking__map container-xl bg-white"
			:class="{ mgtop_download: checkShowDownLoadUqey && isMobile }"
		>
			<Search />
			<div class="row">
				<div class="col-12 col-lg-6 sm-order-2">
					<StationList />
				</div>
				<div class="block__map col-12 col-lg-6 sm-order-1">
					<Map />
				</div>
			</div>

			<div v-if="bookingStore.isReadyToSearch" class="booking-action">
				<button ref="scrollButtonSubmit" class="btn-booking" @click="onSubmit">{{ t('button.search_for') }}</button>
			</div>
		</div>

		<div class="unlock_freekey bg-white container-xl">
			<div class="freekey__info">
				<h4 class="title__freekey">{{ t('home.rental_car_smartphone') }}</h4>
				<p class="desc__freekey">{{ t('home.reserved_smartphone') }}</p>
				<p class="desc__freekey">{{ t('home.reserved_smartphone1') }}</p>
				<div class="link__freekey">
					<a style="margin-right: 15px" href="https://apps.apple.com/jp/app/uqey/id6444780033" target="_blank">
						<img class="applestore" src="/images/AppleStoreNew.svg" alt="apple store" />
					</a>
					<a href="https://play.google.com/store/apps/details?id=jp.co.tokai_rika.uqey" target="_blank">
						<img class="chplay" src="/images/ChplayNew.png" alt="ch play" />
					</a>
				</div>
				<div class="des_freekey">
					<div class="des_freekey_detail">
						<p class="desc__freekey1">{{ t('home.des1') }}</p>
						<p class="desc__freekey1">{{ t('home.des2') }}</p>
						<p class="desc__freekey1">{{ t('home.des3') }}</p>
					</div>
				</div>
			</div>
			<div class="phone_freekey__img">
				<img src="/images/phoneNew.png" alt="" />
			</div>
			<hr />
		</div>

		<Footer />

		<ErrorModal
			v-if="isShowModalError"
			@closeModalError="handlrClose"
			:resError="textErrorAuthen"
			:buttonCancel="buttonCancel"
		/>
	</main>
	<div v-if="checkShowModal1" class="custom-modal custom-modal--align">
		<div class="overlay"></div>
		<div ref="modalContent" class="custom-modal-body custom-modal-body-mar">
			<template class="display-modal">
				<div class="custom-modal-content-succc">
					<p>ログアウトしました。</p>
				</div>
			</template>
		</div>
	</div>
</template>

<style scoped lang="scss">
.mgtop_download {
	margin-top: 160px !important;
}
.custom-modal {
	.display-modal {
		display: block;
	}
	.custom-modal-content-succc {
		display: flex;
		justify-content: center;
		align-items: center;
		p {
			margin-bottom: 0;
		}
	}
	position: fixed;
}

.custom-modal--align {
	align-items: start;
	.custom-modal-body-mar {
		margin-top: 80px;
		@media only screen and (max-width: 450px) {
			margin-top: 170px;
			min-width: 350px;
			padding: 2rem;
		}
	}
}
.booking__map {
	margin-top: 80px;
}
.home__Car {
	width: 100%;
	background-color: #e3e3e3;
}
.unlock_freekey {
	display: flex;
}
.freekey__info {
	width: 60%;
	padding: 120px 80px;
	// background-color: #bae7ff;
}
.title__freekey {
	font-weight: 600;
	font-size: 24px;
	line-height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #000000;
	margin-bottom: 50px;
	// background-color: red;
}
.desc__freekey {
	font-size: 20px;
	color: #000000;
	// line-height: 40px;
	// background-color: #5f5f5f;
}
.desc__freekey1 {
	font-size: 13px;
	color: #000000;
	margin: 0;
	text-align: center;
	// line-height: 40px;
}
.link__freekey {
	display: flex;
	justify-content: center;
	margin-top: 50px;
	margin-bottom: 50px;
	// background-color: blue;
}
.link__freekey img {
	// width: 250px;
	height: 60px;
}
.des_freekey {
	width: 100%;
	text-align: center;
}
img .applestore {
	height: 60px;
	object-fit: cover;
}
img .chplay {
	height: 60px;
}
.phone_freekey__img {
	padding: 75px 0;
	width: 50%;
	display: flex;
	justify-content: center;
}
.phone_freekey__img img {
	width: auto;
	height: 500px;
	/* border-radius: 30px; */
	object-fit: cover;
}
.new_car__rental {
	background-color: #fff;
	padding: 40px 44px;
	display: flex;
}
.rental__img {
	display: flex;
	width: 50%;
	justify-content: center;
	align-items: center;
}
.rental__img img {
	height: 350px;
	margin-left: 10px;
	border-radius: 10px;
	box-shadow: 4px 4px 10px rgb(0 0 0 / 24%);
}
.rental__info {
	width: 50%;
	height: 490px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.list_desc {
	display: flex;
	justify-content: center;
	margin-top: 30px;
}
.list_desc .list {
	margin: 0 10px;
}
.list_desc .list .item {
	margin-bottom: 30px;
	display: flex;
	align-items: center;
}
.list .item .circle {
	width: 45px;
	height: 45px;
	background: #bae7ff;
	border-radius: 50%;
}
.ourcars {
	padding: 30px 100px 0 100px;
}
.ourcars .ourcars__title {
	font-weight: 700;
	font-size: 28px;
	line-height: 50px;
	display: flex;
	align-items: center;
	color: #000000;
}
.ourcars .list__car {
	display: flex;
	padding: 40px 0;
	overflow-x: auto;
	flex-wrap: nowrap;
}
.list__car .item__car {
	margin-right: 20px;
	width: 380px;
	height: 315px;
	background: #ffffff;
	border-radius: 20px;
	border: 1px solid rgba(0, 0, 0, 0.24);
	box-shadow: 4px 4px 10px rgb(0 0 0 / 24%);
	overflow: hidden;
}
.item__car .car__img {
	margin: 0 75px;
	height: 125px;
	position: relative;
	top: -72%;
}
.car__img img {
	width: 100%;
	height: 100%;
	object-fit: contain;
	border-radius: 16px;
}
.item__car .car__info {
	text-align: center;
	height: 50%;
	padding-top: 10px;
	color: #5f5f5f;
	font-style: normal;
	font-weight: 500;
	font-size: 15px;
	line-height: 20px;
}
.freekeyrent {
	margin-top: 56px;
	margin-left: 98px;
}
.freekeyrent h4 {
	text-align: start;
	font-family: 'Abel';
	font-style: normal;
	font-weight: 400;
	font-size: 20px;
	line-height: 51px;
	letter-spacing: 0.28em;
	color: #000000;
}
.freekeyrent p {
	margin-top: 108px;
	margin-right: 70px;
	text-align: right;
	font-style: normal;
	font-weight: 400;
	font-size: 18px;
	line-height: 50px;
	color: #000000;
}
.btn-search {
	background-color: #bae7ff;
	border-radius: 100%;
	margin-left: 15px;
}
.car_price {
	height: 50%;
	background-color: #e9e9e9;
	padding-top: 60px;
	text-align: center;
	font-style: normal;
	font-weight: bold;
	font-size: 20px;
	line-height: 40px;
	color: #000000;
}
.car_price span {
	font-size: 15px;
}
.car_more_info {
	display: flex;
	justify-content: space-between;
	padding: 0 18px;
	color: #5f5f5f;
	font-weight: 100;
	font-size: 16px;
}
.list__car::-webkit-scrollbar {
	height: 13px;
	background-color: #f5f5f5;
}
.list__car::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background-color: #c1c1c1;
}
.list__car::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 3px rgb(0 0 0 / 30%);
	border-radius: 10px;
	background-color: #f5f5f5;
}
@media only screen and (max-width: 991px) {
	.ourcars {
		padding: 30px 50px 0 50px;
	}
	.link__freekey img {
		width: 200px;
		height: 65px;
	}
	.phone_freekey__img img {
		width: auto;
		height: 380px;
	}
	.link__freekey {
		margin-top: 50px;
	}
	.list__car .item__car {
		width: 300px;
		height: 265px;
	}
	.freekey__info {
		padding: 100px 30px;
	}
	.car_price {
		padding-top: 50px;
	}
	.block__map {
		margin-top: 1rem;
		width: 100%;
		height: 55vh;
	}
	.title__freekey {
		margin-bottom: 30px;
	}
	.desc__freekey {
	}
}
@media only screen and (max-width: 767px) {
	.ourcars {
		padding: 30px 50px 0 50px;
	}
	.link__freekey img {
		width: 155px;
		height: 50px;
	}
	.phone_freekey__img img {
		width: auto;
		height: 320px;
	}
	.link__freekey {
		margin-top: 50px;
	}
	.list__car .item__car {
		width: 300px;
		height: 265px;
	}
	.freekey__info {
		padding: 100px 30px;
	}
	.title__freekey {
		font-size: 20px;
		line-height: 26px;
		//margin-bottom: 50px;
	}
	.desc__freekey {
		font-size: 16px;
		line-height: 26px;
		margin-bottom: 0px;
	}
	.block__map {
		height: 45vh;
	}
	.des_freekey {
		width: 200%;
	}
}
@media screen and (max-width: 610px) {
	.phone_freekey__img img {
		margin-top: 24px;
		margin-left: -10px;
		width: auto;
		height: 275px;
	}
	.des_freekey {
		width: 200%;
	}
}
@media screen and (max-width: 480px) {
	.search__component {
		padding: 1rem 0;
	}
	.freekey__info {
		padding: 100px 30px 100px 0;
	}

	.freekey__info h4 {
		//margin-bottom: 70px;
	}

	.link__freekey {
		margin-top: 75px;
		justify-content: unset;
	}
	.des_freekey {
		width: 200%;
	}

	.link__freekey .chplay {
		// margin-left: 1.5rem;
	}

	.footer__policy--item {
		font-size: 14px;
	}

	.footer__policy--content {
		margin-right: 10px;
	}

	.footer__policy--border-right {
		margin-right: 10px;
	}
	.phone_freekey__img img {
		height: 200px;
	}
}
</style>
<route lang="yaml">
meta:
  layout: home
</route>
