<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/users/stores/user';
import { useBookingStore } from '~/booking/stores/booking';
import { toFormattedDateTime } from '~/common/utils/formatter';
import { numberWithCommas } from '~/common/utils/common';
const bookingStore = useBookingStore();
const { vehicleDetail ,boardingTime ,returnTime , text_notify_user , checkErrorInput ,checkPickup ,boardingPlace ,totalUsageFee } = storeToRefs(bookingStore);
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
		path: `/booking/${route.params.id}/detail`,
		query: {},
	});
};
const data = {
			owner_station_id : vehicleDetail.value?.owner_station_id || '',
			start_time: toFormattedDateTime(boardingTime.value as Date, 24),
			end_time: toFormattedDateTime(returnTime.value as Date, 24),
		};
const handleRedirectReservation = () => {
  if (token.value) {
    if(text_notify_user.value.replaceAll(" ","") == "" && checkPickup.value == true ){
      checkErrorInput.value = true
    }
    else if(text_notify_user.value != "" && checkPickup.value == true){
      checkErrorInput.value = false
    }
    if(checkPickup.value == false || (checkPickup.value == true && checkErrorInput.value == false)){

      router.push({
        path: `/booking/${route.params.id}/reservation-confirmation`,
        query: {},
      });
    }
	} else {
    checkTokenModal.value =  true
  }
};
</script>

<template>
  <div class="insurance page-detail row">
    <div class="col insurance__mag">
      <CarImage />
      <InfomationCar/>
      <div class="note">
          <!-- <p>{{ t('booking.note_vehicle') }}</p> -->
          <!-- <p>
            {{ t('booking.note_WLTC') }}<br />
            {{ t('booking.note_WLTC2') }}
          </p> -->
        </div>
        <div class="note">
          <p v-if="boardingPlace?.info_from_station" 
						v-html="boardingPlace?.info_from_station.split('\r\n').join('<br/>')  || ''" class="info_from_station">
						</p>
        </div>
        <div class="price">
          <p class="fee">
            {{ t('booking.applicable_fee') }}
          </p>
          <p class="amount">
            {{ numberWithCommas(totalUsageFee)}}円
          </p>
        </div>
    </div>
    <div class="col">
      <IsuranceOption />
      <Option />	
      <choice-pickup/>	
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
          {{ t('button.next') }}
        </button>
      </div>
    </div>
    <ModalLogin v-if="checkTokenModal" @checkLogin="setModalLogin"/>
  </div>
</template>

<style scoped>
.info_from_station {
	width: 800px;
	word-wrap: break-word;
}
.page .page-detail .box-action{
  justify-content: end;
}
.option-insurence{
  margin-top: 40px ;
}
@media screen and (max-width: 920px) {
	.insurance.page-detail .price p {
    font-size: 24px;
  }
}
@media screen and (max-width: 480px) {
  .insurance.page-detail {
    padding: 0;
  }

  .page .page-detail .box-action {
    margin-bottom: 20px;
    justify-content: space-between;
  }

  .insurance.page-detail .price p {
    font-size: 22px;
  }

  .insurance__mag {
    margin-top: 1.5rem;
  }
}
</style>
