<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { STATUS } from '~/common/dtos/base-output.dto';
import { useUserLoginStore } from '~/users/stores/userLogin';

const { t } = useI18n()
const { data } = storeToRefs(useUserLoginStore());

const errorMessage = computed(() => {
	return data.value.status === STATUS.ERROR && data.value.message.length > 0 ? data.value.message : '';
});
</script>

<template>
	<div class="main">
		<div class="flex-fill d-flex">
			<div class="container flex-fill">
				<div class="row">
					<div class="container_left">
						<Login />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
.main {
	margin-top: 2rem;
}
</style>