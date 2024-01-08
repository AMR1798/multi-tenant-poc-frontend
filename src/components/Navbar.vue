<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="card">
    <Menubar :model="items" >
      <template #end>
        <div class="flex content-center">
          <DarkMode></DarkMode>
        </div>
      </template>
      <template #item="{ item, props, hasSubmenu }">
        <router-link v-if="item.route && (typeof item.render === 'function' ? item.render() : true)"
          v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <FontAwesomeIcon :icon="String(item.icon)"></FontAwesomeIcon>
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else-if="!item.route && (typeof item.render === 'function' ? item.render() : true)" v-ripple :href="item.url"
          :target="item.target" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <FontAwesomeIcon v-if="hasSubmenu" icon="fa-solid fa-caret-down" class="ml-2" />
        </a>
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Menubar from 'primevue/menubar';
import { useTenantStore } from "@/stores/tenant";
import DarkMode from './DarkMode.vue';

const tenantStore = useTenantStore();
const authStore = useAuthStore();
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAuthStore } from "@/stores/auth";
const user = computed(() => authStore.user);

const items = ref([
  {
    label: `Multi-Tenant POC (${tenantStore.getTenant()?.name})`,
    icon: 'fa-solid fa-building',
    route: '/',
  },
  {
    label: 'About',
    icon: 'fa-solid fa-question',
    route: '/about',
    render: () => {
      return tenantStore.isMain()
    }
  },
  {
    label: 'Resources',
    icon: 'fa-solid fa-file',
    render: () => {
      return (authStore.isAuthed && !tenantStore.isMain()) || tenantStore.isMain()
    },
    route: '/resources'
  },
  {
    label: 'Admin',
    icon: 'fa-solid fa-bolt',
    render: () => {
      return authStore.isAuthed && authStore.isAdmin()
    },
    items: [
      {
        label: 'Manage Users',
        icon: 'fa-solid fa-users',
        route: '/admin/users'
      }
    ]
  },
  {
    label: '',
    icon: 'fa-solid fa-user',
    render: () => {
      return authStore.isAuthed
    },
    items: [
      {
        label: 'Profile',
        icon: 'fa-solid fa-id-card',
        route: '/profile'
      },
      {
        label: 'Logout',
        icon: 'fa-solid fa-right-to-bracket',
        command: () => {
          logout()
        }
      },
    ]
  },
  {
    label: 'Login',
    icon: 'fa-solid fa-right-to-bracket',
    route: '/login',
    render: () => {
      return !authStore.isAuthed
    }
  },
]);

const logout = () => {
  authStore.logout()
}

const showAbout = (resource: NoteResource) => {
  window.open(`/about/${resource.id}`, '_blank');
}
</script>
