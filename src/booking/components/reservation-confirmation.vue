<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInsuranceStore } from '../stores/insuranceStores';
import { useBookingStore } from '~/booking/stores/booking';
import { useCreditInfoStore } from '~/account/stores/CreditInfoStore';
const { t } = useI18n()
const route = useRoute();
const router = useRouter()
const getInsurance = ref('');
const priceCar = ref(1230)
const { selected } = storeToRefs(useInsuranceStore());
const bookingStore = useBookingStore();

const { vehicleDetail , boardingTime , returnTime, boardingPlace} = storeToRefs(bookingStore);

onMounted(() => {
  console.log( returnTime.value)
  // if(returnTime.value && boardingTime.value){
  //     console.log( returnTime.value.getTime() - boardingTime.value.getTime())
  //   }

});

const dataChoiceInsurance = computed(() => {
	return selected.value;
});
const totalPriceCar = computed(() => {
  if(dataChoiceInsurance.value && vehicleDetail.value ){
    return (dataChoiceInsurance.value.price+ vehicleDetail.value.price )
  }
  else{
    return 0
  }
});
const hourCar = computed(()   => {
    let priceRent = 0
    // if(returnTime.value && boardingTime.value){
    //   console.log( returnTime.value.getTime() - boardingTime.value.getTime())
    // }
    return priceRent

})
const handleRedirectCreditCard = async () => {
  await useCreditInfoStore().getCreditInfo();
  router.push({
      path: `/booking/${route.params.id}/select-credit-card`,
      query: {},
    })

}
const handleRedirectBack = () => {
  router.push({
    path: `/booking/${route.params.id}/insurance`,
    query: {},
  })
}
</script>

<template>
  <div class="reverconfirm page-detail insurance-page row">
    <div class="col-12 col-md-6 col-lg-4 reverconfirm__car--but">
      <CarImage />
    </div>
    <div class="col-12 col-md-6 col-lg-4 reverconfirm__car--mag">
      <InfomationCar/>
      <div class="note">
						<p v-if="boardingPlace?.info_from_station" 
						v-html="boardingPlace?.info_from_station.split('\r\n').join('<br/>')  || ''" class="info_from_station">
						</p>
					</div>
    </div>
    <div class="reservation col-lg-4 col-md-12 col-12">
      <TotalRentalCar/>
      <ProblemTextUser/>
      <div class="option-insurence">
        <h4>{{ t('booking.payment_method') }}</h4>
        <div class="select-form">
          <div class="custom-option p-2">
            <input
              id="1"
              type="radio"
              value="payment"
              name="credit card payment"
              class="m-3"
              :checked="true"
            >
            <label for="1">
              <div class="meta">
                <p>{{ t('booking.credit_card_payment') }}</p>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="box-action">
        <button
          type="button"
          class="btn btn-secondary m-2"
          @click="handleRedirectBack()"
        >
          {{ t('booking.return_vehicle') }}
        </button>
        <button
          type="button"
          class="btn btn-primary m-2"
          @click="handleRedirectCreditCard()"
        >
          {{ t('button.next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.appeal_point{
  width: 100% !important;
}

.info_from_station {
	width: 100%;
	word-wrap: break-word;
}
@media screen and (max-width: 480px) {
  .reverconfirm__car--but {
    margin-top: 1.5rem;
  }

  .reverconfirm.page-detail {
    padding: 0;
  }

  .reverconfirm__car--mag {
    margin-bottom: 20px;
  }

  .page .page-detail .car-box-right .box-action {
    margin-bottom: 2rem;
  }
}
</style>
