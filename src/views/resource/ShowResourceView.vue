<template>
    <div>
        <div class="text-black dark:text-white text-xl">
            {{ resource?.title }}
        </div>
        <div class="text-black dark:text-white text-xs mt-2">
            Written by {{ resource?.user.name }} @ {{ formatDateString(resource?.createdAt) }}
        </div>
        <hr>
        <div class="text-black dark:text-white mt-7">
            <p v-html="resource?.note.content"></p>
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
</style>
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';
import ApiService from '@/services/ApiService';
import { useRoute, useRouter } from 'vue-router';
import toast from '@/utils/toast';
import { formatDateString } from '@/utils/datetime';

const route = useRoute();
const router = useRouter();
const loading = ref<Boolean>(false);
const resource = ref<NoteResource>();
const authStore = useAuthStore();

onMounted(() => {
    const resourceId = route.name === "about" ? '0' : route.params.id
    console.log(resourceId);
    if (!resourceId || !((typeof resourceId) === 'string')) {
        toast('Invalid resource', 'Error', 'error')
        router.push('/');
    }
    getResource(String(resourceId));
});


const getResource = async (resourceId: string) => {
    loading.value = false

    try {
        const res = await ApiService.get<NoteResource>('/v1/api/resources', resourceId, {
            headers: {
                Authorization: authStore.getBearer()
            }
        })
        resource.value = res.data
    } catch (e) {
        toast('Failed to fetch resource', 'Error', 'error')
        router.push('/');
    }

    loading.value = false

}

</script>
  