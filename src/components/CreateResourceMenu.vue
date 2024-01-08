
<template>
    <div class="card flex justify-content-center">
        <Button type="button" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
            <FontAwesomeIcon icon="fa-solid fa-plus"></FontAwesomeIcon>
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
                <a v-else-if="!item.route && (typeof item.render === 'function' ? item.render() : true)" v-ripple
                    :href="item.url" :target="item.target" v-bind="props.action">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </template>
        </Menu>
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
                label: 'Note',
                icon: 'fa-solid fa-pencil',
                route: '/resources/create/note'
            },
        ]
    }
]);

const toggle = (event: any) => {
    menu.value.toggle(event);
};
</script>
