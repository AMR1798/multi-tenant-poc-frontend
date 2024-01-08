<template>
    <div class="flex text-xl mb-4">
        <div class="text-black dark:text-white py-2 my-2 flex-grow text-2xl align-middle self-center">
            Resources
        </div>
        <div v-if="authStore.isAuthed" class="text-right justify-items-end self-center">
            <CreateResourceMenu></CreateResourceMenu>
        </div>

    </div>
    <Vue3Datatable :rows="rows" :columns="cols" :loading="loading" :totalRows="totalRows" :isServerMode="true"
        :pageSize="params.pagesize" :sortable="true" skin="bh-table-compact" :sortColumn="params.sort_column"
        :sortDirection="params.sort_direction" class="advanced-table whitespace-nowrap"
        @change="paginatedChange($event, params, getResources)">

        <template #title="data">
            <div class="text-black dark:text-white">{{ data.value.title }}</div>
        </template>
        <template #type="data">
            <div class="text-black dark:text-white">{{ data.value.type }}</div>
        </template>
        <template #by="data">
            <div class="text-black dark:text-white">{{ data.value.user.name }}</div>
        </template>
        <template #access="data">
            <div class="text-black dark:text-white">
                <font-awesome-icon v-if="data.value.access === 'PRIVATE'" icon="fa-solid fa-lock" />
                <font-awesome-icon v-if="data.value.access === 'TENANT'" icon="fa-solid fa-building" />
                <font-awesome-icon v-if="data.value.access === 'PUBLIC'" icon="fa-solid fa-globe" />
            </div>
        </template>
        <template #createdAt="data">
            <div class="text-black dark:text-white">{{ data.value.createdAt }}</div>
        </template>
        <template #actions="data">
            <ResourceActionMenu :resource="data.value"></ResourceActionMenu>
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
import { type PaginatedData } from '@/types/paginated-data';
import { paginatedChange } from '@/utils/pagination';
import CreateResourceMenu from '@/components/CreateResourceMenu.vue';
import ResourceActionMenu from '@/components/ResourceActionMenu.vue';

const authStore = useAuthStore();
const loading = ref<Boolean>(false);
const rows: any = ref(null);
const totalRows = ref(0);
const cols =
    ref([
        { field: 'title', title: 'Title', sort: false },
        { field: 'type', title: 'Type', sort: false },
        { field: 'by', title: 'By', sort: false },
        { field: 'access', title: 'Access', sort: false },
        { field: 'createdAt', title: 'Created At', sort: false },
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
        const res = await ApiService.query<PaginatedData<NoteResource>>('/v1/api/resources', {
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



</script>
  