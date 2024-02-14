<!-- eslint-disable no-console -->
<!-- eslint-disable vue/no-parsing-error -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserInfoStore } from '~/account/stores/UserInfoStore'
import { TAB_ACCOUNT } from '~/common/utils/constant'

const { t } = useI18n()
const router = useRouter()
const userInfoStore = useUserInfoStore()
const { tabAccount } = storeToRefs(userInfoStore)

function backHomePage(){
    router.push('/')
  }
const handleClick = (val: any) => {
  userInfoStore.setTabAccount(val)
  switch (val) {
    case TAB_ACCOUNT.FIRST:
      router.push('/account/member-information')
      break
    case TAB_ACCOUNT.SECOND:
      router.push('/account/reservation-status')
      break
    case TAB_ACCOUNT.THIRST:
      router.push('/account/rental-history')
      break
    case TAB_ACCOUNT.FOUR:
      router.push('/account/credit-card')
      break

    default:
      break
  }
}
</script>

<template>
  <div class="tab_wrapper">
    <div class="tab_wrapper__left" />
    <div class="navbar-collapse tab_wrapper__right">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link menu__account"  @click="backHomePage">{{ t('user_infor.top') }}</a>
        </li>
        <li class="nav-item">
          <a class="nav-link menu__account" :class="{ menu_active: tabAccount === TAB_ACCOUNT.FIRST }" @click="handleClick(TAB_ACCOUNT.FIRST)">{{ t('user_infor.title') }}</a>
        </li>
        <li class="nav-item">
          <a class="nav-link menu__account" :class="{ menu_active: tabAccount === TAB_ACCOUNT.SECOND }" @click="handleClick(TAB_ACCOUNT.SECOND)">{{ t('user_infor.reservation_list') }}</a>
        </li>
        <li class="nav-item">
          <a class="nav-link menu__account" :class="{ menu_active: tabAccount === TAB_ACCOUNT.THIRST }" @click="handleClick(TAB_ACCOUNT.THIRST)">{{ t('user_infor.reservation_history') }}</a>
        </li>
        <li class="nav-item">
          <a class="nav-link menu__account" :class="{ menu_active: tabAccount === TAB_ACCOUNT.FOUR }" @click="handleClick(TAB_ACCOUNT.FOUR)">{{ t('user_infor.credit_card') }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dp__clear_icon {
  display: none;
}
</style>
