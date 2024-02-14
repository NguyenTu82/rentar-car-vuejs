<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ReservationConfirmation from '~/booking/components/reservation-confirmation.vue';
import { useCommonStore } from '~/common/store/CommonStore';
import { useDownloadStore } from '~/users/stores/download';

const { isMobile } = storeToRefs(useCommonStore());
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
</script>

<template>
	<section class="dashboard">
		<div class="page" :class="{ mg_top__info: checkShowDownLoadUqey && isMobile }">
			<CarBasicInfo />
			<ReservationConfirmation />
		</div>
	</section>
</template>
<route lang="yaml">
 meta:
  layout: booking
</route>