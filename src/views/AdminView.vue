<template>
    <div class="w-full flex-grow">
        <div class="container mx-auto px-2 h-full">
            <div class="flex content-center justify-center h-full py-5">
                <div class="w-full px-4">
                    <div class="p-6 bg-slate-200 dark:bg-neutral-800 rounded-lg text-black dark:text-white">
                        <RouterView />
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
</style>
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
  