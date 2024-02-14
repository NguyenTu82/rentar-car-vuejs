<script setup lang="ts" >
import { useReservationStore } from '~/account/stores/ReservationStore';
const reservationStore = useReservationStore();
  onMounted(async () => {
    await reservationStore.getListCancelReason();
  });
  onUnmounted(()=>{
    reservationStore.resetStateCancelbooking()
  })
</script>
<template>
  <ConfirmationDetail />
</template>
<route lang="yaml">
meta:
  layout: booking
</route>