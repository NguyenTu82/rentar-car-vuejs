<script setup lang="ts">
import GA4 from "google-analytics-ga4";
GA4.send("pageview");
</script>
<template>
  <div id="root">
    <main class="container bg_white">
      <RouterView />
    </main>
  </div>
</template>
<style scoped lang="scss">
#root {
  background: #ccc;
}

@media screen and (max-width: 480px) {
  .bg_white {
    background: #fff !important;
  }
}
</style>
