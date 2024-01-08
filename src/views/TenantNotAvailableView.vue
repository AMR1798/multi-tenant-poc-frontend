<script setup lang="ts">
import { onMounted } from 'vue';
import { useTenantStore } from '@/stores/tenant';
import { useRouter } from 'vue-router';

const tenantStore = useTenantStore()
const router = useRouter()
onMounted(() => {
  if (tenantStore.isMain() || tenantStore.getTenant().slug === tenantStore.getTenantSlug()) {
    router.push('/')
  } 
})
</script>

<template>
  <div class="w-full flex-grow">
    <div class="container mx-auto px-2 h-full">
      <div class="flex content-center justify-center h-full py-5">
        <div class="w-full px-4">
          <div class="p-6 bg-slate-200 dark:bg-black rounded-lg">
            <h6
              class="mb-4 block font-sans text-base font-semibold uppercase leading-relaxed tracking-normal text-black dark:text-pink-500 antialiased">
              Not Available
            </h6>
            <p class="mb-8 block font-sans text-base font-normal leading-relaxed text-black dark:text-white antialiased">
              Tenant {{ tenantStore.getTenantSlug() }} is not yet created
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
