<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '~/account/stores/UserInfoStore';
import { useCommonStore } from '~/common/store/CommonStore';
import { TAB_ACCOUNT } from '~/common/utils/constant';
import { useDownloadStore } from '~/users/stores/download';
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const userInfoStore = useUserInfoStore();
const { isMobile } = storeToRefs(useCommonStore());

userInfoStore.setTabAccount(TAB_ACCOUNT.FOUR);
</script>
<template>
	<div class="acc_wrapper" :class="{ mg_top__info: checkShowDownLoadUqey && isMobile }">
		<div class="acc_wrapper__max_width">
			<section v-if="!isMobile" class="acc_detail_left">
				<TabMenuAccount />
			</section>
			<section class="acc_detail_right">
				<TabCreditCard />
			</section>
		</div>
		<div class="acc_wrapper__max_width">
			<Footer />
		</div>
	</div>
</template>
<route lang="yaml">
meta:
  layout: account
</route>
