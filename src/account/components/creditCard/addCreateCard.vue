
<script setup lang="ts">
  import { log } from 'console';
import type { Ref } from 'vue'
  import { ref, watch, defineEmits  } from 'vue'
  import { storeToRefs } from 'pinia';
  import { useCreditInfoStore } from '~/account/stores/CreditInfoStore'
  import { checkPasteNumber, getCardType, insertSpace, insertStamp, onlyUnsignedChar } from '~/common/utils/common'
  import { isNumber } from '~/common/utils/common'
  import moment from 'moment'
import { NUMBER, STRING } from '~/common/utils/constant';
import CreditInfoService from '~/account/services/CreditInfoService'

const shopId = import.meta.env.VITE_GMO_SHOP_ID;

  const { t } = useI18n()
  const emit = defineEmits(['backInPage'])
  const buttonCancel  = ref(t("button.ok"))
  const creditInforStore = useCreditInfoStore()
  const { errorValidateAdd, successValidateAdd } = storeToRefs(creditInforStore)

  const numberCard = ref<any>('')
  const valNumberCard = ref('')
  const dateOfExpiry = ref('')
  const valDateOfExpiry = ref('')
  const securityCode = ref('')
  const valSecurityCode = ref('')
  const cardHolder = ref('')
  const valCardHolder = ref('')
  const keyInput = ref(true)
  const isShowModalError = ref(false)
  const clickButton  = ref(true)
  const isShowModalSuccess= ref(false)

  watch(errorValidateAdd, () => {
    if (errorValidateAdd.value != '') {
      isShowModalError.value = true
    }
  })

  const onClickAddCard = async (e: any) => {
    if (valDateOfExpiry.value) {
      return
    }
    if (clickButton.value) {
      clickButton.value = false
      const tmpNumberCard = numberCard.value.split(' ').join('')
      const tmpDateOfExpiry1 = dateOfExpiry.value.split(' / ').reverse().join('')
      
      doPurchase(tmpNumberCard, tmpDateOfExpiry1, securityCode.value, cardHolder.value)
    }
  }

  const keyupNumberCard = async (typeInput: any) => {
    const tmpNumberCard = numberCard.value.split(' ').join('')
    const tmpDateOfExpiry = dateOfExpiry.value.split(' / ').join('')
    const data: any = {
      card_number: tmpNumberCard,
      expired_date: tmpDateOfExpiry,
      security_number: securityCode.value,
      card_hoder_name: cardHolder.value,
    }

    const res = await creditInforStore.validateForm(data)

    switch (typeInput) {
      case 'numberCard':
        if (res?.errors) {
          valNumberCard.value = res?.errors?.card_number
        } else {
          valNumberCard.value = ''
        }
        break;
      case 'dateOfExpiry':
        if (res?.errors) {
          valDateOfExpiry.value = res?.errors?.expired_date
        } else {
          valDateOfExpiry.value = ''
        }
        break;
      case 'securityCode':
        if (res?.errors) {
          valSecurityCode.value = res?.errors?.security_number
        } else {
          valSecurityCode.value = ''
        }
        break;
      case 'cardHolder':
        if (res?.errors) {
          valCardHolder.value = res?.errors?.card_hoder_name
        } else {
          valCardHolder.value = ''
        }
        break;
    
      default:
        break;
    }
    
    if (tmpDateOfExpiry.substring(0,2) && (+tmpDateOfExpiry.substring(0,2) === 0 || +tmpDateOfExpiry.substring(0,2) > 12 
    || ( +tmpDateOfExpiry.substring(2,4) === (+moment().format('YY')) && (tmpDateOfExpiry.substring(0,2) < (moment().format('MM'))))) 
     ) {
      valDateOfExpiry.value = t('validate.credit_card.expired_date__err_month')
		}
		if (tmpDateOfExpiry.substring(2,4) && (+tmpDateOfExpiry.substring(2,4) < (+moment().format('YY')))) {
      valDateOfExpiry.value = t('validate.credit_card.expired_date__err_month')
    }
  }

  const onClickBack = () => {
    creditInforStore.resetError()
    emit('backInPage')
  }

  const onCloseSuccess = () => {
    creditInforStore.resetError()
    isShowModalSuccess.value = false
    emit('backInPage')
  }

  watch(cardHolder, (newValue: string) => {
    nextTick(() => {
      if (keyInput.value) {
        cardHolder.value = onlyUnsignedChar(newValue)
      }
    })
  })
  watch(()=>securityCode.value, (newValue: string) => {
    nextTick(() => {
      let newSecurityCode = checkPasteNumber(newValue)
      securityCode.value = newSecurityCode.toString().slice(0,4)
    })
  })

const handleTextInput = (e: any) => {
  if (e.key === 'Backspace') {
    keyInput.value = false
  } else {
    keyInput.value = true
  }
}

watch(numberCard, (newValue: string) => {
  nextTick(() => {
    numberCard.value = insertSpace(newValue)
  })
})
const processData = (e: any) => {
	numberCard.value = e.target.value;
	keyupNumberCard('numberCard')
}
const handleTextInputNumberCard = (e: any) => {
  if (e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'c' && e.key !== 'v' && e.key !== 'Control') {
    checkPasteNumber(e.key)
    isNumber(e)
  }
}

watch(dateOfExpiry, (newValue: string) => {
  nextTick(() => {
    let newDateOfExpiry = newValue.toString().slice(0,7)
    dateOfExpiry.value = insertStamp(newDateOfExpiry)
  })
})
const handleTextInputDateOfExpiry = (e: any) => {
  if (e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'c' && e.key !== 'v' && e.key !== 'Control') {
    checkPasteNumber(e.key)
    isNumber(e)
  }
}

const handleCloseText = (text: string) => {
  switch (text) {
    case 'numberCard':
      numberCard.value = ''
      keyupNumberCard('numberCard')
      break;
    case 'dateOfExpiry':
      dateOfExpiry.value = ''
      keyupNumberCard('dateOfExpiry')
      break;
    default:
      break;
  }
}

const doPurchase = (cardno: any, expire: any, securitycode: any, holdername: any) => {
  let tokennumber = NUMBER.FIRST
  Multipayment.init(shopId);
  Multipayment.getToken(
    {
      cardno,
      expire,
      securitycode,
      holdername,
      tokennumber,
    },
    async (response: any) => {
      if (response.resultCode == STRING.THREE_ZERO) {
        const {token} = response.tokenObject;
        const tmpNumberCard = numberCard.value.split(' ').join('')
        const tmpDateOfExpiry = dateOfExpiry.value.split(' / ').join('')
          
        const data: any = {
          card_number: tmpNumberCard,
          expired_date: tmpDateOfExpiry,
          security_number: securityCode.value,
          card_hoder_name: cardHolder.value,
          brand: getCardType(tmpNumberCard),
          token: token?.[0] || '',
        }
        
        const res: any = await creditInforStore.postAddCard(data)
        
        if(res?.status == 'Success'){
          creditInforStore.getCreditInfo()
          isShowModalSuccess.value = true
        }

        if (res?.errors) {
          valNumberCard.value = res?.errors?.card_number
          valDateOfExpiry.value = res?.errors?.expired_date
          valSecurityCode.value = res?.errors?.security_number
          valCardHolder.value = res?.errors?.card_hoder_name
        } else {
          valNumberCard.value = ''
          valDateOfExpiry.value = ''
          valSecurityCode.value = ''
          valCardHolder.value = ''
        }
        if (tmpDateOfExpiry.substring(0,2) && (+tmpDateOfExpiry.substring(0,2) === 0 || +tmpDateOfExpiry.substring(0,2) > 12 
        || ( +tmpDateOfExpiry.substring(2,4) === (+moment().format('YY')) && (tmpDateOfExpiry.substring(0,2) < (moment().format('MM')))))
        ) {
          valDateOfExpiry.value = t('validate.credit_card.expired_date__err_month')
        }
        if (tmpDateOfExpiry.substring(2,4) && (+tmpDateOfExpiry.substring(2,4) < (+moment().format('YY')))) {
          valDateOfExpiry.value = t('validate.credit_card.expired_date__err_month')
        }
        
        clickButton.value = true
      } else {
        let dataError = {error : [response.resultCode]}
        CreditInfoService.saveErrorTokenGmo(dataError)
        errorValidateAdd.value = t('validate.token')
        isShowModalError.value = true
      }
    }
  );
}
</script>

<template>
  <div class="box_add__create_card">
    <div class="box_add__create_card_title">
      {{ t('credit_card.add_new_card') }}
    </div>
    <div class="box_add__create_card_input">
      <div class="form__input_group">
        <label for="">{{ t('credit_card.number') }}</label>
        <div class="input-group__cus">
          <input
            v-model="numberCard"
            @keydown="handleTextInputNumberCard"
            @change="keyupNumberCard('numberCard')"            
            @blur="processData"
            type="text"
            name="numberCard"
            maxlength="19"
            class="form-control add_credit_card__input"
            :class="{'border-danger': valNumberCard}"
          >
          <template v-if="numberCard">
            <div @click="handleCloseText('numberCard')" type="button" class="close__cus" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </div>
          </template>
        </div>
        <div v-if="valNumberCard" class="error__validate">{{ valNumberCard }}</div>
      </div>

      <div class="row">
        <div class="col">
          <div class="form__input_group">
            <label for="">{{ t('credit_card.date_of_expiry') }}</label>
            <div class="input-group__cus">
              <input
                v-model="dateOfExpiry"
                @keydown="handleTextInputDateOfExpiry"
                @keyup="keyupNumberCard('dateOfExpiry')"
                type="text"
                placeholder="mm / yy"
                pattern="\d*" 
                maxlength="7"
                name="numberCard"
                class="form-control add_credit_card__input"
                :class="{'border-danger': valDateOfExpiry}"
              >
              <template v-if="dateOfExpiry">
                <div @click="handleCloseText('dateOfExpiry')" type="button" class="close__cus" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </div>
              </template>
            </div>
            <div v-if="valDateOfExpiry" class="error__validate">{{ valDateOfExpiry }}</div>
          </div>
        </div>
        <div class="col">
          <div class="form__input_group">
            <label for="">{{ t('credit_card.security_code') }}</label>
            <input
              v-model="securityCode"
              @keypress="isNumber($event)"
              @keyup="keyupNumberCard('securityCode')"
              type="text"
              maxlength="4"
              name="securityCode"
              class="form-control add_credit_card__input"
              :class="{'border-danger': valSecurityCode}"
            >
            <div v-if="valSecurityCode" class="error__validate">{{ valSecurityCode }}</div>
          </div>
        </div>
      </div>

      <div class="form__input_group">
        <label for="">{{ t('credit_card.card_holder') }}</label>
        <input
          v-model="cardHolder"
          @keypress="handleTextInput"
          @keyup="keyupNumberCard('cardHolder')"
          type="text"
          name="cardHolder"
          maxlength="50"
          class="form-control add_credit_card__input"
          :class="{'border-danger': valCardHolder}"
        >
        <div v-if="valCardHolder" class="error__validate">{{ valCardHolder }}</div>
      </div>
      
      <div class="row">
        <div class="col add_credit_card__btn">
          <button @click="onClickBack" class="credit_card__btn_cancel">
            {{ t('button.cancel') }}
          </button>
        </div>
        <div class="col add_credit_card__btn">
          <button @click="onClickAddCard" class="credit_card__btn_add">
            {{ t('button.addition') }}
          </button>
        </div>
      </div>
    </div>
    <ErrorModal v-if="isShowModalError" @closeModalError="isShowModalError = false" :resError="errorValidateAdd" :buttonCancel="buttonCancel" />
    <SuccessModalAdd v-if="isShowModalSuccess" @closeCreditSuccessModal="onCloseSuccess" :resSuccess="successValidateAdd"/>
  </div>
</template>
