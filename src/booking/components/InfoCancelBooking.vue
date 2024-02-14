<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { numberWithCommas } from '~/common/utils/common';
import { scrollEle } from '~/common/utils/vScroll';
import { useBookingStore } from '../stores/booking';

const { t } = useI18n();

const bookingStore = useBookingStore();
const {vehicleDetail } = storeToRefs(useBookingStore());
</script>
<template>
    <p class="title_info_cancel">{{t('booking.title_cancel')}}</p>
	 <table >
        
        <tr v-for="(cancel,index) in vehicleDetail?.cancel_policy?.cancel_plan" :index="index">
            <td>{{cancel.day_number ===0 ? '当日' : `${cancel.day_number}日前`}}</td>
            <td>料金の{{cancel.rate}}%</td>
        </tr>
    </table>
</template>
<style scoped lang="scss">
    .title_info_cancel{
        color: #9d9da1;
        font-size: 20px;
        font-weight: bold;
    }
    table{
        width: 100%;
        tr{
         border: 1px solid #ccc;
        }
        td{
         width: 50%;
         margin: 0;
         color: #9d9da1;
         font-size: 16px;
        }
        tr>td:first-child{
         border-right: 1px solid #ccc;
        }
    }
</style>
