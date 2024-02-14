<script setup lang="ts">
import GA4 from 'google-analytics-ga4';
GA4.send('pageview');
</script>
<template>
	<div id="root">
		<main class="container">
			<Header />
			<RouterView />
		</main>
	</div>
</template>
<style scoped lang="scss">
#root {
	background: #fff;
}
</style>
