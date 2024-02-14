<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import { validate } from 'class-validator';
import { storeToRefs } from 'pinia';
import { STATUS } from '~/common/dtos/base-output.dto';
import { useCommonStore } from '~/common/store/CommonStore';
import { checkPasteKatakanaFullWidth, getMaxBirthday } from '~/common/utils/common';
import { NUMBER } from '~/common/utils/constant';
import { UserRegisterInput } from '~/users/dtos/user-register-input.dto';
import { useDownloadStore } from '~/users/stores/download';
import { useUserCreateStore } from '~/users/stores/userCreate';

const { isMobile } = storeToRefs(useCommonStore());
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const { t } = useI18n();
const userCreateStore = useUserCreateStore();
const { data,checkSendCode } = storeToRefs(useUserCreateStore());

const userRegisterInput = ref<UserRegisterInput>(new UserRegisterInput());
const firstnamekana = ref('');
const lastnamekana = ref('');
const errorBirtday = ref('');
const selectGender = ref<any>(NUMBER.FIRST);

const hasError = computedAsync(async () => {
	const errors = await validate(userRegisterInput.value);
	return errors.length > 0;
});

const birthdayClassnames = computed(() => {
	const classes = ['form-control', 'register_input'];
	if (errorMessage.value.length > 0) {
		classes.push('border-danger');
	}

	return classes.join(' ');
});

function sendSMSCode() {
	checkSendCode.value = true;
	if (new Date(userRegisterInput.value?.birthday).getTime() > new Date(getMaxBirthday()).getTime()) {
		errorBirtday.value = t('validate.birtday');
		checkSendCode.value = false;
	} else {
		userCreateStore.sendSMSCode(userRegisterInput.value);
	}
}
const errorMessage = computed(() => {
	return data.value.status === STATUS.ERROR && data.value.message.length > 0 ? data.value.message : '';
});

watch(
	userRegisterInput,
	() => {
		nextTick(() => {
			userRegisterInput.value.first_name_kana = firstnamekana.value;
			userRegisterInput.value.last_name_kana = lastnamekana.value;
			userRegisterInput.value.phone = userRegisterInput.value.phone.replace(/\D/g, '');
			userRegisterInput.value.gender = selectGender.value;
		});
	},
	{ deep: true },
);

watch(firstnamekana, (newValue: string) => {
	nextTick(() => {
		firstnamekana.value = checkPasteKatakanaFullWidth(newValue);
		userRegisterInput.value.first_name_kana = firstnamekana.value;
	});
});

watch(lastnamekana, (newValue: string) => {
	nextTick(() => {
		lastnamekana.value = checkPasteKatakanaFullWidth(newValue);
		userRegisterInput.value.last_name_kana = lastnamekana.value;
	});
});

watch(selectGender, (newValue: number) => {
	nextTick(() => {
		userRegisterInput.value.gender = newValue;
	});
});

const handleTextInput = (text: string) => {
	switch (text) {
		case 'firstnamekana':
			firstnamekana.value = checkPasteKatakanaFullWidth(firstnamekana.value);
			break;
		case 'lastnamekana':
			lastnamekana.value = checkPasteKatakanaFullWidth(lastnamekana.value);
			break;
		default:
			break;
	}
};
const checkErrorOnEnter = (e: Event) => {
	if (hasError.value) {
		e.preventDefault();
	}
};

const chaneBirth = () => {
	errorBirtday.value = '';
};
</script>
<template>
	<section class="form">
		<div class="form__title" :class="{ mgtop_download: checkShowDownLoadUqey && isMobile }">
			<h1>{{ t('user.information_registration') }}</h1>
		</div>
		<form method="post">
			<div class="row">
				<div class="col form__group">
					<label for="lastname">{{ t('user.firstname') }} <span class="text-danger">*</span></label>
					<input
						id="lastname"
						v-model="userRegisterInput.last_name"
						class="form-control register_input"
						:class="{ 'border-danger': errorMessage.length > 0 }"
						type="text"
						name="lastname"
						maxlength="20"
						outline="none active:none"
						@keypress.enter="checkErrorOnEnter"
					/>
				</div>
				<div class="col form__group">
					<label for="firstname">{{ t('user.lastname') }} <span class="text-danger">*</span></label>
					<input
						id="firstname"
						v-model="userRegisterInput.first_name"
						class="form-control register_input"
						:class="{ 'border-danger': errorMessage.length > 0 }"
						type="text"
						name="firstname"
						maxlength="20"
						outline="none active:none"
						@keypress.enter="checkErrorOnEnter"
					/>
				</div>
			</div>
			<div class="row">
				<div class="col form__group">
					<label for="lastnamekana">{{ t('user.firstnamekana') }} <span class="text-danger">*</span></label>
					<input
						id="lastnamekana"
						v-model="lastnamekana"
						@keydown="handleTextInput('lastnamekana')"
						class="form-control register_input"
						:class="{ 'border-danger': errorMessage.length > 0 }"
						type="text"
						name="lastnamekana"
						maxlength="20"
						outline="none active:none"
						@keypress.enter="checkErrorOnEnter"
					/>
				</div>
				<div class="col form__group">
					<label for="firstnamekana">{{ t('user.lastnamekana') }} <span class="text-danger">*</span></label>
					<input
						id="firstnamekana"
						v-model="firstnamekana"
						@keydown="handleTextInput('firstnamekana')"
						class="form-control register_input"
						:class="{ 'border-danger': errorMessage.length > 0 }"
						type="text"
						name="firstnamekana"
						maxlength="20"
						outline="none active:none"
						@keypress.enter="checkErrorOnEnter"
					/>
				</div>
			</div>
			<div class="form__group">
				<label for="phonenumber">{{ t('user.phone_number') }} <span class="text-danger">*</span></label>
				<input
					id="phonenumber"
					v-model="userRegisterInput.phone"
					class="form-control register_input"
					:class="{ 'border-danger': errorMessage.length > 0 }"
					type="text"
					name="phonenumber"
					maxlength="11"
					outline="none active:none"
					@keypress.enter="checkErrorOnEnter"
				/>
			</div>
			<div class="form__group">
				<label for="birthday">{{ t('user.date_of_birth') }} <span class="text-danger">*</span></label>
				<Datepicker
					id="birthday"
					v-model="userRegisterInput.birthday"
					:inputClassName="birthdayClassnames"
					:enableTimePicker="false"
					locale="ja-jp"
					:class="{ 'border-danger': errorBirtday }"
					@open="chaneBirth()"
					format="yyyy/MM/dd"
				>
					<template #input-icon>
						<div class="icon ms-3 calendar-info"><bx:calendar /></div>
					</template>
				</Datepicker>
			</div>
			<div v-if="errorBirtday" class="error__validate">{{ errorBirtday }}</div>

			<div class="form__group form__group--cus">
				<label class="create__gender--label gender__name--mar">{{ t('user_infor.gender') }}</label>
			</div>
			<div class="form__group form__group--cus">
				<div class="info_name_display">
					<div class="gender__radio">
						<label class="gender__radio--label">{{ t('user_infor.male') }}</label>
						<input
							type="radio"
							v-model="selectGender"
							:value="NUMBER.FIRST"
							:checked="selectGender === NUMBER.FIRST"
							class="gender__radio--input"
							name="gender"
							@keypress.enter="checkErrorOnEnter"
						/>
					</div>
					<div class="gender__radio">
						<label class="gender__radio--label">{{ t('user_infor.female') }}</label>
						<input
							type="radio"
							v-model="selectGender"
							:value="NUMBER.SECOND"
							:checked="selectGender === NUMBER.SECOND"
							class="gender__radio--input"
							name="gender"
							@keypress.enter="checkErrorOnEnter"
						/>
					</div>
					<div class="gender__radio">
						<label class="gender__radio--label">{{ t('user_infor.other') }}</label>
						<input
							type="radio"
							v-model="selectGender"
							:value="NUMBER.THIRST"
							:checked="selectGender === NUMBER.THIRST"
							class="gender__radio--input"
							name="gender"
							@keypress.enter="checkErrorOnEnter"
						/>
					</div>
				</div>
			</div>

			<div v-if="errorMessage.length > 0" class="alert alert-danger mt-2 error-message" role="alert">
				{{ t('user.login_error') }} {{ errorMessage }}
			</div>
			<button
				class="btn button mt-3"
				:class="{
					disabled: hasError || userRegisterInput.first_name.trim() === '' || userRegisterInput.last_name.trim() === '',
				}"
				:disabled="checkSendCode"
				@click.prevent="sendSMSCode"
				@keypress.enter="checkErrorOnEnter"
			>
				次へ
			</button>
		</form>
	</section>
</template>
<style scoped>
.calendar-info {
	color: black;
}
.mgtop_download {
	margin-top: 4rem;
}
</style>
