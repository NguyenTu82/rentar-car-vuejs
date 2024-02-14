<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserInfoStore } from '~/account/stores/UserInfoStore';
import { useCommonStore } from '~/common/store/CommonStore';
import { TAB_ACCOUNT } from '~/common/utils/constant';
import { scrollEle } from '~/common/utils/vScroll';
import { useDownloadStore } from '~/users/stores/download';
const { isMobile } = storeToRefs(useCommonStore());

const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const userInfoStore = useUserInfoStore();
const { t } = useI18n();
const { selectedOptionLeaveGuild, listProblem, reasonLeaving, reasonLeavingRankMax } = storeToRefs(userInfoStore);
userInfoStore.setTabAccount(TAB_ACCOUNT.FIRST);
const isShowWithdrawModal = ref(false);
const router = useRouter();
const checkChoiceReasonRankMax = ref(false);
onUnmounted(() => {
	userInfoStore.resetDataProblem();
});
const backScreen = () => {
	router.push({
		path: '/account/member-information',
	});
};
watch(selectedOptionLeaveGuild, (newvalue) => {
	console.log('newvalue', newvalue);
	checkChoiceReasonRankMax.value = newvalue.includes(reasonLeavingRankMax.value.reasons);
	console.log('reasonLeavingRankMax', newvalue.includes(reasonLeavingRankMax.value.reasons));
});
onMounted(() => {
	if (selectedOptionLeaveGuild) {
		scrollEle('#scroll__leave');
	} else {
		const timeOut = setTimeout(() => {
			scrollEle('#scroll__leave');
			clearTimeout(timeOut);
		}, 1000);
	}
});
</script>
<template>
	<div class="acc_wrapper" id="scroll__leave" :class="{ acc_wrapper__mgtop: checkShowDownLoadUqey && isMobile }">
		<div class="acc_wrapper__max_width">
			<section v-if="!isMobile" class="acc_detail_left">
				<TabMenuAccount />
			</section>
			<section class="acc_detail_right">
				<div class="problem_leave_guild">
					<h2 class="title_problem">退会理由を選択して下さい</h2>
					<div class="select-form">
						<div v-for="(prb, index) in listProblem" :key="index" class="listProblem_User">
							<input
								:id="prb.reasons"
								type="checkbox"
								:value="prb.reasons"
								class="m-1 form-check-input"
								v-model="selectedOptionLeaveGuild"
							/>
							<label :for="prb.reasons">
								{{ prb.reasons }}
							</label>
						</div>
					</div>
				</div>
				<textarea
					class="input_reason_for_leaving"
					rows="6"
					maxlength="500"
					placeholder="入力は任意です"
					v-model="reasonLeaving"
				>
				</textarea>
				<div class="action_button">
					<button class="btn_back" @click="backScreen">{{ t('button.cancel') }}</button>
					<button
						class="btn_withdrawl"
						:disabled="selectedOptionLeaveGuild.length < 1"
						@click="isShowWithdrawModal = true"
					>
						{{ t('user_infor.withdrawal') }}
					</button>
				</div>
			</section>
		</div>
		<div class="acc_wrapper__max_width">
			<Footer />
		</div>
	</div>
	<WithdrawPopup v-if="isShowWithdrawModal" @close="isShowWithdrawModal = false" />
</template>
<style lang="scss" scoped>
.form-check-input {
	margin-left: 20px;
}
.action_button {
	margin: 20px 0;
}
.btn_withdrawl {
	width: 130px;
	height: 36.98px;
	padding: 1px 20px;
	font-size: 14px;
	color: #ffffff;
	background-color: #0c47a1;
	border-color: transparent;
	border-radius: 19px;
	margin-left: 50px;
}
.btn_withdrawl:disabled {
	opacity: 0.5;
}
.btn_back {
	border-color: transparent;
	border-radius: 19px;
	width: 130px;
	height: 36.98px;
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 24px;
}
.listProblem_User {
	display: grid;
	grid-template-columns: 20px 1fr;
	gap: 10px;
}
.input_reason_for_leaving {
	width: 50%;
	margin-left: 5px;
	border-bottom: 1px solid #c4c4c4;
	@media screen and (max-width: 480px) {
		width: 80%;
		margin-left: 16px;
	}
}
</style>
>
