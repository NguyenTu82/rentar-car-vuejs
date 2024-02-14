<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useReservationStore } from "~/account/stores/ReservationStore";
import { useCommonStore } from "~/common/store/CommonStore";
import { numberWithCommas } from "~/common/utils/common";
import { scrollEle } from '~/common/utils/vScroll';
import { useDownloadStore } from "~/users/stores/download";
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const { isMobile } = storeToRefs(useCommonStore());
const { t } = useI18n();
const router = useRouter();
const reservationStore = useReservationStore();
const {
  reservationDetail,
  checkReservationStatus,
  errorValidate,
  listReasonCancel,
  selectedOptionCancel,
  reasonCancelBooking,
} = storeToRefs(reservationStore);
const { deleteReservationStatus, setCheckReservation } = useReservationStore();
const { getPriceDelBoking } = storeToRefs(useReservationStore());
const emit = defineEmits(["closeCofirm"]);

const modalContent = ref<HTMLDivElement | null>(null);
const isReservation = ref(false);
const clickButton = ref(true);

const onClose = () => {
  emit("closeCofirm");
  setCheckReservation(false);
};

const onSubmit = async () => {
  if (clickButton.value) {
    clickButton.value = false;
    selectedOptionCancel.value.sort(function(a:any,b:any){
				if(b.display_rank === a.display_rank){
					if(a.name > b.name)
						return 1 
					if(a.name < b.name)
						return -1
					if(a.name === b.name)
						return 0
				}
				return a.display_rank - b.display_rank
			})
    let selectReson = selectedOptionCancel.value.map((select:any) =>{
        return select.reasons
      })
    const data = {
      reservation_id: reservationDetail.value.id,
      cancel_amount: getPriceDelBoking.value,
	    cancel_reason: JSON.stringify(selectReson),
	    cancel_reason_explain : reasonCancelBooking.value.replaceAll(' ','').length == 0 ? null : reasonCancelBooking.value
    };
    await deleteReservationStatus(data)
    isReservation.value = true;
    clickButton.value = true;
  }
};

const onSuccess = async () => {
  reservationStore.getReservationStatus();
  emit("closeCofirm");
  router.push("/account/reservation-status");
};

onClickOutside(modalContent, () =>{
  if(checkReservationStatus.value == false){
    onClose()
  }
} );
onMounted(()=>{
  if (listReasonCancel) {
    console.log('scroll')
		scrollEle('#scroll__cancel')
	} else {
		const timeOut = setTimeout(() => {
			scrollEle('#scroll__cancel')
			clearTimeout(timeOut)
		}, 1000)
	}
})

</script>

<template>
  <div class="custom-modal" id="scroll__cancel">
    <div class="overlay"></div>
    <div ref="modalContent" class="custom-modal-body" :class="{'custorm_show_list': !isReservation, mg_top__info_cancel: checkShowDownLoadUqey && isMobile}" >
      <template v-if="!isReservation">
        <div class="custom-modal-content">
          <p class="title__cancel">
            {{ t("revervation.cancel_reservation_title") }}{{ t("revervation.it_ok") }}
          </p>
          <p class="title__cancel"
            v-html="
              `キャンセル料金は ${numberWithCommas(getPriceDelBoking || 0)} 円です。`
            "
          ></p>
        </div>
        <div class="reason__cancel__booking">
          <p class="title__cancel">{{ t("revervation.reason_cancel") }}</p>
          <div
            v-for="(prb, index) in listReasonCancel"
            :key="index"
            class="listProblem_User"
          >
            <label :for="prb">
              <input
                :id="prb.id"
                type="checkbox"
                :value="prb"
                class="m-3 form-check-input"
                v-model="selectedOptionCancel"
              />
              <div class="info_insurance">
                <div class="meta">
                  <p>{{ prb.reasons }}</p>
                </div>
              </div>
            </label>
          </div>
          <textarea
            class="input_reason_for_cancel"
            rows="6"
            maxlength="300"
            placeholder="入力は任意です"
            v-model="reasonCancelBooking"
          >
          </textarea>
        </div>
        <div class="custom-modal-actions">
          <button class="custom-modal-btn custom-modal-close" @click="onClose">
            {{ t("button.return") }}
          </button>
          <button class="custom-modal-btn custom-modal-confirm" :disabled="selectedOptionCancel.length <1"  @click="onSubmit">
            {{ t("button.cancel_booking") }}
          </button>
        </div>
      </template>
      <template v-else-if="checkReservationStatus === true">
        <div class="custom-modal-content">
          <p>{{ t("revervation.canceled") }}</p>
        </div>

        <div class="custom-modal-actions">
          <button class="custom-modal-btn custom-modal-confirm" @click="onSuccess">
            {{ t("button.ok") }}
          </button>
        </div>
      </template>
      <template v-else>
        <div class="custom-modal-content">
          <p>{{ errorValidate }}</p>
        </div>

        <div class="custom-modal-actions">
          <button class="custom-modal-btn custom-modal-confirm" @click="onClose">
            {{ t("button.return") }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped lang="scss">
.mg_top__info_cancel{
  @media screen and (max-width: 480px){
    margin-top: 160px !important;
    /* padding: 3rem 0; */
  }
}
.form-check-input{
  cursor: pointer;
  border: 1px solid #000;
}
.custom-modal-body{
  margin-top: 50px;
}
.custorm_show_list{
  height: 80%;
  overflow-y: auto;
}
.custom-modal-confirm:disabled{
  opacity: 0.5;
}
.reason__cancel__booking {
  .title__cancel {
    text-align: center;
  }
}
.title__cancel{
  font-weight: bold;
}
.listProblem_User {
  label {
    display: flex;
    align-items: center;
    p {
      margin: 0;
    }
  }
}
.input_reason_for_cancel {
  width: 80%;
  margin-left: 50px;
  margin-bottom: 20px;
}
::-webkit-scrollbar {
    width: 10px;
    margin-right: 10px;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #ccc;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #F5F5F5;
} 
</style>
