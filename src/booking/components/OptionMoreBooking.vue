<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/users/stores/user';
import { useBookingStore } from '~/booking/stores/booking';
import { numberWithCommas } from '~/common/utils/common';
const bookingStore = useBookingStore();
const { vehicleDetail } = storeToRefs(bookingStore);
const { t } = useI18n()
const checkTokenModal = ref(false)
const {token} = storeToRefs(useUserStore())
const router = useRouter()
const route = useRoute()
const checkToken = computed(()=>{
  if(token.value){
    checkTokenModal.value =  false
  }
	return token.value
})

const setModalLogin = () => {
  checkTokenModal.value =  false

};
const handleRedirectCarDetail = () => {
	router.push({
		path: `/booking/${route.params.id}/insurance`,
		query: {},
	});
};
const handleRedirectReservation = () => {
	if (token.value) {
		router.push({
			path: `/booking/${route.params.id}/reservation-confirmation`,
			query: {},
		});
	} else {
    checkTokenModal.value =  true
  }
};
</script>

<template>
  <div class="insurance page-detail row">
    <div class="col">
      <CarImage />
      <Option />
    </div>
    <div class="col">
      <InfomationCar/>
      <div class="note">
          <!-- <p>{{ t('booking.note_vehicle') }}</p> -->
          <!-- <p>
            {{ t('booking.note_WLTC') }}<br />
            {{ t('booking.note_WLTC2') }}
          </p> -->
        </div>
        <div class="price">
          <p class="fee">
            {{ t('booking.applicable_fee') }}
          </p>
          <p class="amount">
            {{ numberWithCommas(vehicleDetail.unit_price + vehicleDetail.per_night_price * vehicleDetail.count_day)}}円
          </p>
        </div>
      <div class="box-action">
        <button
          type="button"
          class="btn btn-secondary m-2"
          @click="handleRedirectCarDetail()"
        >
          {{ t('booking.return_vehicle') }}
        </button>
        <button
          type="button"
          class="btn btn-primary m-2"
          @click="handleRedirectReservation()"
        >
          {{ t('button.reserve') }}
        </button>
      </div>
    </div>
    <ModalLogin v-if="checkTokenModal" @checkLogin="setModalLogin"/>
  </div>
</template>