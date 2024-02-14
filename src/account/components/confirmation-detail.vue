<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useReservationStore } from "~/account/stores/ReservationStore";
import { useRentalHistoryStore } from "~/account/stores/RentalHistoryStore";
import { useUserInfoStore } from "~/account/stores/UserInfoStore";
import { formatDayTime, getMinute, numberWithCommas } from "~/common/utils/common";
import { NUMBER, TAB_ACCOUNT } from "~/common/utils/constant";
import { scrollEle2 } from "~/common/utils/vScroll";
import { useDownloadStore } from "~/users/stores/download";
import { useCommonStore } from "~/common/store/CommonStore";

const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const { isMobile } = storeToRefs(useCommonStore());
const { t } = useI18n();
const router = useRouter();
const {
  reservationDetail,
  checkPerson,
  listSubDriver,
  vehicleInfo,
  vehicleHistoryInfo,
} = storeToRefs(useReservationStore());
const { rentalHistoryDetail } = storeToRefs(useRentalHistoryStore());
const userInfoStore = useUserInfoStore();
const { tabAccount } = storeToRefs(userInfoStore);
const isShowConfirmDetail = ref(false);
const isShowPassengeChange = ref(true);
const reservationStore = useReservationStore();
const subdriversEmail = ref<any>("");
const showInfo = ref(false);
onMounted(() => {
  if (tabAccount.value === TAB_ACCOUNT.SECOND) {
    reservationStore.getReserverDetail(reservationDetail.value.vehicle_id);
  } else if (tabAccount.value === TAB_ACCOUNT.THIRST) {
    reservationStore.getrentalHisDetail(rentalHistoryDetail.value.vehicle_id);
  }
  if (checkPerson.value) {
    subdriversEmail.value = listSubDriver.value;
  } else {
    subdriversEmail.value = dataReservation.value?.subdrivers;
  }
  if (dataReservation) {
		scrollEle2('#scroll__listbooking')
	} else {
		const timeOut = setTimeout(() => {
			scrollEle2('#scroll__listbooking')
			clearTimeout(timeOut)
		}, 1000)
	}
});

const showModalConfirm = async () => {
  await reservationStore.getPriceDeleteBooking(dataReservation?.value.id);
  isShowConfirmDetail.value = true;
};
const dataReservation = computed(() => {
  if (tabAccount.value === TAB_ACCOUNT.SECOND) {
    return reservationDetail.value || "";
  } else if (tabAccount.value === TAB_ACCOUNT.THIRST) {
    return rentalHistoryDetail.value || "";
  }
});
const listInsuranceSort = computed(() => {
  return dataReservation.value.insurances.sort(function (a: any, b: any) {
    if (a.required != b.required) {
      return (a.required || 0) - (b.required || 0);
    }
    if (b.display_rank === a.display_rank) {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      if (a.name === b.name) return 0;
    }
    return a.display_rank - b.display_rank;
  });
});
const listOptionSort = computed(() => {
  return dataReservation.value.accessories.sort(function (a: any, b: any) {
    if (b.display_rank === a.display_rank) {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      if (a.name === b.name) return 0;
    }
    return a.display_rank - b.display_rank;
  });
});
const dataReservationDetail = computed(() => {
  if (tabAccount.value === TAB_ACCOUNT.SECOND) {
    return vehicleInfo.value || "";
  } else if (tabAccount.value === TAB_ACCOUNT.THIRST) {
    return vehicleHistoryInfo.value || "";
  }
});
const handleBack = () => {
  if (tabAccount.value === TAB_ACCOUNT.SECOND) {
    router.push("/account/reservation-status");
  } else if (tabAccount.value === TAB_ACCOUNT.THIRST) {
    router.push("/account/rental-history");
  }
};

const handlePassengeChange = () => {
  isShowPassengeChange.value = false;
};

const backReservation = (data: any) => {
  if (checkPerson.value) {
    subdriversEmail.value = listSubDriver.value;
  } else {
    subdriversEmail.value = dataReservation.value?.subdrivers;
  }

  if (data === "null") {
    reservationStore.setSubDrive("");
  } else if (data) {
    reservationStore.setSubDrive(data);
  }
  isShowPassengeChange.value = true;
};
const showInfoBooking = () => {
  showInfo.value = !showInfo.value;
};
</script>

<template>
  <div class="container__cus">
    <section class="dashboard">
      <div class="page" :class="{mg_top__info: checkShowDownLoadUqey && isMobile}">
        <div id="scroll__listbooking"></div>
        <div class="page-contain">
          <div
            class="car-info-basic car-info-basic__cus"
            :class="[showInfo ? 'car-info-show' : 'car-info-hide']"
          >
            <div class="show_info_booking">
              <h4 class="car-title">
                {{ t("revervation.time_boarding") }}
              </h4>
              <p>
                {{
                  tabAccount === TAB_ACCOUNT.SECOND
                    ? formatDayTime(dataReservation?.start_time)
                    : dataReservation?.operations_start_time
                    ? formatDayTime(dataReservation?.operations_start_time)
                    : formatDayTime(dataReservation.reservations_start_time)
                }}
              </p>
              <h4 class="car-title">
                {{ t("revervation.boarding_place") }}
              </h4>
              <div class="car-info">
                <p>{{ dataReservation?.franchise_station_start_name || "" }}</p>
                <p>{{ dataReservation?.station_start_name_jp || "" }}</p>
                <p>
                  {{
                    dataReservation?.station_start_oneway == 2 ? "(ワンウェイ不可)" : ""
                  }}
                </p>
                <p>
                  {{ t("revervation.location") }}:{{
                    dataReservation?.station_start_address || ""
                  }}
                </p>
                <div class="more">
                  <p>
                    {{ t("revervation.business_hours") }}:
                    {{
                      dataReservation?.station_start_always_open == 1
                        ? "24時間営業"
                        : `${dataReservation?.station_start_start_business_time?.slice(
                            0,
                            5
                          )} ~ ${dataReservation?.station_start_end_business_time?.slice(
                            0,
                            5
                          )}`
                    }}
                  </p>
                  <p>
                    {{ t("revervation.rv_phone") }}:
                    {{ dataReservation?.station_start_phone || "" }}
                  </p>
                </div>
              </div>
            </div>
            <div class="show_info_booking">
              <h4 class="car-title">
                {{ t("revervation.return_time") }}
              </h4>
              <p>
                {{
                  tabAccount === TAB_ACCOUNT.SECOND
                    ? formatDayTime(dataReservation?.end_time)
                    : dataReservation?.operations_start_time
                    ? formatDayTime(dataReservation?.operations_end_time)
                    : formatDayTime(dataReservation.reservations_end_time)
                }}
              </p>
              <h4 class="car-title">
                {{ t("revervation.place_return") }}
              </h4>
              <div class="car-info">
                <p>{{ dataReservation?.franchise_station_end_name || "" }}</p>
                <p>{{ dataReservation?.station_end_name_jp || "" }}</p>
                <p>
                  {{ dataReservation?.station_end_oneway == 2 ? "(ワンウェイ不可)" : "" }}
                </p>
                <p>
                  {{ t("revervation.location") }}:
                  {{ dataReservation?.station_end_address || "" }}
                </p>
                <div class="more">
                  <p>
                    {{ t("revervation.business_hours") }}:
                    {{
                      dataReservation?.station_end_always_open == 1
                        ? "24時間営業"
                        : `${dataReservation?.station_end_start_business_time?.slice(
                            0,
                            5
                          )} ~ ${dataReservation?.station_end_end_business_time?.slice(
                            0,
                            5
                          )}`
                    }}
                  </p>
                  <p>
                    {{ t("revervation.rv_phone") }}:
                    {{ dataReservation?.station_end_phone || "" }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="action_show_hide" @click="showInfoBooking">
            <img class="action__img" v-if="showInfo" src="/icons/expand-up.svg" alt="" />
            <img class="action__img" v-else src="/icons/expand-down.svg" alt="" />
          </div>
        </div>

        <div class="page-detail insurance-page insurance-page_cus">
          <div class="car-box-left">
            <div class="page-insurance">
              <div class="fancy-box fancy__box--display">
                <div class="herro-img">
                  <a
                    :href="dataReservation?.img"
                    data-fancybox="gallery"
                    data-caption="Optional caption"
                  >
                    <img :src="dataReservation?.img || ''" alt="" />
                  </a>
                </div>
                <span class="vehicle__number">{{ dataReservation?.vehicle_number }}</span>
              </div>
              <div class="base-detail">
                <div class="appeal_point__show">
                  <p
                    v-if="dataReservationDetail?.appeal_point"
                    v-html="
                      dataReservationDetail?.appeal_point.split('\r\n').join('<br/>') ||
                      ''
                    "
                  ></p>
                </div>
                <p>
                  {{ t("revervation.car_model_name") }} {{ dataReservation?.name || "" }}
                </p>
                <p v-if="dataReservation?.brand">
                  {{ t("revervation.manufacturer") }} {{ dataReservation?.brand || "" }}
                </p>
                <p v-if="dataReservation?.color">
                  {{ t("revervation.color_car") }} {{ dataReservation?.color || "" }}
                </p>
                <p>
                  {{ t("revervation.capacity") }}
                  {{ numberWithCommas((+dataReservation?.capacity)?.toFixed(0))
                  }}{{ t("revervation.capacity_name") }}
                </p>
                <p v-if="dataReservation?.displacement">
                  {{ t("revervation.displacement") }}
                  {{ numberWithCommas((+dataReservation?.displacement))
                  }}{{ t("revervation.displacement_cc") }}
                </p>
                <p v-if="dataReservation?.fuel_type">
                  {{ t("revervation.fuel_type_car") }}
                  {{ dataReservation?.fuel_type || "" }}
                </p>
                <p v-if="dataReservation?.fuel">
                  {{ t("revervation.fuel_consumption") }}
                  {{ numberWithCommas((+dataReservation?.fuel))
                  }}{{ t("revervation.fuel_consumption_km") }}
                </p>
                <p v-if="dataReservationDetail?.wheel_drive_type >= 0">
                  {{ t("revervation.4WD/2WD") }}
                  {{
                    numberWithCommas(
                      (+dataReservationDetail?.wheel_drive_type)?.toFixed(0)
                    )
                  }}
                  {{ t("revervation.WD") }}
                </p>
                <p
                  v-if="
                    dataReservation?.length ||
                    dataReservation?.width ||
                    dataReservation?.height
                  "
                >
                  {{ t("revervation.size") }}
                  {{
                    dataReservation?.length
                      ? numberWithCommas((+dataReservation?.length))
                      : "-"
                  }}/
                  {{
                    dataReservation?.width
                      ? numberWithCommas((+dataReservation?.width))
                      : "-"
                  }}/
                  {{
                    dataReservation?.height
                      ? numberWithCommas((+dataReservation?.height))
                      : "-"
                  }}{{ dataReservation?.height ? t("revervation.size_mmm") : "-" }}
                </p>
                <p
                  v-if="
                    dataReservationDetail?.car_navi &&
                    dataReservationDetail?.car_navi == 1
                  "
                >
                  {{ t("revervation.car_navi") }} {{ t("revervation.yes_checkbox") }}
                </p>
                <p
                  v-else-if="
                    dataReservationDetail?.car_navi &&
                    dataReservationDetail?.car_navi == 2
                  "
                >
                  {{ t("revervation.car_navi") }} {{ t("revervation.no_checkbox") }}
                </p>
                <p v-if="dataReservationDetail?.etc && dataReservationDetail?.etc == 1">
                  {{ t("revervation.car_etc") }} {{ t("revervation.yes_checkbox") }}
                </p>
                <p
                  v-else-if="
                    dataReservationDetail?.etc && dataReservationDetail?.etc == 2
                  "
                >
                  {{ t("revervation.car_etc") }} {{ t("revervation.no_checkbox") }}
                </p>

                <p v-if="dataReservation?.max_load_capacity">
                  {{ t("booking.maximum_loading_capacity") }}
                  {{ dataReservation?.max_load_capacity || "" }}
                  {{ t("booking.weight_kg") }}
                </p>
                <p v-if="dataReservation?.vehicle_total_weight">
                  {{ t("booking.vehicle_total_weight") }}
                  {{ dataReservation?.vehicle_total_weight || "" }}
                  {{ t("booking.weight_kg") }}
                </p>
                <p v-if="dataReservation?.auto_manual === NUMBER.FIRST">
                  {{ t("booking.type_car_AT") }}
                </p>
                <p v-if="dataReservation?.auto_manual === NUMBER.SECOND">
                  {{ t("booking.type_car_MT") }}
                </p>
                <p
                  v-if="dataReservation?.station_start_info_from_station"
                  v-html="
                    dataReservation?.station_start_info_from_station
                      .split('\r\n')
                      .join('<br/>') || ''
                  "
                  class="info_from_station"
                ></p>
              </div>
            </div>
          </div>
          <div v-if="isShowPassengeChange" class="car-box-right reservation">
            <div class="booking-infomation">
              <div class="list-info" v-if="dataReservation?.status == 3">
                <h4>{{ t("revervation.reservation_cancel_booking") }}</h4>
                <div class="list-sub-price list-sub-price_cus">
                  <p v-if="subdriversEmail?.length">
                    {{ t("rental_history.passenger_information") }}
                  </p>
                  <template v-for="(data, index) in subdriversEmail">
                    <div class="sub-price sub-price__cus">
                      <p>{{ index + 1 }}{{ t("revervation.sign") }}{{ data?.email }}</p>
                    </div>
                  </template>
                </div>
                <div class="list-sub-price list-sub-price_cus">
                  <p>{{ t("revervation.reservation_details") }}</p>
                </div>
                <div
                  v-if="dataReservation?.cancel_amount >= 0"
                  class="list-sub-price list-sub-price_cus"
                >
                  <!-- <p>保険・補償</p> -->
                  <div class="sub-price sub-price__cus">
                    <p>{{ t("revervation.price_cancle") }}</p>
                    <p>
                      <b>￥{{ numberWithCommas(dataReservation?.cancel_amount || 0) }}</b>
                    </p>
                  </div>
                </div>
              </div>
              <div class="list-info" v-else>
                <h4>{{ t("revervation.reservation_overview") }}</h4>
                <div class="list-sub-price list-sub-price_cus">
                  <p v-if="subdriversEmail?.length">
                    {{ t("rental_history.passenger_information") }}
                  </p>
                  <template v-for="(data, index) in subdriversEmail">
                    <div class="sub-price sub-price__cus">
                      <p>{{ index + 1 }}{{ t("revervation.sign") }}{{ data?.email }}</p>
                    </div>
                  </template>
                </div>
                <div class="list-sub-price list-sub-price_cus">
                  <p>{{ t("booking.plan_to_use") }}</p>
                  <div
                    v-if="!JSON.parse(dataReservation?.calc_result)"
                    class="sub-price sub-price__cus"
                  >
                    <p class="text_color">{{ dataReservation?.pack_name }}</p>
                    <p>
                      <b>￥{{ numberWithCommas(dataReservation?.pack_price) }}</b>
                    </p>
                  </div>
                  <div
                    v-else="JSON.parse(dataReservation?.calc_result)"
                    v-for="calc in JSON.parse(dataReservation?.calc_result)"
                    class="sub-price sub-price__cus"
                  >
                    <p class="text_color">
                      {{ calc.name }}
                      <span class="calc_quatity" v-if="calc.quantity">x</span>
                      <span v-if="calc.quantity">{{ calc.quantity }}</span>
                    </p>
                    <p>
                      <b class="option-price"
                        ><span v-if="calc.amount < 0">-</span>￥{{
                          numberWithCommas(Math.abs(calc.amount)) || 0
                        }}</b
                      >
                    </p>
                  </div>
                  <div
                    class="sub-price sub-price__cus"
                    v-if="tabAccount === TAB_ACCOUNT.THIRST"
                  >
                    <p v-if="dataReservation?.count_day_actual > 0 && !JSON.parse(dataReservation?.calc_result)">
                      {{ dataReservation?.calc_name }} x
                      {{ dataReservation?.count_day_actual }}
                    </p>
                    <p v-if="dataReservation?.count_day_actual > 0 && !JSON.parse(dataReservation?.calc_result)">
                      <b>￥{{ numberWithCommas(dataReservation?.overnight_fee) }}</b>
                    </p>
                  </div>
                  <div class="sub-price sub-price__cus" v-else>
                    <p v-if="dataReservation?.count_day > 0 && !JSON.parse(dataReservation?.calc_result)" class="text_color">
                      {{ dataReservation?.calc_name }} x {{ dataReservation?.count_day }}
                    </p>          
                    <p v-if="dataReservation?.count_day > 0 && !JSON.parse(dataReservation?.calc_result)">
                      <b>￥{{ numberWithCommas(dataReservation?.overnight_fee) }}</b>
                    </p>                 
                  </div>
                </div>
                <div
                  v-if="dataReservation?.insurances?.length"
                  class="list-sub-price list-sub-price_cus"
                >
                  <p>{{ t("booking.title_insurance") }}</p>
                  <div
                    class="sub-price sub-price__cus"
                    v-for="select in listInsuranceSort"
                    :key="select.id"
                  >
                    <div class="show-info-insurance">
                      <p class="text_color">{{ select?.name }}</p>
                      <p v-if="select.calc_day > 0" class="quality_select text_color">
                        x
                      </p>
                      <p v-if="select.calc_day > 0" class="countday text_color">
                        {{ select?.calc_day }}日分
                      </p>
                    </div>
                    <p>
                      <b>￥{{ numberWithCommas(select?.total_fee_actual) }}</b>
                    </p>
                  </div>
                </div>
                <div
                  class="list-sub-price list-sub-price_cus"
                  v-if="dataReservation?.accessories.length > 0"
                >
                  <p>{{ t("booking.double_plan") }}</p>
                  <div
                    class="sub-price sub-price__cus"
                    v-for="select in listOptionSort"
                    :key="select.id"
                  >
                    <p class="text_color">
                      {{ select?.name }} <span class="quality_select"> x </span>
                      {{ select?.quantity }}
                    </p>
                    <p>
                      <b>￥{{ numberWithCommas(select?.total_fee_actual) }}</b>
                    </p>
                  </div>
                </div>
                <div
                  class="list-sub-price list-sub-price_cus"
                  v-if="dataReservation?.over_time"
                >
                  <p>{{ t("revervation.reservation_overview") }}</p>
                  <div class="sub-price sub-price__cus">
                    <p>{{ dataReservation?.over_time }} 分</p>
                    <p>
                      <b>￥{{ numberWithCommas(dataReservation?.overtime_fee) }} </b>
                    </p>
                  </div>
                </div>
                <div
                  v-if="+dataReservation?.overtime > NUMBER.ZERO"
                  class="list-sub-price list-sub-price_cus"
                >
                  <div class="sub-price sub-price__cus">
                    <p class="price-over-time">
                      {{ t("revervation.extend") }}
                      {{
                        Math.floor((+dataReservation?.overtime)?.toFixed(0) / 60) ||
                        NUMBER.ZERO
                      }}時間
                      {{ (+dataReservation?.overtime)?.toFixed(0) % 60 || NUMBER.ZERO }}分
                    </p>
                    <p>
                      <b>￥{{ numberWithCommas(dataReservation?.overtime_fee) }}</b>
                    </p>
                  </div>
                </div>
              </div>

              <div class="sub-price total">
                <p>{{ t("revervation.total_amount") }}</p>
                <p v-if="dataReservation?.status == NUMBER.THIRST">
                  <b
                    >￥{{
                      numberWithCommas(dataReservation?.cancel_amount || NUMBER.ZERO)
                    }}</b
                  >
                </p>
                <p v-else-if="tabAccount === TAB_ACCOUNT.THIRST">
                  <b>￥{{ numberWithCommas(dataReservation?.total_amount_actual) }}</b>
                </p>
                <p v-else>
                  <b>￥{{ numberWithCommas(dataReservation?.total_amount) }}</b>
                </p>
              </div>
            </div>
            <InfomationConfirmUser v-if="dataReservation?.status != 3" />
            <div
              v-if="
                tabAccount === TAB_ACCOUNT.SECOND &&
                dataReservation?.sub_driver_check === NUMBER.ZERO
              "
              class="box-action"
            >
              <div></div>
              <button @click.prevent="handlePassengeChange" class="btn btn-primary m-2">
                {{ t("revervation.btn_passenger_change") }}
              </button>
            </div>
            <div class="box-action">
              <template v-if="tabAccount === TAB_ACCOUNT.SECOND &&  dataReservation?.status != 1">
                <span v-if="!dataReservation?.sub_driver_check">
                  <button class="button button-normal" @click="showModalConfirm">
                    {{ t("revervation.cancel_reservation") }}
                  </button>
                </span>
                <span v-else></span>
              </template>

              <div v-else></div>

              <button
                v-if="tabAccount === TAB_ACCOUNT.SECOND"
                @click.prevent="handleBack"
                class="btn btn-primary m-2"
              >
                {{ t("revervation.back_reservation_list") }}
              </button>
              <button v-else @click.prevent="handleBack" class="btn btn-primary m-2">
                {{ t("revervation.back_hisoty_list") }}
              </button>
            </div>
          </div>
          <EditPassenge v-else @backReservation="backReservation" />
        </div>
      </div>
    </section>
  </div>

  <DeleteReverModal
    v-if="isShowConfirmDetail"
    @closeCofirm="isShowConfirmDetail = false"
  />
</template>
<style lang="scss" scoped>
.calc_quatity {
  margin: 0 10px;
}
.info_from_station {
  word-break: break-all;
}
.appeal_point__show {
  width: 500px;
  word-break: break-all;
  p {
    font-weight: bold;
  }
  @media screen and (max-width: 1480px) {
    width: auto;
  }
}
.show-info-insurance {
  display: grid;
	grid-template-columns: 1fr 25px 60px;
	width: 100%;
}
.quality_select {
  margin-left: 10px !important;
  margin-right: 10px !important;
}
.countday {
  margin-left: 0 !important;
  margin-bottom: 10px !important;
}
.sub-price__cus {
  margin-bottom: 10px !important;
}
.price-over-time {
  padding: 0;
  margin: 0 !important;
}
.text_color {
  margin: 0;
  color: #9d9da1;
  font-size: 16px;
}
</style>
