<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <nav
      class="top-0 relative z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 bg-neutral-700 dark:bg-neutral-700">
      <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <RouterLink v-if='tenantStore.isEnabled()' to="/" class="text-sm inline-block mr-4 py-2 whitespace-nowrap uppercase text-white dark:text-white font-black">
            <span>Multi-tenant POC</span> <span>({{ tenantStore.getTenant()?.name }})</span>
          </RouterLink>
          <a v-else class="text-sm inline-block mr-4 py-2 whitespace-nowrap uppercase text-white dark:text-white font-black">
            <span>Multi-tenant POC</span>
          </a>
          <button
            class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button" v-on:click="toggleNavbar()">
            <i class="text-white fas fa-bars"></i>
          </button>
        </div>
        <div class="lg:flex flex-grow items-center bg-transparent lg:shadow-none"
          v-bind:class="{ 'hidden': !showMenu, 'block': showMenu }">
          <ul class="flex flex-col lg:flex-row list-none mr-auto">
            
          </ul>
          <ul class="flex flex-col lg:flex-row list-none lg:ml-auto">
            <li class="flex items-center">
              <DarkMode></DarkMode>
            </li>
            <li class="flex items-center" v-if="authStore.isAuthed && !tenantStore.isMain()">
              <RouterLink class="text-white px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                to="/resources">
                <span
                  class="inline-block ml-2">Resources</span></RouterLink>
            </li>
            <li class="flex items-center" v-if="authStore.isAuthed && tenantStore.isMain()">
              <RouterLink class="text-white px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                to="/create/tenant">
                <span
                  class="inline-block ml-2">Create Tenant</span></RouterLink>
            </li>
            <li class="flex items-center" v-if="authStore.isAuthed">
              <RouterLink class="text-white px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                to="/profile">
                <span
                  class="inline-block ml-2">{{authStore.user?.name}}</span></RouterLink>
            </li>
            <!-- <li class="flex items-center">
              <a class="lg:text-white lg:hover:text-gray-300 text-gray-800 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                href="#pablo"><i class="lg:text-gray-300 text-gray-500 fab fa-twitter text-lg leading-lg "></i><span
                  class="lg:hidden inline-block ml-2">Tweet</span></a>
            </li>
            <li class="flex items-center">
              <a class="lg:text-white lg:hover:text-gray-300 text-gray-800 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                href="#pablo"><i class="lg:text-gray-300 text-gray-500 fab fa-github text-lg leading-lg "></i><span
                  class="lg:hidden inline-block ml-2">Star</span></a>
            </li> -->
            <li class="flex items-center" v-if="!authStore.isAuthed">
              <RouterLink to="/login"
                class="bg-white text-gray-800 active:bg-gray-100 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3"
                type="button" style="transition: all 0.15s ease 0s;">
                <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="mr-2"/>
                Login
              </RouterLink>
            </li>
            <li class="flex items-center" v-else>
              <button @click="logout"
                class="bg-white text-gray-800 active:bg-gray-100 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3"
                type="button" style="transition: all 0.15s ease 0s;">
                Logout<font-awesome-icon icon="fa-solid fa-right-to-bracket" class="ml-2" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import DarkMode from './DarkMode.vue';
import { useAuthStore } from '@/stores/auth';

const showMenu = ref(false);
const tenantStore = useTenantStore();
const authStore = useAuthStore();
const toggleNavbar = () => {
  showMenu.value = !showMenu.value;
}

const logout = () => {
  authStore.logout()
}
</script>
