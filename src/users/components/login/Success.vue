<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCommonStore } from '~/common/store/CommonStore';
import { useDownloadStore } from '~/users/stores/download';

const { isMobile } = storeToRefs(useCommonStore());
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const { t } = useI18n();
</script>
<template>
	<section class="form">
		<div class="form__title" :class="{ mgtop_download: checkShowDownLoadUqey && isMobile }">
			<h1 class="form__title__center title_resetpw">{{ t('user.reset_password') }}</h1>
		</div>
		<form>
			<p>{{ t('user.set_new_password') }}</p>
			<router-link to="/login" class="button">{{ t('user.go_login_screen') }}</router-link>
		</form>
	</section>
</template>
<style scoped lang="scss">
.mgtop_download {
	margin-top: 6rem;
}
.title_resetpw {
	@media screen and (max-width: 480px) {
		margin-top: 14px;
	}
}
</style>
