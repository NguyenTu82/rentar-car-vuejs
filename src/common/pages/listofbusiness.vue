<script setup lang="ts">
import { STATUS } from "../dtos/base-output.dto";
import CommonService from "../services/CommonService";
import { Commercial } from "../dtos/specified-commercial-transaction.dto";
import {useCommercialStore} from "~/common/store/SpecifiedCommercial"
import { storeToRefs } from "pinia";
import { useDownloadStore } from "~/users/stores/download";
import { useCommonStore } from "../store/CommonStore";
const { checkShowDownLoadUqey } = storeToRefs(useDownloadStore());
const { isMobile } = storeToRefs(useCommonStore());
const router = useRouter();
const commercialList = ref<Array<Commercial>>([]);
const { listCommercial } = storeToRefs(useCommercialStore())
const userCommerStore = useCommercialStore()
onMounted(() => {
    if(listCommercial.value.length == 0){
        userCommerStore.getCommercial()
    }
//   CommonService.getSpecifiedCommercialTransaction().then((response) => {
//     if (response.status === STATUS.SUCCESS) {
//       commercialList.value = response.data
//       console.log("response.data", response.data);
//       console.log("commercialList.value", commercialList.value);

//     }
//   });
});

function backhomebutton() {
  router.push({
    path: "/",
    query: {},
  });
}
</script>
<template>
  <main class="single-page" :class="{mg_top__info_listbusiness: checkShowDownLoadUqey && isMobile}">
      <h5 class="title_business">
        特定商取引法に基づく表記 <br />
        (Uqeyで利用可能なレンタカー事業者一覧)
      </h5>
      <div class="list_business">
        <div class="name_business" v-for="(commercial,index) in listCommercial" :key="index">
          <img src="/icons/item.svg"  class="img__logo" alt="" />
          <a :href="commercial.url" target="_blank" >{{commercial.name}}</a>
        </div>
      </div>
      <div class="backhome">
        <button class="action_back" @click="backhomebutton">前の画面へ戻る</button>
      </div>
  </main>
</template>
<style scoped lang="scss">
.mg_top__info_listbusiness{
  @media screen and (max-width: 480px) {
    margin-top: 180px !important;
  }
}
.single-page {
  margin-top: 90px;
  .title_business {
    text-align: center;
    color: #2d419a;
  }
  .list_business {
    display: flex;
    flex-direction: column;
    width: 20%;
    margin: 0 auto;
    .name_business {
    margin-left: 20%;
      img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
      a {
        color: #545ddc;
        text-decoration: underline;
      }
    }
    @media screen and (max-width: 480px) {
      width: 100%;
    }
  }
  .backhome {
    display: flex;
    margin-top: 50px;
    justify-content: center;
    .action_back {
      padding: 2px 30px;
      background-color: #173ab8;
      color: #fff;
      border: none;
      border-radius: 999px;
      font-size: 18px;
    }
  }
}
</style>
<route lang="yaml">
meta:
  layout: default
</route>
