<script setup lang="ts">
import { useUserStore } from "~/users/stores/user";
import { useBookingStore } from "~/booking/stores/booking";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const router = useRouter();
const emit = defineEmits(["logout"]);
const modalContent = ref<HTMLDivElement | null>(null);
const displayModal = ref<Boolean>(true);
const displayModalSucc = ref<Boolean>(false);
const { checkShowModal } = storeToRefs(userStore);
const onClose = () => {
  emit("logout");
};

const onSubmit = async () => {
  await userStore.logoutApi()
  await userStore.logout();
  useBookingStore().resetStateBooking();
  router.push("/");
  displayModal.value = false;
  displayModalSucc.value = true;
  // checkShowModal.value = true;
  // modalSuccess()
};

// const modalSuccess = async () => {
//   const timeOut = setTimeout(() => {
//     emit("logout");
//     displayModalSucc.value = false;
//     checkShowModal.value = false;
//     clearTimeout(timeOut);
//   }, 2000);
// };

onClickOutside(modalContent, () => onClose());
</script>
<template>
  <div v-if="displayModal" class="custom-modal">
    <div class="overlay"></div>
    <div ref="modalContent" class="custom-modal-body">
      <template class="display-modal">
        <div class="custom-modal-content">
          <p>ログアウトします。</p>
          <p>よろしいですか？</p>
        </div>

        <div class="custom-modal-actions">
          <button class="custom-modal-btn custom-modal-close" @click="onClose">
            キャンセル
          </button>
          <button class="custom-modal-btn custom-modal-confirm" @click="onSubmit">
            ログアウト
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-modal {
  .display-modal {
    display: block;
  }
  .custom-modal-content-succc {
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      margin-bottom: 0;
    }
  }
  position: fixed;
}

.custom-modal--align {
  align-items: start;
  .custom-modal-body-mar {
    margin-top: 80px;
  }
}
</style>
