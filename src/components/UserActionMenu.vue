
<template>
    <div class="card flex justify-center">
        <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"
            class="!h-8 !w-8">
            <FontAwesomeIcon icon="fa-solid fa-ellipsis-vertical"></FontAwesomeIcon>
        </Button>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
            <template #item="{ item, props }">
                <a v-ripple v-if="typeof item.render === 'function' ? item.render() : true" :href="item.url"
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
    user: {
        type: Object as PropType<User>, required: true
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
                label: 'Disable User',
                icon: 'pi pi-refresh',
                render: () => !props.user.deletedAt,
                command: async () => await updateUserStatus(false, props.user, tenantStore.isMain() ? undefined : tenantStore.getTenant())
            },
            {
                label: 'Enable User',
                icon: 'pi pi-refresh',
                render: () => props.user.deletedAt,
                command: async () => await updateUserStatus(true, props.user, tenantStore.isMain() ? undefined : tenantStore.getTenant())
            },
            // {
            //     label: 'Promote To Admin',
            //     icon: 'pi pi-upload',
            //     render: () => props.user.role === "USER" && authStore.isAdmin()
            // },
            // {
            //     label: 'Demote from Admin',
            //     icon: 'pi pi-upload',
            //     render: () => !["USER", "SUPERADMIN"].includes(props.user.role) && authStore.isAdmin()
            // }
        ]
    }
]);

const toggle = (event: any) => {
    menu.value.toggle(event);
};

async function updateUserStatus(enable = true, user: User, tenant?: Tenant) {
    Swal.fire({
        title: "Are you sure?",
        text: `${enable ? 'Enable' : 'Disable'} ${props.user.name} in ${tenant ? tenant.name : 'main'}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await ApiService.post(`/v1/admin/users/${enable ? 'enable' : 'disable'}/${props.user.id}`, {}, {
                    headers: {
                        Authorization: authStore.getBearer()
                    }
                })
                Swal.fire({
                    title: "Success",
                    text: `User ${props.user.name} ${enable ? 'enabled' : 'disabled'} `,
                    icon: "success"
                });
                emits('update');
            } catch (e: any) {
                if (ApiService.isAxiosError(e) && e.response) {
                    toast(e.response.data.message, 'Error', 'error')
                }
            }
        }
    });
    
}
</script>
