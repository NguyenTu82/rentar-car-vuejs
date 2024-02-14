<script setup lang="ts">
import BookingCreditCard from '~/booking/components/BookingCreditCard.vue';

</script>
<template>
  <section class="dashboard">
		<div class="page mg_top__info">
			<CarBasicInfo />
      <BookingCreditCard />
		</div>
	</section>
</template>
<route lang="yaml">
 meta:
  layout: booking
</route>