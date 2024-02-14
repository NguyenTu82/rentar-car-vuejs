<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInsuranceStore } from '../stores/insuranceStores';
import { numberWithCommas } from '~/common/utils/common';
import { scrollEle } from '~/common/utils/vScroll';
import { Insurance } from '../dtos/insurance.dto';
import { useBookingStore } from '../stores/booking';

const { t } = useI18n();
const insuranceStore = useInsuranceStore();
const { listInsurances, selected } = storeToRefs(useInsuranceStore());
const checkboxDisabled = ref(false);
const defaultInsuranceValue = ref<Insurance[]>([]);
const bookingStore = useBookingStore();
const { vehicleDetail } = storeToRefs(bookingStore);
const text = ref('aaaa        bbbb\r\n    cccc\r\ndddd');

onMounted(() => {
	if (!selected.value) {
		// insuranceStore.selectInsurance([listInsurances.value[0]]);
	}
	if (listInsurances) {
		scrollEle('#scroll__isurance');
	} else {
		const timeOut = setTimeout(() => {
			scrollEle('#scroll__isurance');
			clearTimeout(timeOut);
		}, 1000);
	}

	defaultInsuranceValue.value = selected.value;
});
const selectedUser = computed(() => {
	return selected.value.find((item) => item.required == 2);
});
// console.log('text', text.value?.split('\r\n').join('<br/>'));

// watch(selected, () => {
//     checkboxDisabled.value = !checkboxDisabled.value
// })
</script>
<template>
	<div class="option-insurence">
		<h4>{{ t('booking.choose_insurance') }}</h4>
		<p>{{ t('booking.can_one_choose_insurance') }}</p>
		<div class="select-form">
			<div
				v-for="(insur, index) in listInsurances"
				:key="index"
				class="custom-option"
				:class="{
					'choice-checkbox': insur.required == 1,
					'disable-choice-checkbox': selectedUser && selectedUser.id != insur.id,
				}"
			>
				<template v-if="insur.required == 1" :for="insur.id">
					<input
						:id="insur.id"
						type="checkbox"
						:value="insur"
						name="insurance"
						class="m-3 form-check-input"
						checked
						disabled
					/>
					<div class="info_insurance">
						<div class="meta">
							<h4>{{ insur.name }}</h4>
							<p v-html="insur.description?.split('\r\n').join('<br/>')" class="description des__pre"></p>
						</div>
					</div>
					<div class="calc_day" v-if="insur.calc_day > 0">x {{ insur.calc_day }}日分</div>
					<div class="price">{{ numberWithCommas(insur.price_latest) }} 円</div>
				</template>
				<template v-else :for="insur.id">
					<input
						:id="insur.id"
						type="checkbox"
						:value="insur"
						name="insurance"
						class="m-3 form-check-input"
						:disabled="selectedUser && selectedUser.id != insur.id"
						v-model="selected"
					/>
					<div class="info_insurance">
						<div class="meta">
							<h4>{{ insur.name }}</h4>
							<p v-html="insur.description?.split('\r\n').join('<br/>')" class="description des__pre"></p>
						</div>
					</div>
					<div class="calc_day" v-if="insur.calc_day > 0">x {{ insur.calc_day }}日分</div>
					<div class="price">{{ numberWithCommas(insur.price_latest) }} 円</div>
				</template>
			</div>
		</div>
		<div id="scroll__isurance"></div>
	</div>
</template>
<style scoped>
.des__pre {
	white-space: break-spaces;
}
.choice-checkbox {
	background-color: #ececec;
}
.disable-choice-checkbox {
	background-color: #a8a8a8;
}
/* input[type="checkbox"]:disabled{
	background-color: #173ab8;
	color:#173ab8;

} */
.form-check-input:checked {
	background-color: #173ab8;
}
.form-check-input:disabled {
	opacity: 1;
}
</style>
