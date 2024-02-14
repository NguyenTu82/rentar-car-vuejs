<script setup lang="ts">
import { isDark, preferredDark } from '~/common/composables'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Uqey',
  meta: [
    { name: 'description', content: 'Uqey Rent Car' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/uqey.png',
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
