
<template>
    <div class="card flex justify-content-center">
        <Button type="button" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
            <FontAwesomeIcon icon="fa-solid fa-plus"></FontAwesomeIcon>
        </Button>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const menu = ref();
const items = ref([
    {
        label: 'Create',
        items: [
            {
                label: 'Refresh',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Export',
                icon: 'pi pi-upload'
            }
        ]
    }
]);

const toggle = (event: any) => {
    menu.value.toggle(event);
};
</script>
