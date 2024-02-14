<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInsuranceStore } from '~/booking/stores/insuranceStores';
import { useBookingStore } from '~/booking/stores/booking';

const bookingStore = useBookingStore();
const { vehicleDetail } = storeToRefs(bookingStore);
const router = useRouter();
const route = useRoute();
const { fetchVehicleDetail } = useBookingStore();

const checkedNames = ref('');
const insuranceStore = useInsuranceStore();
const { listInsurances, selected } = storeToRefs(useInsuranceStore());


watch(
	() => route.params.id,
	(newValue) => fetchVehicleDetail(newValue as string),
	{ immediate: true },
);
</script>

<template>
	<section class="dashboard">
		<div class="page">
			<CarBasicInfo />
			<OptionMoreBooking  />		
		</div>
	</section>
</template>
<route lang="yaml">
meta:
  layout: booking
</route>