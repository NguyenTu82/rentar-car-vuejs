<script setup lang="ts">
import { isCurrentDate, isSameDate } from '~/common/utils/checker';
import { separateDate, toFormattedDateTime } from '~/common/utils/formatter';
import { formatDayTime } from '~/common/utils/common';
import { STRING } from '~/common/utils/constant'

const { dateRange, modelValue, dateTimeBoarding } = defineProps<{ dateRange: Date[]; modelValue: Date | null, dateTimeBoarding: String | null }>();

interface DateTimeGroup {
	date: Date;
	time: Date[];
}

const { t } = useI18n()
const isOpen = ref(false);
const picker = ref<HTMLDivElement | null>(null);
const emit = defineEmits(['update:modelValue']);

const localDateSelected = ref<Date | null>(null);

const localDateRange = computed(() => {
	return dateRange.reduce((result, date) => {
		const resultLength = result.length;

		if (resultLength === 0) {
			return [{ date, time: [date] }];
		}

		const lastItem = result[resultLength - 1];
		if (isSameDate(lastItem.date, date)) {
			lastItem.time.push(date);
			return result;
		}

		return [...result, { date, time: [date] }];
	}, [] as DateTimeGroup[]);
});

const localTimeRange = computed(() => {
	if (localDateSelected.value) {
		const index = localDateRange.value.findIndex((dateRange) => {
			return dateRange.time.includes(localDateSelected.value as Date);
		});

		if (index !== -1) {
			return localDateRange.value[index];
		}
	}
	return localDateRange.value[0] || {};
});

watch(
	localDateRange,
	() => {
		localDateSelected.value = localDateRange.value[0]?.date;
	},{
		immediate:true
	}
);

const onClose = () => {
	isOpen.value = false;
};

const toggle = () => {
	isOpen.value = !isOpen.value;
};

const setLocalDateSelected = (date: Date) => {
	localDateSelected.value = date;
};

const onSelect = (date: Date) => {
	emit('update:modelValue', date);
	toggle();
};

const onClear = () => {
	emit('update:modelValue', null);
};

onClickOutside(picker, onClose);
</script>

<template>
	<div ref="picker" class="booking-time-picker dropdown">
		<div class="time-placeholder" @click="toggle">
			<div class="icon ms-3"><bx:calendar /></div>
			<template v-if="modelValue">
				<p class="m-0 text-center">{{ formatDayTime(modelValue) }}</p>
				<span class="btn-clear" @click.stop="onClear"><carbon:close /></span>
			</template>
		</div>
		<div v-if="isOpen" class="dropdown-menu">
			<p class="dropdown-menu-title">{{ dateTimeBoarding === STRING.START ? t('search.ride_time') : t('search.return_time') }}</p>
			<div class="items">
				<div class="dates">
					<div
						v-for="date in localDateRange"
						:key="`date-${date.date.getTime()}`"
						class="dropdown-item text-start"
						:class="{ active: date.date.getTime() === localDateSelected?.getTime() }"
						@click="setLocalDateSelected(date.date)"
					>
						{{ isCurrentDate(date.date) ? '今日' : separateDate(date.date)[0] }}
					</div>
				</div>
				<div class="times">
					<div
						v-for="time in localTimeRange.time"
						:key="`time-${time.getTime()}`"
						class="dropdown-item text-end"
						@click="onSelect(time)"
					>
						{{ separateDate(time)[1] }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.booking-time-picker {
	.time-placeholder {
		padding: 6px;
		max-height: 40px;
		min-height: 40px;
		font-weight: 400;
		display: flex;
		align-items: center;
		border: 1px solid #bfbfbf;
		border-radius: 999px;
		cursor: pointer;

		.icon {
			width: 20px;
			height: 20px;
			display: flex;
			justify-content: center;
			align-items: center;

			svg {
				padding: 0;
			}
		}

		p {
			flex: 1;
		}

		.btn-clear {
			width: 20px;
			height: 20px;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;

			svg {
				padding: 0;
			}
		}
	}

	.dropdown-menu {
		display: block;
		min-width: 200px;
		margin-top: 4px;
		padding: 20px 10px;
		border: 1px solid #8b8b8b;
		border-radius: 10px;
		border-radius: 20px;

		&-title {
			color: #0038ff;
		}

		.items {
			display: flex;

			> * {
				flex: 1;
				max-height: 400px;
				overflow: auto;

				.dropdown-item {
					cursor: pointer;
				}
			}
		}
	}
}
</style>
