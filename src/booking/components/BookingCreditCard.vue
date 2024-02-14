<script setup lang="ts">
import moment from 'moment';
import { storeToRefs } from 'pinia';
import type { Ref } from 'vue';
import { ref, watch } from 'vue';
import { useCreditInfoStore } from '~/account/stores/CreditInfoStore';
import CommonService from '~/common/services/CommonService';
import { Policy } from '~/common/dtos/policy.dto';
import {
	checkPasteNumber,
	getCardType,
	getCardTypeByBrand,
	insertSpace,
	insertStamp,
	isNumber,
	onlyUnsignedChar,
} from '~/common/utils/common';
import { NUMBER, STRING } from '~/common/utils/constant';
import { useBookingStore } from '../stores/booking';
import { STATUS } from '~/common/dtos/base-output.dto';
import { scrollEle } from '~/common/utils/vScroll';
import CreditInfoService from '~/account/services/CreditInfoService'

const shopId = import.meta.env.VITE_GMO_SHOP_ID;

const creditInforStore = useCreditInfoStore();
const bookingStore = useBookingStore();
const { creditInfo, errorValidate, valueChoiceCard } = storeToRefs(creditInforStore);
const { errorValidateAdd, successValidateAdd } = storeToRefs(creditInforStore);
const { vehicleDetail, boardingPlace } = storeToRefs(bookingStore);
const { t } = useI18n();
const POLICY_TITLE = t('home.close');
const router = useRouter();
const route = useRoute();
const errorRes: Ref<any> = ref('');
const numberCard = ref('');
const valNumberCard = ref('');
const dateOfExpiry = ref('');
const valDateOfExpiry = ref('');
const securityCode = ref('');
const valSecurityCode = ref('');
const cardHolder = ref('');
const valCardHolder = ref('');
const checkModal = ref(false);
const modalActive = ref(false);
const keyInput = ref(true);
const clickButton = ref(true);
const isShowModalError = ref(false);
const isShowModalSuccess = ref(false);
const isShowModalSubDriver = ref(false);
const buttonCancel = ref(t('button.ok'));
const policyList = ref<Array<Policy>>([]);
const isOpenPolicyModal = ref(false);
const currentPolicy = ref<Policy>(new Policy());
const currentPolicyContent = ref<any>('');
const checkScroll = ref<any>(true);
const infoBox = ref<HTMLDivElement | null>(null);

const turnOffModalSuccess = () => {
	_handleAddCredit();
	isShowModalSuccess.value = false;
	modalActive.value = false;
};
watch(errorValidateAdd, () => {
	if (errorValidateAdd.value) {
		isShowModalError.value = true;
	}
});
const dataCreditInfo = computed(() => {
	return creditInfo.value.data || [];
});

onMounted(() => {
	_handleAddCredit();
	CommonService.getPolicy().then((response) => {
		if (response.status === STATUS.SUCCESS) {
			policyList.value = response.data;
		}
	});
});

const openPolicyModal = (policy: Policy) => {
	isOpenPolicyModal.value = true;
	currentPolicy.value = policy;
	currentPolicyContent.value = policy.content?.split('\r\n').join('<br/>') || '';
	if (policy) {
		const timeOut = setTimeout(() => {
			scrollEle('#scroll__policy');
			clearTimeout(timeOut);
		}, 200);
	}
};

const closePolicyModal = () => {
	isOpenPolicyModal.value = false;
};

const _handleAddCredit = async () => {
	if (!valueChoiceCard.value) {
		creditInforStore.selectedCard(creditInfo.value.data[0]);
	}
};

watch(creditInforStore, () => {
	errorRes.value = creditInforStore.errorValidate;
});

const showModal = () => {
	modalActive.value = true;
};

const showModalSubDriver = () => {
	isShowModalSubDriver.value = true;
};

const closeModalSubDri = (data: any = '') => {
	if (data === 'emailNull') {
		bookingStore.setListSubDriver('');
	} else if (data) {
		bookingStore.setListSubDriver(data);
	}
	isShowModalSubDriver.value = false;
};

watch(
	() => securityCode.value,
	(newValue: string) => {
		nextTick(() => {
			let newSecurityCode = checkPasteNumber(newValue);
			securityCode.value = newSecurityCode.toString().slice(0, 4);
		});
	},
);

const onClickAddCard = async (e: any) => {
	if (valDateOfExpiry.value) {
		return;
	}
	if (clickButton.value) {
		clickButton.value = false;
		const tmpNumberCard = numberCard.value.split(' ').join('');
		const tmpDateOfExpiry1 = dateOfExpiry.value.split(' / ').reverse().join('');

		doPurchase(tmpNumberCard, tmpDateOfExpiry1, securityCode.value, cardHolder.value);
	}
};

const resetDataInit = async () => {
	creditInforStore.getCreditInfo();
	modalActive.value = false;
	numberCard.value = '';
	dateOfExpiry.value = '';
	securityCode.value = '';
	cardHolder.value = '';
	valNumberCard.value = '';
	valDateOfExpiry.value = '';
	valSecurityCode.value = '';
	valCardHolder.value = '';
};
const keyupNumberCard = async (typeInput: any) => {
	const tmpNumberCard = numberCard.value.split(' ').join('');
	const tmpDateOfExpiry = dateOfExpiry.value.split(' / ').join('');
	const data: any = {
		card_number: tmpNumberCard,
		expired_date: tmpDateOfExpiry,
		security_number: securityCode.value,
		card_hoder_name: cardHolder.value,
	};

	const res = await creditInforStore.validateForm(data);
	switch (typeInput) {
		case 'numberCard':
			if (res?.errors) {
				valNumberCard.value = res?.errors?.card_number;
			} else {
				valNumberCard.value = '';
			}
			break;
		case 'dateOfExpiry':
			if (res?.errors) {
				valDateOfExpiry.value = res?.errors?.expired_date;
			} else {
				valDateOfExpiry.value = '';
			}
			break;
		case 'securityCode':
			if (res?.errors) {
				valSecurityCode.value = res?.errors?.security_number;
			} else {
				valSecurityCode.value = '';
			}
			break;
		case 'cardHolder':
			if (res?.errors) {
				valCardHolder.value = res?.errors?.card_hoder_name;
			} else {
				valCardHolder.value = '';
			}
			break;

		default:
			break;
	}

	if (
		(tmpDateOfExpiry.substring(0, 2) &&
			(+tmpDateOfExpiry.substring(0, 2) === 0 || +tmpDateOfExpiry.substring(0, 2) > 12)) ||
		(tmpDateOfExpiry.substring(2, 4) == moment().format('YY') &&
			tmpDateOfExpiry.substring(0, 2) < moment().format('MM'))
	) {
		valDateOfExpiry.value = t('validate.credit_card.expired_date__err_month');
	}
	if (tmpDateOfExpiry.substring(2, 4) && +tmpDateOfExpiry.substring(2, 4) < +moment().format('YY')) {
		valDateOfExpiry.value = t('validate.credit_card.expired_date__err_month');
	}
};

function handleBackInsurantOption() {
	router.push({
		path: `/booking/${route.params.id}/reservation-confirmation`,
		query: {},
	});
}
function handleReservationComplete() {
	router.push({
		path: `/booking/${route.params.id}/reservation-complete`,
		query: {},
	});
}
const onClickBack = () => {
	errorRes.value = '';
};
const cancelModal = () => {
	modalActive.value = false;
	resetDataInit();
};

const checkCreditInfo = computed(() => {
	if (creditInfo.value.data == null) {
		return 0;
	} else {
		return creditInfo.value.data.length;
	}
});

watch(cardHolder, (newValue: string) => {
	nextTick(() => {
		if (keyInput.value) {
			cardHolder.value = onlyUnsignedChar(newValue);
		}
	});
});
const handleTextInput = (e: any) => {
	if (e.key === 'Backspace') {
		keyInput.value = false;
	} else {
		keyInput.value = true;
	}
};

watch(numberCard, (newValue: string) => {
	nextTick(() => {
		numberCard.value = insertSpace(newValue);
	});
});
const processData = (e: any) => {
	numberCard.value = e.target.value;
	keyupNumberCard('numberCard')
}
const handleTextInputNumberCard = (e: any) => {
	if (
		e.key !== 'Backspace' &&
		e.key !== 'Delete' &&
		e.key !== 'Tab' &&
		e.key !== 'ArrowLeft' &&
		e.key !== 'ArrowRight' &&
		e.key !== 'c' &&
		e.key !== 'v' &&
		e.key !== 'Control'
	) {
		checkPasteNumber(e.key);
		isNumber(e);
	}
};

watch(dateOfExpiry, (newValue: string) => {
	nextTick(() => {
		let newDateOfExpiry = newValue.toString().slice(0, 7);
		dateOfExpiry.value = insertStamp(newDateOfExpiry);
	});
});
const handleTextInputDateOfExpiry = (e: any) => {
	if (
		e.key !== 'Backspace' &&
		e.key !== 'Delete' &&
		e.key !== 'Tab' &&
		e.key !== 'ArrowLeft' &&
		e.key !== 'ArrowRight' &&
		e.key !== 'c' &&
		e.key !== 'v' &&
		e.key !== 'Control'
	) {
		isNumber(e);
		checkPasteNumber(e.key);
		dateOfExpiry.value = insertStamp(dateOfExpiry.value);
	}
};

const handleCloseText = (text: string) => {
	switch (text) {
		case 'numberCard':
			numberCard.value = '';
			keyupNumberCard('numberCard');
			break;
		case 'dateOfExpiry':
			dateOfExpiry.value = '';
			keyupNumberCard('dateOfExpiry');
			break;
		default:
			break;
	}
};

const doPurchase = (cardno: any, expire: any, securitycode: any, holdername: any) => {
	let tokennumber = NUMBER.FIRST;
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
				const { token } = response.tokenObject;
				const tmpNumberCard = numberCard.value.split(' ').join('');
				const tmpDateOfExpiry = dateOfExpiry.value.split(' / ').join('');

				const data: any = {
					card_number: tmpNumberCard,
					expired_date: tmpDateOfExpiry,
					security_number: securityCode.value,
					card_hoder_name: cardHolder.value,
					brand: getCardType(tmpNumberCard),
					token: token?.[0] || '',
				};

				const res: any = await creditInforStore.postAddCard(data);
				clickButton.value = true;
				if (res?.status == 'Success') {
					creditInforStore.getCreditInfo();
					isShowModalSuccess.value = true;
					clickButton.value = false;
				}

				if (res?.errors) {
					valNumberCard.value = res?.errors?.card_number;
					valDateOfExpiry.value = res?.errors?.expired_date;
					valSecurityCode.value = res?.errors?.security_number;
					valCardHolder.value = res?.errors?.card_hoder_name;
				} else {
					valNumberCard.value = '';
					valDateOfExpiry.value = '';
					valSecurityCode.value = '';
					valCardHolder.value = '';
				}

				if (
					(tmpDateOfExpiry.substring(0, 2) &&
						(+tmpDateOfExpiry.substring(0, 2) === 0 || +tmpDateOfExpiry.substring(0, 2) > 12)) ||
					(tmpDateOfExpiry.substring(2, 4) == moment().format('YY') &&
						tmpDateOfExpiry.substring(0, 2) < moment().format('MM'))
				) {
					valDateOfExpiry.value = t('validate.credit_card.expired_date__err_month');
				}
				if (tmpDateOfExpiry.substring(2, 4) && +tmpDateOfExpiry.substring(2, 4) < +moment().format('YY')) {
					valDateOfExpiry.value = t('validate.credit_card.expired_date__err_month');
				}
			} else {
				let dataError = {error : [response.resultCode]}
        		CreditInfoService.saveErrorTokenGmo(dataError)
				errorValidateAdd.value = t('validate.token');
				isShowModalError.value = true;
			}
		},
	);
};
</script>
<template>
	<CarInfoBasic />
	<div class="page-detail insurance-page row">
		<div class="col-12 col-md-6 col-lg-4">
			<CarImage />
		</div>
		<div class="base-detail col-12 col-md-6 col-lg-4">
			<InfomationCar />
			<div class="note">
				<p
					v-if="boardingPlace?.info_from_station"
					v-html="boardingPlace?.info_from_station.split('\r\n').join('<br/>') || ''"
					class="info_from_station"
				></p>
			</div>
		</div>
		<div class="col-12 col-md-12 col-lg-4 reservation">
			<TotalRentalCar />
			<ProblemTextUser />
			<div class="reservation">
				<h4 class="card-title">{{ t('booking.credit_card_selection') }}</h4>
				<div class="select-form" v-if="dataCreditInfo">
					<div class="custom-option" v-for="data in dataCreditInfo" :key="data.id">
						<input :id="data.di" type="radio" v-model="valueChoiceCard" :value="data" name="option_insurance" />
						<label class="credit-card" :for="data.id">
							<img :src="`/icons/card/${getCardTypeByBrand(data?.brand)}.png`" alt="" />
							<div class="meta">
								<h4>{{ data?.card_number }}</h4>
							</div>
						</label>
					</div>
				</div>
				<div class="text-end p-3">
					<a class="text-danger">{{ t('booking.final_payment') }}</a>
				</div>

				<div class="display__content p-3">
					{{ t('booking.text_perfect1') }}
					<span class="check" v-for="(policy, index) in policyList" :key="policy.id">
						<span class="text-primary cursor-pointer" @click="openPolicyModal(policy)">
							{{ t('booking.bracket_start') }}
							{{ policy.title }}
							{{ t('booking.bracket_end') }}
							{{
								policyList?.length !== NUMBER.ZERO && index + 1 !== policyList?.length ? t('booking.bracket_comma') : ''
							}}
						</span>
					</span>
					<span class="check" v-if="vehicleDetail.fp_terms">
						<a
							v-if="typeof vehicleDetail?.terms_url == 'string'"
							:href="vehicleDetail?.terms_url"
							target="_blank"
							class="text-primary cursor-pointer"
						>
							{{ t('booking.bracket_comma') }}
							{{ t('booking.bracket_start') }}
							{{ vehicleDetail?.fp_terms }}
							{{ t('booking.bracket_end') }}
						</a>
						<a v-else :href="vehicleDetail?.terms_url[0]" target="_blank" class="text-primary cursor-pointer">
							{{ t('booking.bracket_comma') }}
							{{ t('booking.bracket_start') }}
							{{ vehicleDetail?.fc_terms }}
							{{ t('booking.bracket_end') }}
						</a>
					</span>
					{{ t('booking.text_perfect2') }}
				</div>

				<div v-if="checkCreditInfo < 5" class="show-modal text-end p-3">
					<a id="show-btn" class="text-secondary" @click="showModal"> ✙ {{ t('booking.add_new_card') }} </a>
				</div>

				<div class="row">
					<div class="col-sm-12 text-end">
						<button class="btn btn-primary m-2" @click="showModalSubDriver">
							{{ t('revervation.btn_passenger_change') }}
						</button>
					</div>
				</div>
				<InfoCancelBooking />

				<div class="box-action box-action__cus box__action--mb">
					<button type="button" class="btn btn-secondary m-2" @click="handleBackInsurantOption()">
						{{ t('booking.return_vehicle') }}
					</button>
					<button
						type="button"
						:disabled="checkCreditInfo == 0"
						class="btn btn-primary m-2"
						@click="handleReservationComplete()"
					>
						{{ t('button.reserve') }}
					</button>
				</div>
			</div>
		</div>
	</div>
	<transition name="modal-animation">
		<div v-show="modalActive" class="modal">
			<transition name="modal-animation-inner">
				<div v-show="modalActive" class="text-center">
					<div class="box_add__create_card">
						<div class="box_add__create_card_title">{{ t('booking.add_new_card') }}</div>
						<div class="box_add__create_card_input">
							<div class="form__input_group">
								<label for="">{{ t('booking.number') }}</label>
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
										:class="{ 'border-danger': valNumberCard }"
									/>
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
										<label for="">{{ t('booking.date_of_expiry') }}</label>
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
												:class="{ 'border-danger': valDateOfExpiry }"
											/>
											<template v-if="dateOfExpiry">
												<div
													@click="handleCloseText('dateOfExpiry')"
													type="button"
													class="close__cus"
													aria-label="Close"
												>
													<span aria-hidden="true">&times;</span>
												</div>
											</template>
										</div>
										<div v-if="valDateOfExpiry" class="error__validate">{{ valDateOfExpiry }}</div>
									</div>
								</div>
								<div class="col">
									<div class="form__input_group">
										<label for="">{{ t('booking.security_code') }}</label>
										<input
											v-model="securityCode"
											@keypress="isNumber($event)"
											@keyup="keyupNumberCard('securityCode')"
											type="text"
											maxlength="4"
											name="securityCode"
											class="form-control add_credit_card__input"
											:class="{ 'border-danger': valSecurityCode }"
										/>
										<div v-if="valSecurityCode" class="error__validate">{{ valSecurityCode }}</div>
									</div>
								</div>
							</div>

							<div class="form__input_group">
								<label for="">{{ t('booking.card_holder') }}</label>
								<input
									v-model="cardHolder"
									@keypress="handleTextInput"
									@keyup="keyupNumberCard('cardHolder')"
									type="text"
									name="cardHolder"
									maxlength="50"
									class="form-control add_credit_card__input"
									:class="{ 'border-danger': valCardHolder }"
								/>
								<div v-if="valCardHolder" class="error__validate">{{ valCardHolder }}</div>
							</div>

							<div class="row">
								<div class="col add_credit_card__btn">
									<button class="credit_card__btn_cancel" @click="cancelModal">{{ t('booking.cancel') }}</button>
								</div>
								<div class="col add_credit_card__btn">
									<button
										@click="onClickAddCard"
										class="credit_card__btn_add"
										:data-bs-dismiss="checkModal ? 'modal' : ''"
									>
										{{ t('button.addition') }}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</transition>
			<ErrorModal
				v-if="isShowModalError"
				@closeModalError="isShowModalError = false"
				:resError="errorValidateAdd"
				:buttonCancel="buttonCancel"
			/>
		</div>
	</transition>
	<SuccessModalAdd
		v-if="isShowModalSuccess"
		@closeCreditSuccessModal="turnOffModalSuccess"
		:resSuccess="successValidateAdd"
	/>

	<ModalSubDriver v-if="isShowModalSubDriver" @closeModalSubDri="closeModalSubDri" />

	<Modal
		:modal-active="isOpenPolicyModal"
		:title-close="POLICY_TITLE"
		:checkScroll="checkScroll"
		@close="closePolicyModal"
	>
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

<style lang="scss" scoped>
.info_from_station {
	width: 100%;
	word-wrap: break-word;
}
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

.box-action {
	button:disabled {
		cursor: not-allowed !important;
		pointer-events: unset;
	}
}
.modal-animation-enter-active,
.modal-animation-leave-active {
	transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-animation-enter-from,
.modal-animation-leave-to {
	opacity: 0;
}
.modal-animation-inner-enter-active {
	transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}
.modal-animation-inner-leave-active {
	transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-animation-inner-enter-from {
	opacity: 0;
	transform: scale(0.8);
}
.modal-animation-inner-leave-to {
	transform: scale(0.8);
}
.modal {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 100vw;
	position: fixed;
	top: 0;
	left: 0;
	background-color: rgba(255, 255, 255, 0.7);
}
.form__input_group {
	text-align: left;
	label {
		font-weight: bold;
	}
}
@media screen and (max-width: 480px) {
	.text-end{
		padding: 0.5rem !important;
	}
	.dashboard__cus {
		margin-top: -110px;
	}

	.base-detail {
		margin-bottom: 20px;
	}

	.page .page-detail .box__action--mb {
		justify-content: space-between;
	}
	.credit-card {
		display: grid;
		grid-template-columns: 80px 1fr;
		align-items: center;
		h4{
			font-size: 20px;
		}
	}
}
</style>
