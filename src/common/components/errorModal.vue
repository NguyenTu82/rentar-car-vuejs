<script setup lang="ts">
import { AUTHEN } from "../utils/constant"

const emit = defineEmits(['closeModalError'])
const modalContent = ref<HTMLDivElement | null>(null)
const router = useRouter();
const valueError = ref('')

const error: any = defineProps({
  resError: String,
  buttonCancel: String
})

onMounted(() => {
  if (error.resError?.includes("\n")) {
    valueError.value = error.resError?.split("\n").join("<br/>") || ''
  } else {
    valueError.value = error.resError?.split("。").join("。<br/>") || ''
  }  
  if (!valueError.value) {
    onClose()
  }
})

const onClose = () => {
  emit('closeModalError')
  if (error.resError === AUTHEN.TEXT_ERROR_AUTHEN) {
    return router.replace('/')
  }
}

// onClickOutside(modalContent, () => onClose())
</script>
<template>
  <div class="custom-modal">
        <div class="overlay"></div>
        <div ref="modalContent" class="custom-modal-body">
          <template class="display-modal">
                <div class="custom-modal-content">
                    <p v-html="valueError" ></p>
                </div>

                <div class="custom-modal-actions">
                    <button class="custom-modal-btn custom-modal-confirm" @click="onClose">{{error?.buttonCancel}}</button>
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
  }
</style>
