<script setup lang="ts">
import { NUMBER } from '../utils/constant';

const emit = defineEmits(['currentPage'])

const props = defineProps({
  totalItems: {},
  curPage : Number,
})

const onClickHandler = (page: any) => {
  emit('currentPage', page)
}
</script>

<template>
  <div class="paginate__cus">
    <VueAwesomePaginate
      :key="props.curPage"
      :total-items="props.totalItems"
      :items-per-page="NUMBER.LIMMIT_PAGE"
      :max-pages-shown="NUMBER.PAGE_SHOW"
      :current-page="props.curPage"
      :on-click="onClickHandler"
    />
  </div>
</template>

<style lang="scss">
.paginate__cus {
  margin: 8px 0;
  width: 100%;
  display: flex;
  justify-content: end;
}
.pagination-container {
  column-gap: 10px;
}
.paginate-buttons {
  height: 30px;
  width: 30px;
  border-radius: 4px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}
.paginate-buttons:hover {
  background-color: #d8d8d8;
}
.active-page {
  background-color: blue;
  border: 1px solid blue;
  color: white;
}
.active-page:hover {
  background-color: blue;
}
.back-button:active, .next-button:active {
  background-color: #c4c4c4;
}
</style>
