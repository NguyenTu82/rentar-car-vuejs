<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '~/account/stores/UserInfoStore'

const { t } = useI18n()
const userInfoStore = useUserInfoStore()
const { checkUpdate, errorValidate } = storeToRefs(userInfoStore)
const { setCheckUpdate } = useUserInfoStore()

const emit = defineEmits(['updateAddress', 'updatePassword', 'updatePhone', 'closeCofirmUpdate', 'updateGender'])
const status = defineProps({
  statusChange: String,
	textEditAddress: Boolean
})
const modalContent = ref<HTMLDivElement | null>(null)
const isCheck = ref(false)
const isCheckGender = ref(false)

const onClose = () => {
	emit('closeCofirmUpdate');
	setCheckUpdate(false);
};

const onSubmit = async () => {
  switch (status.statusChange) {
    case 'updateAddress':
      emit('updateAddress')
      break;

    case 'updatePassword':
      emit('updatePassword')
      break;

    case 'updatePhone':
      emit('updatePhone')
      break;

		case 'updateGender':
			isCheckGender.value = true
      emit('updateGender')
      break;
  
    default:
      break;
  }
  const timeOut = setTimeout(() => {
    isCheck.value = true
    clearTimeout(timeOut)
  }, 1000)
}

const onSuccess = async () => {
	isCheckGender.value = false
  emit('closeCofirmUpdate')
}

onClickOutside(modalContent, () => onClose())
</script>
<template>
  <div class="custom-modal">
		<div class="overlay"></div>
		<div ref="modalContent" class="custom-modal-body">
			<template v-if="!isCheck">
				<div class="custom-modal-content">
					<p>{{ status.textEditAddress }}</p>
				</div>

				<div class="custom-modal-actions">
					<button class="custom-modal-btn custom-modal-close" @click="onClose">{{ t("user_infor.return") }}</button>
					<button class="custom-modal-btn custom-modal-confirm" @click="onSubmit">{{ t("user_infor.change") }}</button>
				</div>
			</template>
			<template v-else-if="checkUpdate === true">
				<div class="custom-modal-content">
					<p>{{ isCheckGender ? t("user_infor.update_completed2") : t("user_infor.update_completed") }}</p>
				</div>

				<div class="custom-modal-actions">
					<button class="custom-modal-btn custom-modal-confirm" @click="onSuccess">{{ t("user_infor.confirmation") }}</button>
				</div>
			</template>
			<template v-else>
				<div class="custom-modal-content">
					<p>{{ errorValidate }}</p>
				</div>

				<div class="custom-modal-actions">
					<button class="custom-modal-btn custom-modal-confirm" @click="onClose">{{ t("user_infor.confirmation") }}</button>
				</div>
			</template>
		</div>
	</div>
</template>