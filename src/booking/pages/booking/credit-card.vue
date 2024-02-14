<script setup lang="ts">
import BookingCreditCard from '~/booking/components/BookingCreditCard.vue';
const router = useRouter();
function handleConfirmation() {
  router.push({
    path: "/booking/select-credit-card",
    query: {},
  });
}
function handleRedirectReservation() {
  router.push({
    path: "/booking/reservation-confirmation",
    query: {},
  });
}
</script>
<template>
  <BookingCreditCard/>
</template>
<route lang="yaml">
 meta:
  layout: booking
</route>
