<script setup>
const { t } = useI18n();
import { isIOS } from 'mobile-device-detect';
import { storeToRefs } from 'pinia';
import { useDownloadStore } from '~/users/stores/download';
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
import { setLocalStorage } from '~/common/utils/localStorage';

const url = isIOS
	? 'https://apps.apple.com/jp/app/uqey/id6444780033'
	: 'https://play.google.com/store/apps/details?id=jp.co.tokai_rika.uqey';

const turnoffDownload = () => {
	checkShowDownLoadUqey.value = false;
	setLocalStorage('checkShowDownLoadUqey', 'true');
	// document.cookie = "checkShowDownLoadUqey=true"
};
</script>
<template>
	<div :class="{ download_Uquey: checkShowDownLoadUqey, downloadoff: checkShowDownLoadUqey === false }">
		<div class="download">
			<div class="download_info">
				<div @click="turnoffDownload" class="delete_download">×</div>
				<img class="img_logo_uqey" src="/images/1024.png" alt="" data-v-7134dfa9="" />
				<div class="download_name">{{ t('home.name_uqey') }}</div>
			</div>
			<a :href="url">{{ t('home.install') }}</a>
		</div>
	</div>
</template>
<style scoped>
.download_Uquey {
	margin-left: -15px;
	border-bottom: 1px solid #c4c4c4;
}
.download {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 10px;
	background-color: white;
	padding-left: 15px;
	padding-bottom: 10px;
}
.downloadoff {
	display: none;
}
.download_info {
	display: flex;
	align-items: center;
}
.img_logo_uqey {
	margin: 0 10px;
}
.delete_download {
	font-size: 16px;
	color: #7d7d82;
}
.download_name {
	font-size: 16px;
}
.download a {
	padding: 3px 25px;
	background-color: #173ab8;
	color: white;
	border-radius: 20px;
	font-size: 13px;
	margin-right: 35px;
}
.download img {
	border-radius: 10px;
	height: 60px;
}
</style>
