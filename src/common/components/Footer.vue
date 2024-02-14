<script setup lang="ts">
import { STATUS } from "../dtos/base-output.dto";
import { Policy } from "../dtos/policy.dto";
import CommonService from "../services/CommonService";
import { NUMBER } from "../utils/constant";
import { scrollEle } from "../utils/vScroll";

const { t } = useI18n();
const POLICY_TITLE = t("home.close")
const policyList = ref<Array<Policy>>([]);
const currentPolicy = ref<Policy>(new Policy());
const currentPolicyContent = ref<any>('');
const checkScroll = ref<any>(true);
const isOpenPolicyModal = ref(false);
const infoBox = ref<HTMLDivElement | null>(null);
const innerWidth = ref<any>(window.innerWidth)
const router = useRouter();
onMounted(() => {
	CommonService.getPolicy().then((response) => {
			if (response.status === STATUS.SUCCESS) {
				policyList.value = response.data;
			}
		});
});

const openPolicyModal = (policy: Policy) => {
	isOpenPolicyModal.value = true;
	currentPolicy.value = policy
	currentPolicyContent.value = policy.content?.split("\r\n").join("<br/>") || ''
	if (policy) {
		const timeOut = setTimeout(() => {
			scrollEle('#scroll__policy')
			clearTimeout(timeOut)
		}, 200)
	}
};

const closePolicyModal = () => {
	isOpenPolicyModal.value = false;
};
const nextpagelistbusiness= () =>{
	router.push({
            path: "/listofbusiness",
            query: {},
        })
}

</script>
<template>
  <div class="footer container-xl">
		<div class="footer__policy--mar">
			<div class="footer__policy">
				<div class="footer__policy--item">
					<a href="https://uqey.com/faq/" target="blank" class="cursor-pointer footer__policy--content"> {{ t("home.faq") }} </a>
				</div>
				
				<template v-for="(policy, i) in policyList" :key="policy.id">
					<div class="footer__policy--item">
						<span class="cursor-pointer footer__policy--content" @click="openPolicyModal(policy)"> {{ policy.title }} </span>
					</div>
				</template>
				<div class="footer__policy--item">
					<a @click="nextpagelistbusiness" class="cursor-pointer footer__policy--content"> {{ t("home.partner") }} </a>
				</div>
			</div>

			<div class="footer__policy">
				<img src="/images/logo_footer.svg" class="img__logo" alt="" />
			</div>

			<div class="footer__policy">
				<span class="footer__policy--note">{{ t("home.note_footer") }}</span>
			</div>
		</div>
    
  </div>

  <Modal :modal-active="isOpenPolicyModal" :title-close="POLICY_TITLE" :checkScroll="checkScroll" @close="closePolicyModal">
    <h4 class="text-center mb-4 policy__title">{{ currentPolicy.title }}</h4>
    <div ref="infoBox" id="rules" class="modal__content">
      <div id="scroll__policy"></div>
      
      <div class="overflow-auto scroll__modal">
        <p v-html="currentPolicyContent" class="w-100 word__break"></p>
      </div>
      <div id="scroll__policy--bottom"></div>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.policy__title {
	font-weight: 600;
}
.scroll__modal {
	overflow: visible !important;
}

.modal__content {
	max-height: 100%;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
	padding: 0 20px;
}

.word__break {
	word-break: break-word;
}

.footer__policy {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	color: #ffffff;
	gap: 5px;
}

.footer__policy--item {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left:20px
}

.footer__policy--content {
	// padding: 5px 10px;
	color: #ffffff;
	font-style: normal;
	font-weight: 400;
	font-size: 18px;
	line-height: 24px;
}

.footer__policy--border-right {
	border-right: 1px solid #CCCCCC;
	height: 40px;
	margin-left: 30px;
}

.footer {
	border-top: 1px solid #CCCCCC;
	min-height: 16rem;
	background-color: #2C419A;
}

.footer__policy--mar {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 16rem;
	padding: 2rem;
}

.footer__policy--note {
	color: #ffffff;
	font-size: 0.6rem;
	font-weight: 600;
}

.img__logo {
	width: 150px;
	padding: 30px 0;
}

.break {
  flex-basis: 100%;
  height: 0;
}
@media screen and (max-width: 1024px) {
	.footer__policy--content {
		font-size: 16px;
	}
}

@media screen and (max-width: 480px) {
	.footer__policy {
		flex-direction: column;
	}
	.footer__policy--content {
		font-size: 14px;
	}
	.footer{
		width: calc(100% + 30px);
		margin-left: -15px;
		padding: 0;
	}
}
</style>