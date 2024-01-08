<template>
    <div class="flex text-xl mb-4">
        <div>
            User(s) in <b>{{ tenantStore.getTenant().name }}</b>
        </div>
    </div>
    <Vue3Datatable :rows="rows" :columns="cols" :loading="loading" :totalRows="totalRows" :isServerMode="true"
        :pageSize="params.pagesize" :sortable="true" skin="bh-table-compact" :sortColumn="params.sort_column"
        :sortDirection="params.sort_direction" class="advanced-table whitespace-nowrap"
        @change="paginatedChange($event, params, getResources)">

        <template #status="data">
            <div class="text-black dark:text-white">{{ data.value.deletedAt ? 'Disabled' : 'Enabled' }}</div>
        </template>
        <template #actions="data">
            <div class="flex gap-4">
                <UserActionMenu :user="data.value" @update="getResources()"/>
            </div>
        </template>
    </Vue3Datatable>
</template>
<style>
html.dark .bh-pagination-info>span {
    color: black;
}

html.dark .bh-pagination-info>span {
    color: white;
}
</style>
<script setup lang="ts">
// @ts-expect-error: idk why it doesnt have typing
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { useAuthStore } from '@/stores/auth';
import { onMounted, reactive, ref } from 'vue';
import ApiService from '@/services/ApiService';
import type { PaginatedData } from '@/types/paginated-data';
import { paginatedChange } from '@/utils/pagination';
import { useTenantStore } from '@/stores/tenant';
import UserActionMenu from '@/components/UserActionMenu.vue';

const tenantStore = useTenantStore();
const authStore = useAuthStore();
const loading = ref<Boolean>(false);
const rows: any = ref(null);
const totalRows = ref(0);
const cols =
    ref([
        { field: 'name', title: 'Name', sort: false },
        { field: 'email', title: 'Email', sort: false },
        { field: 'role', title: 'Role', sort: false },
        { field: 'status', title: 'Status', sort: false},
        { field: 'actions', title: 'Actions', sort: false },
    ]) || [];


const params = reactive({
    current_page: 1,
    pagesize: 10,
    sort_column: 'id',
    sort_direction: 'asc',
});

onMounted(() => {
    getResources();
});


const getResources = async (page = 1, limit = 10, sort = 'id', order = 'asc') => {
    try {
        loading.value = true;
        const res = await ApiService.query<PaginatedData<NoteResource>>('/v1/admin/users', {
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

        rows.value = res.data.data;
        totalRows.value = res.data.total;

    } catch (e) {
        //
    }


    loading.value = false;
}

const showResource = (resource: NoteResource) => {
    window.open(`/resources/${resource.id}`, '_blank');
}

</script>
  