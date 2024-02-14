<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { numberWithCommas } from '~/common/utils/common';
import { scrollEle } from '~/common/utils/vScroll';
import { useBookingStore } from '../stores/booking';

const { t } = useI18n();

const bookingStore = useBookingStore();
const { listOptions, selectedOption, numberOption } = storeToRefs(useBookingStore());
const numberOption1 = ref<any>({});

// watch(listOptions,(newValue)=>{
// 	numberOption.value = newValue.reduce((result, item) => {
// 		result[item.id] = '1'
// 		return result
// 	}, {} as any)
// }, { immediate:true})
watch(
	selectedOption,
	(newValue) => {
		numberOption1.value = newValue.reduce((result, item) => {
			if (!result[item.id]) {
				result[item.id] = '1';
			}
			bookingStore.selectNumberOptions(result);
			return result;
		}, numberOption1.value as any);
		listOptions.value.map((x) => {
			if (!selectedOption.value.includes(x)) {
				numberOption1.value[x.id] = '';
			}
		});
	},
	{ immediate: true },
);
// watch(numberOption,(newValue)=>{
// 	console.log('newValue',newValue);

// })

onMounted(() => {
	if (selectedOption.value.length === 0) {
		// bookingStore.selectOptions([listOptions.value[0]]);
	}
	if (listOptions) {
		scrollEle('#scroll__isurance');
	} else {
		const timeOut = setTimeout(() => {
			scrollEle('#scroll__isurance');
			clearTimeout(timeOut);
		}, 1000);
	}
});
const changeOptionInput = (item: any) => {
	if (!numberOption1.value[item.id]) {
		// selectedOption.value = [...selectedOption.value, item]
		// console.log(selectedOption.value)
		// numberOption1.value[item.id] = '1'
		// console.log(numberOption1.value)
	} else {
		// console.log(12312)
		// numberOption1.value[item.id] = ''
		// selectedOption.value = [...selectedOption.value.filter(x => x.id !== item.id)]
	}
};
</script>
<template>
	<div class="option-insurence">
		<h4>{{ t('booking.choose_option') }}</h4>
		<div class="select-form">
			<div v-for="(opt, index) in listOptions" :key="index" class="custom-option2">
				<input
					:id="opt.name"
					type="checkbox"
					:value="opt"
					name="insurance"
					class="m-3 form-check-input"
					v-model="selectedOption"
				/>
				<div class="info_insurance">
					<div class="meta">
						<h4>{{ opt.name }}</h4>
						<p v-html="opt.description?.split('\r\n').join('<br/>')" class="description des__pre"></p>
					</div>
				</div>
				<div class="price">{{ numberWithCommas(opt.price_latest) }} 円</div>
				<span class="core_text">x</span>
				<select :id="opt.name" v-model="numberOption1[opt.id]">
					<option disabled value=""></option>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>
				<span>個</span>
			</div>
		</div>
		<div id="scroll__isurance"></div>
	</div>
</template>
<style scoped lang="scss">
.custom-option2 {
	display: grid;
	grid-template-columns: 50px 1fr 50px 25px 50px 25px;
	width: 100%;
	align-items: center;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 25px;
	border: 1px solid #ccc;
	margin-bottom: 10px;

	select {
		height: 35px;
	}

	.meta {
		width: 100%;
	}
}
.des__pre {
	white-space: break-spaces;
}
select {
	margin-right: 5px;
	padding: 2px 3px;
	background: #ffffff;
	border: 1px solid #86868b;
	border-radius: 10px;
}
.core_text {
	margin: 0 10px;
}
.choice-checkbox {
	background-color: #ececec;
}

.meta {
	width: 80%;
}

@media screen and (max-width: 480px) {
	.form-check-input {
		width: 20px;
	}
}
</style>
