<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { numberWithCommas } from '~/common/utils/common';
import { scrollEle } from '~/common/utils/vScroll';
import { useBookingStore } from '../stores/booking';

const { t } = useI18n();

const bookingStore = useBookingStore();
const { checkPickup, text_notify_user, text_problem_user, boardingPlace } = storeToRefs(useBookingStore());
</script>
<template>
	<div  v-if="text_notify_user && checkPickup" class="text_user text_notify">
		<h4 class="title__notify">{{ boardingPlace?.pick_up_title }}</h4>
		<p>{{ text_notify_user }}</p>
	</div>
	<div v-if="text_problem_user.replaceAll(' ','')" class="text_user text_problem">
		<h4 class="title__notify">お店に伝えたい事項</h4>
		<p v-html="text_problem_user.split('\n').join('<br/>') "></p>
	</div>
</template>
<style scoped lang="scss">
.text_user {
	width: 100%;
    word-break: break-all;
	.title__notify {
		font-size: 14px;
		margin: 0;
		font-weight: 600;
	}
	p {
		margin-left: 10px;
		margin: 10px 0;
		color: #9d9da1;
		font-size: 16px;
	}
}
</style>
