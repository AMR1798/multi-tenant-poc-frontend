<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue';
import { computed, onMounted, ref } from 'vue';
import { useTenantStore } from './stores/tenant';
import { useDark } from '@vueuse/core';
import { useAuthStore } from './stores/auth';
import LoadingPageSpinner from './components/LoadingPageSpinner.vue';

const firstPageLoad = ref(true);
const tenantStore = useTenantStore();
const authStore = useAuthStore();
const loaded = ref(false);
const router = useRouter();
const hideNav  = computed(() => {
  return router.currentRoute.value.meta?.showNavbar ? true : false
})
onMounted(async () => {
  // initialize dark
  useDark()
  if (firstPageLoad.value) {
    // await tenantStore.initTenant()
    // await authStore.initAuth()
    await new Promise(resolve => setTimeout(resolve, 1000));
    loaded.value = true;
  }

});
</script>

<template>
  <div></div>
  <div v-if="loaded" class="flex flex-col min-h-screen bg-white dark:bg-neutral-900">
    <Navbar v-if="!hideNav"/>
    <RouterView />
  </div>
  <div v-else class="flex flex-col min-h-screen bg-white dark:bg-slate-900">
<LoadingPageSpinner></LoadingPageSpinner>
  </div>
</template>

<style>
#app {
  width: 100vw;
  min-height: 100vh;
}
</style>


