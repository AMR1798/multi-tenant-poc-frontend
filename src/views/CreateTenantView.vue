<template>
    <div class="w-full flex-grow">
        <div class="absolute top-0 w-full bg-gray-900" style="background-size: 100%; background-repeat: no-repeat;"
            :style="{ 'background-image': 'url(' + '../assets/img/register_bg_2.png' + ')' }"></div>
        <div class="container mx-auto px-4 h-full">
            <div class="flex content-center items-center justify-center h-full">
                <div class="w-full lg:w-4/5 px-4">
                    <div
                        class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
                        <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <div class="text-gray-700 text-center mb-3 font-bold uppercase py-5">
                                Create New Tenant
                            </div>
                            <Form :validation-schema="schema" @submit="create">
                                <div class="relative w-full mb-3">
                                    <label class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                        for="grid-password">Domain Slug</label>
                                    <div class="flex">
                                        <Field type="text" class="form-control" placeholder="" name="slug" v-model="slug"
                                            v-slot="{ field }">
                                            <input type="text" v-model="slug" v-debounce:500="checkSlug" autocomplete="off" 
                                                class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded-s text-sm shadow focus:outline-none w-full lowercase"
                                                placeholder="Subdomain" style="transition: all 0.15s ease 0s;"
                                                v-bind="field" />
                                        </Field>
                                        <span
                                            class="flex items-center px-3 py-3 text-sm border-0 border-gray-300 placeholder-gray-400 text-gray-700 bg-white shadow">
                                            {{ baseDomain }}
                                        </span>
                                        <span v-if="validating"
                                            class="flex items-center px-3 py-3 text-sm border-0 border-gray-300 placeholder-gray-400 text-gray-700 bg-white shadow">
                                            <svg class="animate-spin h-5 w-5 text-neutral-800"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                        </span>
                                        <span v-else class="flex">
                                            <span
                                                class="flex items-center px-3 py-3 text-sm border-0 border-gray-300 rounded-e placeholder-gray-400 text-gray-700 shadow"
                                                :class="validatedSlug ? 'bg-green-200' : 'bg-red-200'">
                                                <font-awesome-icon
                                                    :icon="validatedSlug ? 'fa-solid fa-square-check' : 'fa-solid fa-square-xmark'"
                                                    class="mx-1 text-lg"
                                                    :class="validatedSlug ? 'text-green-500' : 'text-red-500'" />
                                            </span>
                                        </span>

                                    </div>
                                    <ErrorMessage name="slug" class="text-red-500" />
                                </div>
                                <Field name="validatedSlug" v-model="validatedSlug" v-slot="{ }" type="hidden">
                                </Field>
                                <div class="relative w-full mb-3">
                                    <label class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                        for="grid-password">Tenant Name</label>
                                    <Field type="text" v-model="tenantName" name="tenantName"
                                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                        placeholder="Name" style="transition: all 0.15s ease 0s;" />
                                    <ErrorMessage name="tenantName" class="text-red-500" />
                                </div>
                                <ErrorMessage name="validatedSlug" class="text-red-500 my-2" />
                                <div class="text-center mt-6">
                                    <button
                                        class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                                        type="submit" style="transition: all 0.15s ease 0s;">
                                        Create
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                    <div class="flex flex-wrap mt-6 text-black dark:text-white">
                        <div class="w-1/2">
                            <a to="#" class=""><small>amrmzkr</small></a>
                        </div>
                        <div class="w-1/2 text-right">
                            <!-- <RouterLink to="/register" class=""><small>Join Public Tenants</small></RouterLink> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useTenantStore } from '@/stores/tenant';
import toast from '@/utils/toast';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const tenantStore = useTenantStore()
const authStore = useAuthStore()

const baseDomain = import.meta.env.VITE_APP_DOMAIN

const tenantName = ref('');
const slug = ref('');
const validatedSlug = ref(false);
const validating = ref(false);
const router = useRouter(); 


const schema = yup.object({
    slug: yup.string().required().matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug should only contain characters, numbers and dashes and be not more than 12 characters'
    ).label('Subdomain slug').max(12, 'Slug should not be more than 12 characters').min(3, 'Slug should be more than 3'),
    tenantName: yup.string().required().label('Tenant name'),
    validatedSlug: yup.boolean().oneOf([true], 'Subdomain slug must be validated')
});

async function create() {
    const res = await tenantStore.createTenant(slug.value, tenantName.value)
    if (!res) {
        toast('failed to create tenant', 'Error', 'error')
        return
    }

    toast(`tenant ${tenantName.value} created`, 'Success', 'success')
    router.push('/profile')
}

async function checkSlug() {
    validating.value = true
    validatedSlug.value = false
    // hehe i want to show it's loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    // send api call to check if slug already exists
    validatedSlug.value = await tenantStore.checkSlug(slug.value)
    validating.value = false
}
</script>
  