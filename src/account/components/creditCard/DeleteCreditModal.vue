<script setup lang="ts">
import { defineEmits  } from 'vue'
import { storeToRefs } from 'pinia';
import { useCreditInfoStore } from '~/account/stores/CreditInfoStore'

const { t } = useI18n()
const creditInfoStore = useCreditInfoStore()
const { checkSuccess, errorValidate } = storeToRefs(creditInfoStore)
const { handleDelete, setCheckCredit } = useCreditInfoStore()
const creditInforStore = useCreditInfoStore()
const emit = defineEmits(['closeCreditModal'])
const clickButton  = ref(true)

const id = defineProps({
  idCredit: String
})
const modalContent = ref<HTMLDivElement | null>(null)
const isCredit = ref(false)

const onClose = () => {
	emit('closeCreditModal');
	setCheckCredit(false);
};

const onSubmit = async () => {
	if (clickButton.value) {
		clickButton.value = false
		let data = {
			user_payment_id : id.idCredit
		}
		const checkResult = await handleDelete(data)
		if(checkSuccess ){
			creditInforStore.getCreditInfo()
		}
		isCredit.value = true
		clickButton.value = true
	}
}

const onSuccess = async () => {
  creditInforStore.resetStateCard()
  emit('closeCreditModal');
}

onClickOutside(modalContent, () => onClose())
</script>
<template>
  <div class="custom-modal">
		<div class="overlay"></div>
		<div ref="modalContent" class="custom-modal-body">
			<template v-if="!isCredit">
				<div class="custom-modal-content">
					<p>{{ t('credit_card.remove_credit_card') }}</p>
				</div>

				<div class="custom-modal-actions">
					<button class="custom-modal-btn custom-modal-close" @click="onClose">{{ t('button.cancel') }}</button>
					<button class="custom-modal-btn custom-modal-confirm" @click="onSubmit">{{ t('button.delete') }}</button>
				</div>
			</template>
			<template v-else-if="checkSuccess === true">
				<div class="custom-modal-content">
					<p>{{ t('credit_card.credit_card_deleted') }}</p>
				</div>

				<div class="custom-modal-actions">
					<button class="custom-modal-btn custom-modal-confirm" @click="onSuccess">{{ t('button.ok') }}</button>
				</div>
			</template>
			<template v-else>
				<div class="custom-modal-content">
					<p>{{ errorValidate }}</p>
				</div>

				<div class="custom-modal-actions">
					<button class="custom-modal-btn custom-modal-confirm" @click="onClose">{{ t('button.ok') }}</button>
				</div>
			</template>
		</div>
	</div>
</template>
