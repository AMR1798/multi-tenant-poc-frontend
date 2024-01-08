<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useTenantStore } from '@/stores/tenant';

const tenantStore = useTenantStore()
const authStore = useAuthStore();
</script>

<template>
  <div class="w-full flex-grow">
    <div class="container mx-auto px-2 h-full">
      <div class="flex content-center justify-center h-full py-5">
        <div class="w-full px-4">
          <div class="p-6 bg-slate-200 dark:bg-neutral-800 rounded-lg">
            <h6
              class="mb-4 block font-sans text-base font-semibold uppercase leading-relaxed tracking-normal text-black dark:text-pink-500 antialiased">
              Home Page
            </h6>
            <p v-if="authStore.isAuthed" class="mb-8 block font-sans text-base font-normal leading-relaxed text-black dark:text-white antialiased">
              Hello {{authStore.user?.name}}
            </p>
            <p class="mb-8 block font-sans text-base font-normal leading-relaxed text-black dark:text-white antialiased">
              You are currently viewing home page for {{tenantStore.getTenant().name}}
            </p>

            <p v-if="tenantStore.isMain() && authStore.isAuthed" class="mb-8 block font-sans text-base font-normal leading-relaxed text-black dark:text-white antialiased">
              Check your profile to see a list of or manage tenants you're part 
            </p>

            <p class="mb-8 block font-sans text-base font-normal leading-relaxed text-black dark:text-white antialiased">
              Disclaimer: any contents created by users in this website are fictionals and does not associate with the owner of this site. 
              This site purpose is to showcase proof of concept only and are not meant to be a production site for content creation. 
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
