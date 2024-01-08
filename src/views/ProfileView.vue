<template>
    <div class="w-full flex-grow">
        <div class="container mx-auto px-2 h-full">
            <div class="flex content-center justify-center h-full py-5">
                <div class="w-full px-4">
                    <div class="p-6 bg-slate-200 dark:bg-neutral-800 rounded-lg">
                        <h6
                            class="mb-4 block font-sans text-base font-semibold uppercase leading-relaxed tracking-normal text-black dark:text-pink-500 antialiased">
                            Profile
                        </h6>
                        <p
                            class="mb-8 block font-sans text-base font-normal leading-relaxed text-black dark:text-white antialiased">
                            {{ authStore.user?.name }}
                        </p>
                        <div class="text-black dark:text-white bg-slate-300 dark:bg-neutral-700 p-5 my-2 rounded-lg">You are
                            viewing from {{ tenantStore.getTenant().name }} as role {{ authStore.user?.role }}</div>
                        <div v-if="tenantStore.isMain()" class="">
                            <div class="flex">
                                <div
                                    class="text-black dark:text-white py-2 my-2 flex-grow text-2xl align-middle self-center">
                                    Tenants
                                </div>
                                <div class="mr-2 py-2 my-2">
                                    <CreateTenantMenu></CreateTenantMenu>
                                </div>
                            </div>

                            <Vue3Datatable :rows="rows" :columns="allCols" :loading="loading" :totalRows="totalRows"
                                :isServerMode="true" :pageSize="params.pagesize" :sortable="true" skin="bh-table-compact"
                                :sortColumn="params.sort_column" :sortDirection="params.sort_direction"
                                class="advanced-table whitespace-nowrap"
                                @change="paginatedChange($event, params, getTenants)">

                                <template #id="data">
                                    <div class="text-black dark:text-white">{{ data.value['id'] }}</div>
                                </template>
                                <template #name="data">
                                    <div class="text-black dark:text-white">{{ data.value['name'] }}</div>
                                </template>
                                <template #slug="data">
                                    <div class="text-black dark:text-white">{{ data.value['slug'] }}</div>
                                </template>
                                <template #role="data">
                                    <div class="text-black dark:text-white">{{ data.value['role'] }}</div>
                                </template>
                                <template #joinedAt="data">
                                    <div class="text-black dark:text-white">{{ data.value['joinedAt'] }}</div>
                                </template>
                                <template #enable="data">
                                    <span
                                        class="capitalize bg-green-700 text-green-100 text-sm font-medium me-2 !px-2.5 !py-1 rounded dark:bg-green-900 dark:text-green-300">
                                        {{ data.value['enable'] }}
                                    </span>
                                </template>
                                <template #actions="data">
                                    <div class="flex gap-4">
                                        <button type="button" @click="openTenant(data.value['slug'])"
                                            class="btn !py-1 rounded-md bg-green-600 px-2 text-sm text-white dark:text-white">
                                            <span class="mr-2">View</span>
                                            <font-awesome-icon icon="fa-solid fa-up-right-from-square" />
                                        </button>
                                    </div>
                                </template>
                            </Vue3Datatable>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
html.dark .bh-pagination-info>span {
    color: black;
}

html.dark .bh-pagination-info>span {
    color: white;
}

html.dark div>table>tbody>tr>td {
    color: white;
}
</style>
<script setup lang="ts">
// @ts-expect-error: idk why it doesnt have typing
import Vue3Datatable from '@bhplugin/vue3-datatable';
import SpeedDial from 'primevue/speeddial';
import { useAuthStore } from '@/stores/auth';
import { onMounted, reactive, ref } from 'vue';
import ApiService from '@/services/ApiService';
import type { PaginatedData } from '@/types/paginated-data';
import { useTenantStore } from '@/stores/tenant';
import type GetQuery from '@/types/get-query.interface';
import type { PaginationParams } from '@/types/pagination-params';
import { paginatedChange } from '@/utils/pagination';
import { useToast } from 'primevue/usetoast';
import CreateTenantMenu from '@/components/CreateTenantMenu.vue';

const authStore = useAuthStore();
const tenantStore = useTenantStore();
const loading = ref<Boolean>(false);
const rows: any = ref(null);
const totalRows = ref(0);
const toast = useToast();
const cols =
    ref([
        { field: 'id', title: 'ID', isUnique: true, sort: true },
        { field: 'name', title: 'Name', sort: false },
        { field: 'slug', title: 'Domain', sort: false },
        { field: 'enable', title: 'Enabled', sort: false },
        { field: 'role', title: 'Role', sort: false },
        { field: 'joinedAt', title: 'Join Date', sort: true },
    ]) || [];
const allCols = ref([
    ...cols.value,
    { field: 'actions', title: 'Actions', sort: false }
])

const items = ref([
    {
        label: 'Add',
        icon: 'fa-solid fa-pencil',
        command: () => {
            toast.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
        }
    },
])


const params = reactive<PaginationParams>({
    current_page: 1,
    pagesize: 10,
    sort_column: 'id',
    sort_direction: 'asc',
});

onMounted(() => {
    // first fetch
    getTenants();
});

interface ProfileTenant {
    id: number;
    name: string;
    slug: string;
    enable: boolean;
    role: "ADMIN" | "USER";
    joinedAt: Date;
}

const getTenants: GetQuery = async (page = 1, limit = 10, sort = 'id', order = 'asc') => {
    try {
        loading.value = true;
        const res = await ApiService.query<PaginatedData<ProfileTenant>>('/v1/api/profile/tenants', {
            headers: {
                Authorization: authStore.getBearer()
            },
            params: {
                page,
                limit,
                sort,
                order
            }
        })
        await new Promise(resolve => setTimeout(resolve, 1000));
        rows.value = res.data.data;
        totalRows.value = res.data.total;

    } catch (e) {
        //
    }
    loading.value = false;
}

const openTenant = (slug: string) => {
    // get tenant slug
    // get base domain
    const baseDomain = import.meta.env.VITE_APP_DOMAIN
    window.open(`//${slug}.${baseDomain}`, '_blank');
}

</script>
  