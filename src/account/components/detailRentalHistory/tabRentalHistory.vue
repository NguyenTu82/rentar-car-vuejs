<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRentalHistoryStore } from '~/account/stores/RentalHistoryStore'
import { formatDayTime } from '~/common/utils/common'
import { AUTHEN } from '~/common/utils/constant'
const router = useRouter()
const { t } = useI18n()

const buttonCancel  = ref(t("button.ok"))
const rentalHistoryStore = useRentalHistoryStore()
const { rentalHistory, errorValidateGetHis } = storeToRefs(rentalHistoryStore)

const dataRentalHistory = computed(() => {
	return rentalHistory.value.data || '';
})
const displayContent: Ref<any> = ref(false)
const isShowModalError  = ref(false)

onMounted(() => {
  rentalHistoryStore.getRentalHistory()
})

watch(rentalHistoryStore, () => {
  displayContent.value = true
})

watch(errorValidateGetHis, () => {
  if (errorValidateGetHis.value !== AUTHEN.MESSAGE) {
    isShowModalError.value = true
  }
})

const handleRedirectHistoryDetail = (data: any) => {
  rentalHistoryStore.getRentalHistoryDetail(data)
  router.push('/account/rental-history/detail')
}
</script>

<template>
  <div class="tab_wrapper_reservation_status">
    <div class="reservation_status__title">
      {{ t('rental_history.title') }}
    </div>

    <template v-if="dataRentalHistory?.length">
      <div v-for="data in dataRentalHistory" :key="data.id" class="reservation_status__box">
        <div class="reservation_status__box_left">
          <div class="reservation_status__box_title">
            {{ t('rental_history.boarding_place') }}
          </div>
          <div>{{ data?.station_start_address }}</div>
          <div class="reservation_status__box_image">
            <img :src="data.img" alt="">
          </div>
          <span class="vehicle__number vehicle__number--width">{{data?.vehicle_number}}</span>
        </div>
        <div class="reservation_status__box_right">
          <div class="reservation_status__box_title">
            {{ t('rental_history.boarding_schedule') }}
          </div>
          <div class="box_time_div">
            <span>{{ data?.operations_start_time ? formatDayTime(data.operations_start_time) : formatDayTime(data.reservations_start_time) }}</span>
            <span class="box_time_span">→</span>
            <span>{{ data?.operations_start_time ? formatDayTime(data.operations_end_time) : formatDayTime(data.reservations_end_time) }}</span>
          </div>
          <div class="reservation_status__box_button">
            <button @click="handleRedirectHistoryDetail(data)">
              {{ t('rental_history.btn_detailed') }}
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
    
    <ErrorModal v-if="isShowModalError" @closeModalError="isShowModalError = false" :resError="errorValidateGetHis" :buttonCancel="buttonCancel" />
  </div>
</template>
