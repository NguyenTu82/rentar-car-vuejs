<script setup lang="ts">
import { validate } from 'class-validator';
import { storeToRefs } from 'pinia';
import { STATUS } from '~/common/dtos/base-output.dto';
import { Policy } from '~/common/dtos/policy.dto';
import CommonService from '~/common/services/CommonService';
import { useCommonStore } from '~/common/store/CommonStore';
import { NUMBER } from '~/common/utils/constant';
import { scrollEle } from '~/common/utils/vScroll';
import { UserCreateInput } from '~/users/dtos/user-create-input.dto';
import { useDownloadStore } from '~/users/stores/download';
import { useUserCreateStore } from '~/users/stores/userCreate';

const { isMobile } = storeToRefs(useCommonStore());
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const POLICY_TITLE = '内容を理解し、同意しました。';

const router = useRouter();
const userCreateStore = useUserCreateStore();
const { data,checkSendCode } = storeToRefs(userCreateStore);

const input = ref<UserCreateInput>(new UserCreateInput());
const { t } = useI18n();

const policyCheckList = ref<{
	[key: string]: boolean;
}>({});
const policyList = ref<Array<Policy>>([]);
const currentPolicy = ref<Policy>(new Policy());
const currentPolicyContent = ref<any>('');
const checkScroll = ref<any>(false);
const isOpenPolicyModal = ref(false);
const infoBox = ref<HTMLDivElement | null>(null);

const openPolicyModal = (policy: Policy) => {
	isOpenPolicyModal.value = true;
	currentPolicy.value = policy;
	currentPolicyContent.value = policy.content?.split('\r\n').join('<br/>') || '';
	if (currentPolicy.value) {
		const timeOut = setTimeout(() => {
			scrollEle('#scroll__policy');
			clearTimeout(timeOut);
		}, 200);
	}
};

const closePolicyModal = () => {
	policyCheckList.value = {
		...policyCheckList.value,
		[currentPolicy.value.id]: true,
	};
	checkScroll.value = false;
	isOpenPolicyModal.value = false;
};

const closePolicy = () => {
	checkScroll.value = false;
	isOpenPolicyModal.value = false;
};

function onRegister(e: any) {
	checkSendCode.value = true;
	e.preventDefault();
	userCreateStore.createUser(input.value);
}

watch(input.value, () => {
	nextTick(() => {
		input.value.email = input.value.email
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D');
		input.value.password1 = input.value.password1.replace(/\s+/g, '');
		input.value.password2 = input.value.password2.replace(/\s+/g, '');
	});
});

onMounted(() => {
	CommonService.getPolicy().then((response) => {
		if (response.status === STATUS.SUCCESS) {
			policyList.value = response.data;
		}
	});
	data.value.message = '';
	checkSendCode.value = false;
});

watch(isOpenPolicyModal, () => {
	if (isOpenPolicyModal.value) {
		const timeOut = setTimeout(() => {
			const divInnerContentHeight: any = document.getElementById('rules')?.scrollHeight;
			if (infoBox.value?.clientHeight === divInnerContentHeight) {
				checkScroll.value = true;
			}

			clearTimeout(timeOut);
		}, 500);
	}
});

const inputHasError = asyncComputed(async () => {
	const errors = await validate(input.value);
	return errors.length > 0;
}, true);

const policyListHasError = asyncComputed(() => {
	const hasError = policyList.value.some((policy) => !policyCheckList.value[policy.id]);
	return hasError;
}, true);

const errorMessage = computed(() => {
	return data.value.status === STATUS.ERROR && data.value.message.length > 0 ? data.value.message : '';
});

function goLogin() {
	router.push('/login');
}

const onScroll = ({ target: { scrollTop, clientHeight, scrollHeight } }) => {
	if (scrollTop + clientHeight >= scrollHeight - NUMBER.FIRST) {
		checkScroll.value = true;
	} else {
		checkScroll.value = false;
	}
};
const checkErrorOnEnter = (e: Event) => {
	if (inputHasError.value || policyListHasError.value) {
		e.preventDefault();
	}
};
</script>
<template>
	<section class="form">
		<div class="form__title" :class="{ mgtop_download: checkShowDownLoadUqey && isMobile }">
			<h1>{{ t('user.login_register') }}</h1>
			<div class="__text">
				<h3>{{ t('user.registered') }}</h3>
				<a class="back_login" href="/login" @click.prevent="goLogin">{{ t('user.backlogin') }}</a>
			</div>
		</div>
		<form method="post">
			<div class="form__group">
				<label for="email">{{ t('user.resgister_email') }} <span class="text-danger">*</span></label>
				<input
					id="email"
					v-model="input.email"
					class="form-control register_input"
					:class="{ 'border-danger': errorMessage.length > 0 }"
					type="email"
					outline="none active:none"
					@keypress.enter.prevent
				/>
			</div>
			<div class="notify_register_email">
				<p>ご入力頂いたメールアドレスに認証コードを送信致します。</p>
				<p>また、Uqeyからのお知らせメールもお送り致しますので</p>
				<p>noreply@rent.uqey.comからのメールが受信できるよう設定のご確認をお願い致します。</p>
			</div>
			<div class="form__group">
				<label for="password1">{{ t('user.login_pasword') }} <span class="text-danger">*</span></label>
				<input
					id="password1"
					v-model="input.password1"
					class="form-control register_input"
					:class="{ 'border-danger': errorMessage.length > 0 }"
					type="password"
					outline="none active:none"
					@keypress.enter="checkErrorOnEnter"
				/>
			</div>
			<div class="form__group">
				<label for="password2">{{ t('user.password_again') }} <span class="text-danger">*</span></label>
				<input
					id="password2"
					v-model="input.password2"
					class="form-control register_input"
					:class="{ 'border-danger': errorMessage.length > 0 }"
					type="password"
					outline="none active:none"
					@keypress.enter="checkErrorOnEnter"
				/>
			</div>
			<div class="check" v-for="policy in policyList" :key="policy.id">
				<input
					class="policy"
					type="checkbox"
					name="policy"
					:value="policy.id"
					v-model="policyCheckList[policy.id]"
					@keypress.enter="checkErrorOnEnter"
				/>
				<label for="">
					<span class="text-primary cursor-pointer" @click="openPolicyModal(policy)"> {{ policy.title }} </span>
					{{ t('user.agree_to') }}
				</label>
			</div>

			<div v-if="errorMessage.length > 0" class="alert alert-danger mt-2 error-message" role="alert">
				{{ t('user.login_error') }} {{ errorMessage }}
			</div>
			<button
				:class="[inputHasError || policyListHasError ? 'disabled_register' : '']"
				class="button button__cus"
				:disabled="checkSendCode"
				@click="onRegister"
				@keypress.enter="checkErrorOnEnter"
			>
				{{ t('user.login_register_btn') }}
			</button>
		</form>
	</section>
	<Modal
		:modal-active="isOpenPolicyModal"
		:title-close="POLICY_TITLE"
		:checkScroll="checkScroll"
		@close="closePolicyModal"
	>
		<div class="icon_close btn-clear ms-1" @click="closePolicy">
			<carbon:close />
		</div>
		<h4 class="text-center mb-3 policy__title">{{ currentPolicy.title }}</h4>
		<div ref="infoBox" @scroll="onScroll" id="rules" class="modal__content">
			<div id="scroll__policy"></div>
			<div class="overflow-auto scroll__modal">
				<p v-html="currentPolicyContent" class="w-100 word__break"></p>
			</div>
			<div id="scroll__policy--bottom"></div>
		</div>
	</Modal>
</template>

<style scoped lang="scss">
.notify_register_email{
	margin-left: 30px;
	p{
		font-size: 13px;
		text-align: left;
		margin: 0;
	}	
	margin-bottom: 1rem;

}
.__text {
	.back_login {
		font-size: 14px;
	}
}
.policy__title {
	font-weight: 600;
}
.scroll__modal {
	overflow: visible !important;
}
.form .check {
	display: flex;
	vertical-align: middle;
	align-items: center;
	height: 35px;

	label {
		margin-bottom: 0;
	}
}
.modal__content {
	max-height: 100%;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
	padding: 0 20px;
}
.m-height {
	max-height: 25rem;
	word-break: break-word;
}
.word__break {
	word-break: break-word;
}
.mgtop_download {
	margin-top: 4rem;
}

form input[type="checkbox"] {
	width: 0px;
}
</style>
