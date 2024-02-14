<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Insurance from '~/booking/components/insurance.vue';
import { useBookingStore } from '~/booking/stores/booking';
import { useCommonStore } from '~/common/store/CommonStore';
import { useDownloadStore } from '~/users/stores/download';

const { isMobile } = storeToRefs(useCommonStore());
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());

const route = useRoute();
const { fetchVehicleDetail } = useBookingStore();

watch(
	() => route.params.id,
	(newValue) => fetchVehicleDetail(newValue as string),
	{ immediate: true },
);
</script>

<template>
	<section class="dashboard">
		<div class="page" :class="{ mg_top__info: checkShowDownLoadUqey && isMobile }">
			<CarBasicInfo />
			<Insurance />
		</div>
	</section>
</template>

<route lang="yaml">
 meta:
  layout: booking
</route>