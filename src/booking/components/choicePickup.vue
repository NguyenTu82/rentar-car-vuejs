<script setup lang="ts">
import { storeToRefs} from 'pinia';
import { numberWithCommas } from '~/common/utils/common';
import { scrollEle } from '~/common/utils/vScroll';
import { useBookingStore } from '../stores/booking';

const { t } = useI18n()

const bookingStore = useBookingStore();
const {listOptions , selectedOption , numberOption , checkPickup , text_notify_user , text_problem_user , boardingPlace , checkErrorInput} = storeToRefs(useBookingStore());

onMounted(() => {

});
watch(checkPickup,(newValue)=>{
	checkPickup.value = newValue;

}, { immediate:true})
watch(text_notify_user,(newValue)=>{
	text_notify_user.value = newValue;

}, { immediate:true})
watch(text_problem_user,(newValue)=>{
	text_problem_user.value = newValue;

}, { immediate:true})

</script>
<template>
	<div  class="option-insurence pickup">
		<h4 v-if="boardingPlace?.pick_up_type == 1">送迎を選ぶ</h4>
        <div v-if="boardingPlace?.pick_up_type == 1" class="custom-option">
            <div class="select-form">
                    <label>
                        <input type="checkbox"  name="insurance" class="m-3 form-check-input" v-model="checkPickup" />
                        <div class="info_Pickup">
                            <div class="meta">
                                <h4 class="title">無料送迎を希望する</h4>
                            </div>
                        </div>
                    </label>
            </div>
        </div>
        <div v-if="checkPickup && boardingPlace?.pick_up_type == 1" class="input_text_notify">
                <h4 class="title__notify">{{ boardingPlace?.pick_up_title }}</h4>
                <input class="user_input_notify" type="text" name="text_notify" :class="{'border__error' : checkErrorInput }" maxlength="50" v-model="text_notify_user" placeholder="必須入力">
        </div>
        <p v-if="checkPickup && checkErrorInput" class="error-message-input" role="alert">
			送迎を希望する場合、入力が必要です 
		</p>
        <div class="problem_user"  v-if="boardingPlace?.show_info_to_station == 1"  >
                <h4 class="title__problem">お店に伝えたい事項</h4>
                <textarea class="user_input_problem" maxlength="300" type="text" v-model="text_problem_user" placeholder="任意入力" name="" id=""  ></textarea>
        </div>
	</div>
</template>
<style scoped lang="scss">
.form-check-input{
    cursor: pointer;
}
.title__problem{
    margin: 12px 0
}
.border__error{
    border: 1px solid red !important;
}
.error-message-input{
    margin-left:8px;
    color: red;
}
.input_text_notify{
    margin-top: 20px;
}
.user_input_notify {
    min-height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    /* box-shadow: 0px 4px 4px rgb(0 0 0 / 25%); */
    justify-content: space-between;
    border: 1px solid #ccc;
    margin: 8px;
    padding-left: 10px;

}
.user_input_problem{
    min-height: 150px;
    width: 100%;
    display: flex;
    align-items: center;
    /* box-shadow: 0px 4px 4px rgb(0 0 0 / 25%); */
    justify-content: space-between;
    border: 1px solid #ccc;
    margin: 8px;
    padding-left: 10px;
}
.custom-option{
    min-height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
    justify-content: space-between;
    border: 1px solid #ccc;
    -webkit-border-radius: 25px;
}
.select-form{
    width: 100%;
    label{
        width: 100%;
        display: flex;
        cursor: pointer;
        justify-content: space-between;
        align-items: center;
        .info_Pickup{
            width: 94%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title{
                margin: 0;
            }
        }
    }
}
</style>
