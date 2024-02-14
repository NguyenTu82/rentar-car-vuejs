<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Station } from '~/booking/dtos/station.dto';
import { useBookingStore } from '~/booking/stores/booking';

const props = defineProps<{
	station: Station;
}>();

const { t } = useI18n()
const bookingStore = useBookingStore();
const { boardingPlace, returnPlace } = storeToRefs(bookingStore);

const onOpen = () => {
	if (!boardingPlace.value || !returnPlace.value) {
		bookingStore.updateSelectedStation(props.station);
	}
};
</script>
<template>
	<div class="place__item row">
		<div class="col-12 col-sm-6">
      {{props.station.name_jp}} <br />
      {{props.station.address}}
    </div>
    <div class="col-12 col-sm-6 text-end">
      <button @click="onOpen">{{ t('search.selection') }}</button>
    </div>		
	</div>
</template>
<style lang="scss">
.place__item {
	padding-top: 10px;
  font-size: 14px;
  padding-left: 24px;
  .flex-grow {
    flex-grow: 1;
		word-break: break-word;
  }

  button {
		border-radius: 20px;
    background: #173ab8;
    padding: 3px 10px;
    color: white;
    border: none;
    min-width: 90px;
    margin: 5px 0;
  }
}
</style>
