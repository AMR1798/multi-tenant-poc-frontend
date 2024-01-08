
<template>
    <div class="card flex">
        <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"
            class="!h-8 !w-8">
            <FontAwesomeIcon icon="fa-solid fa-ellipsis-vertical"></FontAwesomeIcon>
        </Button>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
            <template #item="{ item, props }">
                <router-link v-if="item.route && (typeof item.render === 'function' ? item.render() : true)"
                    v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <FontAwesomeIcon :icon="String(item.icon)"></FontAwesomeIcon>
                        <span class="ml-2">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-ripple v-else-if="typeof item.render === 'function' ? item.render() : true" :href="item.url"
                    :target="item.target" v-bind="props.action">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </template>
        </Menu>
    </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from "vue";
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { User } from "@/types/user";
import { useAuthStore } from "@/stores/auth";
import Swal from "sweetalert2";
import { useTenantStore, type Tenant } from "@/stores/tenant";
import ApiService from "@/services/ApiService";
import toast from "@/utils/toast";

const props = defineProps({
    resource: {
        type: Object as PropType<NoteResource>, required: true
    }
});

const emits = defineEmits(['update'])

const authStore = useAuthStore();
const tenantStore = useTenantStore();
const menu = ref();
const items = ref([
    {
        label: 'Actions',
        items: [
            {
                label: 'View',
                icon: 'fa-solid fa-up-right-from-square',
                render: () => true,
                command: async () => showResource(props.resource)
            },
            {
                label: 'Edit',
                icon: 'fa-solid fa-pencil',
                render: () => authStore.isAdmin() || authStore.user?.id === props.resource.createdBy,
                route: `/resources/update/note/${props.resource.id}`
            },
        ]
    }
]);

const toggle = (event: any) => {
    menu.value.toggle(event);
};

const showResource = (resource: NoteResource) => {
    window.open(`/resources/${resource.id}`, '_blank');
}
</script>
