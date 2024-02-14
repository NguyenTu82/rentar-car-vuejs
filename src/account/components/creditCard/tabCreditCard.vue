<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useCreditInfoStore } from '~/account/stores/CreditInfoStore'
import { AUTHEN } from '~/common/utils/constant'
import { getCardTypeByBrand } from '~/common/utils/common';
const { t } = useI18n()
const buttonCancel  = ref(t("button.ok"))
const creditInforStore = useCreditInfoStore()
const { creditInfo, errorValidateGetCredit } = storeToRefs(creditInforStore)
const dataCreditInfo = computed(() => {
	return creditInfo.value.data || '';
})
const isShowCreditModal = ref(false);

const  checkCreditInfo = computed(() =>{
  if(creditInfo.value.data == null){
    return 0
  }
  else{
    return creditInfo.value.data.length
  }
})
const displayContent: Ref<any> = ref(false)
const checkCreate: Ref<any> = ref(true)
const brandCard: Ref<any> = ref('')
const idCredit = ref('')
const isShowModalError  = ref(false)

// const convert = (credit : any) => {
//   let encoded = ''
//   switch (credit?.length) {
//     case 14:
//       encoded = '***********'
//       return encoded + credit.slice(11);

//     case 15:
//       encoded = '************'
//       return encoded + credit.slice(12);

//     case 16:
//       encoded = '*************'
//       return encoded + credit.slice(13);

//     default:
//       encoded = '*************'
//       return encoded + credit.slice(13);
//   }
// }

onMounted(() => {
  creditInforStore.getCreditInfo()
})

watch(creditInforStore, () => {
  displayContent.value = true
},{deep:true})

watch( errorValidateGetCredit, () => {
  if (errorValidateGetCredit.value !== AUTHEN.MESSAGE) {
    isShowModalError.value = true
  }
})

const onClickAdd = () => {
  checkCreate.value = false
}

const handleBack = () => {
  checkCreate.value = true
}

const onClickDelete = async (id : string) => {
  idCredit.value = id
  isShowCreditModal.value = true
  
}


</script>

<template>
  <div v-if="checkCreate" class="tab_wrapper_reservation_status">
    <div class="reservation_status__title">
      {{ t('credit_card.title') }}
    </div>

    <div class="credit_card__box">
      <div class="credit_card__title">
        <span>{{ t('credit_card.registered') }}</span>
        <button v-if="checkCreditInfo < 5" @click="onClickAdd">
          {{ t('credit_card.btn_add_card') }}
        </button>
      </div>
      <template v-if="dataCreditInfo" >
        <div v-for="data in dataCreditInfo" :key="data.id" class="credit_card__infor">
          <div class="credit_card__image">
            <img
              v-if="getCardTypeByBrand" :key="getCardTypeByBrand"
              class="credit_card__img" 
              :class="{undf_imgcard : data?.brand == 'UNDF'}"
              :src="`/icons/card/${getCardTypeByBrand(data?.brand)}.png`" alt=""
            >
            <!-- <img
              v-if="getCardTypeByBrand" :key="getCardTypeByBrand"
              :src="`/icons/card/${getCardTypeByBrand(data?.brand)}.png`" alt=""
              :class="[data.brand== "UNDF" ? undf_imgcard : '', credit_card__img]"
            > -->
          </div>
          <input id="cardNumber" :value="data?.card_number" class="form-control credit_card__input" readonly placeholder="************0001">
          <img 
            @click="onClickDelete(data.id)"
            class="credit_card__delete" 
            src="/icons/icon_delete.svg"
            alt="">
        </div>
      </template>

      <template v-if="dataCreditInfo.length===0">
        <div v-if="displayContent" class="not-found">
          {{ t('not-found') }}
        </div>
      </template>
    </div>
  </div>
  <div v-else class="tab_wrapper_reservation_status">
    <AddCreateCard @backInPage="handleBack" />
  </div>
  <DeleteCreditModal 
    v-if="isShowCreditModal"
    :idCredit="idCredit" 
    @closeCreditModal="isShowCreditModal = false" 
  />

  <ErrorModal v-if="isShowModalError" @closeModalError="isShowModalError = false" :resError="errorValidateGetCredit" :buttonCancel="buttonCancel" />
</template>
<style>
  .undf_imgcard{
    border-radius: 50% !important;
    width: 25px !important;
    height: 25px !important;
    left: 30% !important;
    top: 32% !important;
  }
</style>
