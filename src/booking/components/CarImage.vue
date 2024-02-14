<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBookingStore } from '~/booking/stores/booking';
import { NUMBER } from '~/common/utils/constant';

const bookingStore = useBookingStore();
const { vehicleDetail } = storeToRefs(bookingStore);

const setDataBsSlideTo = (img2: any, img3: any) => {
	if (img2 && img3) {
		return NUMBER.THIRST;
	} else if ((img2 && !img3) || (!img2 && img3)) {
		return NUMBER.SECOND;
	} else if (!img2 && !img3) {
		return NUMBER.FIRST;
	}
};
</script>

<template>
	<div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="false">
		<div class="carousel-inner">
			<div v-if="vehicleDetail?.vehicle_detail_img" class="carousel-item active" data-bs-interval="2000">
				<img class="d-block" height="450" :src="vehicleDetail?.vehicle_detail_img" alt="First slide" />

				<!-- <div class="carousel-caption d-none d-md-block">
          <h5>First slide label</h5>
          <p>Some representative placeholder content for the first slide.</p>
        </div> -->
			</div>
			<div v-if="vehicleDetail?.img2" class="carousel-item" data-bs-interval="2000">
				<img class="d-block" height="450" :src="vehicleDetail?.img2" alt="Second slide" />

				<!-- <div class="carousel-caption d-none d-md-block">
          <h5>First slide label</h5>
          <p>Some representative placeholder content for the first slide.</p>
        </div> -->
			</div>
			<div v-if="vehicleDetail?.img3" class="carousel-item" data-bs-interval="2000">
				<img class="d-block" height="450" :src="vehicleDetail?.img3" alt="Third slide" />

				<!-- <div class="carousel-caption d-none d-md-block">
          <h5>Second slide label</h5>
          <p>Some representative placeholder content for the second slide.</p>
        </div> -->
			</div>
			<div v-if="vehicleDetail?.img4" class="carousel-item" data-bs-interval="2000">
				<img class="d-block" height="450" :src="vehicleDetail?.img4" alt="Four slide" />

				<!-- <div class="carousel-caption d-none d-md-block">
          <h5>Third slide label</h5>
          <p>Some representative placeholder content for the third slide.</p>
        </div> -->
			</div>
		</div>
		<h5 class="vehicle_number">{{ vehicleDetail?.vehicle_number }}</h5>
		<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Previous</span>
		</button>
		<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Next</span>
		</button>
	</div>
	<div class="my-indicators">
		<img
			v-if="vehicleDetail?.vehicle_detail_img"
			data-bs-target="#carouselExampleCaptions"
			data-bs-slide-to="0"
			class="active"
			aria-current="true"
			aria-label="Slide 1"
			height="450"
			:src="vehicleDetail?.vehicle_detail_img"
			alt="First slide"
		/>
		<img
			v-if="vehicleDetail?.img2"
			data-bs-target="#carouselExampleCaptions"
			data-bs-slide-to="1"
			aria-label="Slide 2"
			:src="vehicleDetail?.img2"
			alt="Second slide"
		/>
		<img
			v-if="vehicleDetail?.img3"
			data-bs-target="#carouselExampleCaptions"
			:data-bs-slide-to="vehicleDetail?.img2 ? 2 : 1"
			aria-label="Slide 3"
			:src="vehicleDetail?.img3"
			alt="Third slide"
		/>
		<img
			v-if="vehicleDetail?.img4"
			type="button"
			data-bs-target="#carouselExampleCaptions"
			:data-bs-slide-to="setDataBsSlideTo(vehicleDetail?.img2, vehicleDetail?.img3)"
			aria-label="Slide 4"
			:src="vehicleDetail?.img4"
			alt="Four slide"
		/>
	</div>
</template>

<style scoped lang="scss">
.vehicle_number {
	text-align: center;
	font-size: 18px;
	color: #000000;
}
#carouselExampleCaptions {
	.carousel-inner {
		img {
			margin: auto;
			width: 100%;
			object-fit: contain;
		}
	}
}

@media screen and (max-width: 992px) {
	#carouselExampleCaptions {
		.carousel-inner {
			img {
				height: 330px;
				width: 330px;
			}
		}
	}
}

@media screen and (max-width: 480px) {
	#carouselExampleCaptions {
		.carousel-inner {
			img {
				height: auto;
			}
		}
	}
}
</style>
