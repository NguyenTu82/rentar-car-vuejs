<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useReservationStore } from '~/account/stores/ReservationStore'
import { formatDayTime } from '~/common/utils/common'
import { AUTHEN } from '~/common/utils/constant'
const router = useRouter()
const { t } = useI18n()
const reservationStore = useReservationStore()

const { reservationStatus, errorValidateGetReser } = storeToRefs(reservationStore)

const dataReservationStatus = computed(() => {
	return reservationStatus.value.data || '';
})
const displayContent: Ref<any> = ref(false)
const isShowModalError  = ref(false)
const buttonCancel  = ref(t("button.ok"))

watch(reservationStore, () => {
  displayContent.value = true
})

watch(errorValidateGetReser, () => {
  if (errorValidateGetReser.value !== AUTHEN.MESSAGE) {
    isShowModalError.value = true
  }
})

onMounted(() => {
  reservationStore.getReservationStatus()
})

function handleRedirectReservationDetail(data: any) {
  reservationStore.setReservationDetail(data)
  router.push('/account/reservation-status/detail')
}
</script>

<template>
  <div class="tab_wrapper_reservation_status">
    <div class="reservation_status__title">
      {{ t('revervation.title') }}
    </div>

    <template v-if="dataReservationStatus?.length">
      <div class="reservation_status__box" v-for="data in dataReservationStatus" :key="data.id">
        <div class="reservation_status__box_left">
          <div class="reservation_status__box_title line__subdri">
            <span>{{ t('revervation.boarding_place') }}</span>
            <template v-if="data?.sub_driver_check">
              <span class="reservation__color--red">{{ t('revervation.passenger') }}</span>
            </template>
          </div>
          <div>{{ data?.station_start_address }}</div>
          <div class="reservation_status__box_image">
            <img :src="data.img" alt="">
          </div>
          <span class="vehicle__number vehicle__number--width">{{data?.vehicle_number}}</span>
        </div>
        <div class="reservation_status__box_right">
          <div class="reservation_status__box_title">
            {{ t('revervation.boarding_schedule') }}
          </div>
          <div class="box_time_div">
            <span>{{ formatDayTime(data.start_time) }}</span>
            <span class="box_time_span">→</span>
            <span>{{ formatDayTime(data.end_time) }}</span>
          </div>
          <div class="reservation_status__box_button">
            <button @click="handleRedirectReservationDetail(data)">
              {{ t('revervation.btn_detailed') }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-if="displayContent" class="not-found">
        {{ t('not-found') }}
      </div>
    </template>
    
    <ErrorModal v-if="isShowModalError" @closeModalError="isShowModalError = false" :resError="errorValidateGetReser" :buttonCancel="buttonCancel" />
  </div>
</template>
