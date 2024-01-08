<!-- eslint-disable vue/require-v-for-key -->
<template>
    <div>
        <Form v-slot="{ validate, errors }" :validation-schema="validationSchema" @submit="create">
            <div v-if="Object.keys(errors).length > 0" class="bg-red-500 dark:bg-red-600/[.7] p-3 mb-3 rounded-lg">
                <li v-for="value in errors" class="text-white">
                    {{ value }}
                </li>
            </div>

            <div class="mb-4">
                <div class="flex flex-wrap">
                    <div class="flex-grow mb-4 mr-4">
                        <label class="block uppercase text-gray-700 dark:text-white text-xs font-bold mb-2"
                            for="grid-password">Title</label>
                        <Field type="text" v-model="title" name="title" maxlength="100"
                            class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Title" style="transition: all 0.15s ease 0s;" />
                    </div>
                    <div class="mb-4">
                        <label class="block uppercase text-gray-700 dark:text-white text-xs font-bold mb-2"
                            for="grid-password">Access</label>
                        <Field name="access" v-model="access" v-slot="{ field }">
                            <PaginatedSelect value-prop="id" label-prop="label" v-model="field.value" v-bind="field"
                                :api="'/v1/api/meta/access'" placeholder="Select Access" name="access">
                            </PaginatedSelect>
                        </Field>

                    </div>
                </div>

            </div>
            <div>
                <Field name="content" v-model="contentDelta" v-slot="{ field }">
                    <QuillEditor v-bind="field" theme="snow" v-model:content="contentDelta" @text-change="validate"
                        :modules="modules" ref="editorRef" :content-type="(contentType)" />
                </Field>
            </div>
            <div class="flex mt-4">
                <div class="flex-grow text-right">
                    <button
                        class="bg-green-600  text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                        type="submit" style="transition: all 0.15s ease 0s;">
                        Create
                        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                    </button>
                </div>
            </div>
        </Form>
    </div>
</template>
<script setup lang="ts">
import { Delta, Quill, QuillEditor } from '@vueup/vue-quill'
import BlotFormatter from 'quill-blot-formatter'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { ref } from 'vue';
import PaginatedSelect from '@/components/PaginatedSelect.vue';
import * as yup from 'yup';
import ApiService from '@/services/ApiService';
import { useAuthStore } from '@/stores/auth';
import toast from '@/utils/toast';
import { useRouter } from 'vue-router';

const modules = {
    name: 'blotFormatter',
    module: BlotFormatter,
    options: {/* options */ }
}

const authStore = useAuthStore();
const router = useRouter();
const editorRef = ref<InstanceType<typeof QuillEditor>>();

const title = ref('');
const access = ref();
const contentType = ref<"delta" | "html" | "text">("delta")
const contentDelta = ref(new Delta());

const validationSchema = yup.object({
    title: yup.string().required().min(3).label('Title'),
    access: yup.string().required().oneOf(['PUBLIC', 'PRIVATE', 'TENANT']).label('Access type'),
    contentDelta: yup.string().test({
        name: 'not-empty',
        test: () => getQuill() ? getQuill()?.root.innerText.replace(/(\r\n|\n|\r|\s)/gm, "") !== "" : false,
        message: 'Content should not be empty'
    })
})

function getQuill() {
    try {
        return (editorRef.value)?.getQuill() as Quill
    } catch (e) {
        return undefined
    }
}

async function create() {
    console.log('creating', title, access, contentDelta)

    const submit = {
        title: title.value,
        access: access.value,
        delta: getQuill()?.getContents(),
        content: getQuill()?.root.innerHTML,
        type: 'NOTE'
    }

    try {
        const res = await ApiService.post<NoteResource>('/v1/api/resources', submit, {
            headers: {
                Authorization: authStore.getBearer()
            }
        })

        if (res.status === 201) {
            toast('Note succesfully created', 'Nice', 'success')
            router.push(`/resources/${res.data.id}`)
        } else {
            throw Error('what teh dog doin')
        }
    } catch (e) {
        toast('Error submitting note', 'Uh oh!', 'error')
    }
}
</script>
<style>
.ql-toolbar {
    background: white;
}
</style>
  