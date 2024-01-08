<template>
    <div class="w-48">
        <multiselect :value-prop="valueProp" :loading="fetching" v-model="value" :options="optionsVal" :disabled="disabled"
            :searchable="searchable" :clear-on-search="searchable" @search-change="refetchOptions" :filter-results="false"
            @change="selectionChanged" :close-on-select="true" :placeholder="placeholder" :classes="styleClasses" ref=" selectComponent" @open="onOpen" :no-options-text="fetching ? fetchingText : undefined">
            <!-- @ts-ignore -->
            <!-- <template v-for="(_, slot) in $slots" #[slot]="scope">
                <slot :name="slot" v-bind="scope || {}" />
            </template> -->
            <template v-slot:singlelabel="{ value }">
                <div
                    class="text-black text-sm flex items-center h-full max-w-full absolute left-0 top-0 pointer-events-none bg-transparent leading-snug pl-3.5 pr-16 box-border rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-3.5">
                    {{ (value as any)[labelProp] }}
                </div>
            </template>
            <template v-slot:option="{ option }">
                <div class="overflow-ellipsis overflow-hidden block whitespace-nowrap max-w-full text-black text-sm">
                    {{ (option as any)[labelProp] }}
                </div>

            </template>
            <template v-slot:afterlist>
                <div ref="target" style="display:block;height:5px;opacity: 0;">.</div>
            </template>
        </multiselect>
    </div>
</template>

<style>
@import '@vueform/multiselect/themes/tailwind.css';
</style>

<script lang="ts" setup>
import Multiselect from '@vueform/multiselect'
import { computed, ref, defineExpose, type Ref, watch, onMounted } from 'vue';
import { useElementVisibility, useIntersectionObserver } from '@vueuse/core'
import ApiService from '@/services/ApiService';
import type { PaginatedData } from '@/types/paginated-data';
import { useAuthStore } from '@/stores/auth';
const selectComponent = ref(null);
const props = defineProps({
    modelValue: { required: false },
    placeholder: { type: String, default: "Select one" },
    api: { type: String, required: true },
    perPage: { type: Number, default: 10 },
    params: { type: Object, default: () => ({}) },
    valueProp: { type: String, required: true },
    labelProp: { type: String, required: true },
    searchable: { type: Boolean, default: false },
    initLabel: { type: String },
    disabled: { type: Boolean, default: false }
})
const authStore = useAuthStore();
const emit = defineEmits(['update:modelValue', 'infinite-scroll', 'selection-changed'])
const target = ref(null)
const reqExists = ref<null | AbortController>(null);
const targetIsVisible = ref(false)
const page = ref(1)
const init = ref(false)
const optionsVal: Ref<Array<any>> = ref([])
const lastPage = ref(false)
const fetching = ref(false)
const fetchingText = "Fetching Data"
const searchValue = ref("")

const styleClasses = {
    container: 'py-0.5 relative mx-auto w-full flex items-center justify-end box-border cursor-pointer border border-gray-300 rounded bg-white text-base leading-snug outline-none',
    containerDisabled: 'cursor-default bg-gray-100',
    containerOpen: 'rounded-b-none',
    containerOpenTop: 'rounded-t-none',
    containerActive: 'ring ring-green-500 ring-opacity-30',
    wrapper: 'relative mx-auto w-full flex items-center justify-end box-border cursor-pointer outline-none',
    singleLabel: 'flex items-center h-full max-w-full absolute left-0 top-0 pointer-events-none bg-transparent leading-snug pl-3.5 pr-16 box-border rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-3.5',
    singleLabelText: 'overflow-ellipsis overflow-hidden block whitespace-nowrap max-w-full',
    multipleLabel: 'flex items-center h-full absolute left-0 top-0 pointer-events-none bg-transparent leading-snug pl-3.5 rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-3.5',
    search: 'w-full absolute inset-0 outline-none focus:ring-0 appearance-none box-border border-0 text-base font-sans bg-white rounded pl-3.5 rtl:pl-0 rtl:pr-3.5',
    tags: 'flex-grow flex-shrink flex flex-wrap items-center mt-1 pl-2 min-w-0 rtl:pl-0 rtl:pr-2',
    tag: 'bg-green-500 text-white text-sm font-semibold py-0.5 pl-2 rounded mr-1 mb-1 flex items-center whitespace-nowrap min-w-0 rtl:pl-0 rtl:pr-2 rtl:mr-0 rtl:ml-1',
    tagDisabled: 'pr-2 opacity-50 rtl:pl-2',
    tagWrapper: 'whitespace-nowrap overflow-hidden overflow-ellipsis',
    tagWrapperBreak: 'whitespace-normal break-all',
    tagRemove: 'flex items-center justify-center p-1 mx-0.5 rounded-sm hover:bg-black hover:bg-opacity-10 group',
    tagRemoveIcon: 'bg-multiselect-remove bg-center bg-no-repeat opacity-30 inline-block w-3 h-3 group-hover:opacity-60',
    tagsSearchWrapper: 'inline-block relative mx-1 mb-1 flex-grow flex-shrink h-full',
    tagsSearch: 'absolute inset-0 border-0 outline-none focus:ring-0 appearance-none p-0 text-base font-sans box-border w-full',
    tagsSearchCopy: 'invisible whitespace-pre-wrap inline-block h-px',
    placeholder: 'flex items-center h-full absolute left-0 top-0 pointer-events-none bg-transparent leading-snug pl-3.5 text-gray-400 rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-3.5 text-sm',
    caret: 'bg-multiselect-caret bg-center bg-no-repeat w-2.5 h-4 py-px box-content mr-3.5 relative z-10 opacity-40 flex-shrink-0 flex-grow-0 transition-transform transform pointer-events-none rtl:mr-0 rtl:ml-3.5',
    caretOpen: 'rotate-180 pointer-events-auto',
    clear: 'pr-3.5 relative z-10 opacity-40 transition duration-300 flex-shrink-0 flex-grow-0 flex hover:opacity-80 rtl:pr-0 rtl:pl-3.5',
    clearIcon: 'bg-multiselect-remove bg-center bg-no-repeat w-2.5 h-4 py-px box-content inline-block',
    spinner: 'bg-multiselect-spinner bg-center bg-no-repeat w-4 h-4 z-10 mr-3.5 animate-spin flex-shrink-0 flex-grow-0 rtl:mr-0 rtl:ml-3.5',
    infinite: 'flex items-center justify-center w-full',
    infiniteSpinner: 'bg-multiselect-spinner bg-center bg-no-repeat w-4 h-4 z-10 animate-spin flex-shrink-0 flex-grow-0 m-3.5',
    dropdown: 'max-h-60 absolute -left-px -right-px bottom-0 transform translate-y-full border border-gray-300 -mt-px overflow-y-scroll z-50 bg-white flex flex-col rounded-b',
    dropdownTop: '-translate-y-full top-px bottom-auto rounded-b-none rounded-t',
    dropdownHidden: 'hidden',
    options: 'flex flex-col p-0 m-0 list-none',
    optionsTop: '',
    group: 'p-0 m-0',
    groupLabel: 'flex text-sm box-border items-center justify-start text-left py-1 px-3 font-semibold bg-gray-200 cursor-default leading-normal',
    groupLabelPointable: 'cursor-pointer',
    groupLabelPointed: 'bg-gray-300 text-gray-700',
    groupLabelSelected: 'bg-green-600 text-white',
    groupLabelDisabled: 'bg-gray-100 text-gray-300 cursor-not-allowed',
    groupLabelSelectedPointed: 'bg-green-600 text-white opacity-90',
    groupLabelSelectedDisabled: 'text-green-100 bg-green-600 bg-opacity-50 cursor-not-allowed',
    groupOptions: 'p-0 m-0',
    option: 'flex items-center justify-start box-border text-left cursor-pointer text-base leading-snug py-2 px-3',
    optionPointed: 'text-gray-800 bg-pink-300 cursor-pointer',
    optionSelected: 'text-white bg-pink-500',
    optionDisabled: 'text-gray-300 cursor-not-allowed',
    optionSelectedPointed: 'text-white bg-pink-400 opacity-90',
    optionSelectedDisabled: 'text-green-100 bg-green-500 bg-opacity-50 cursor-not-allowed',
    noOptions: 'py-2 px-3 text-gray-600 bg-white text-left rtl:text-right',
    noResults: 'py-2 px-3 text-gray-600 bg-white text-left rtl:text-right',
    fakeInput: 'bg-transparent absolute left-0 right-0 -bottom-px w-full h-px border-0 p-0 appearance-none outline-none text-transparent',
    assist: 'absolute -m-px w-px h-px overflow-hidden',
    spacer: 'h-9 py-px box-content'
};

const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
        targetIsVisible.value = isIntersecting
    },
)

const selectVisible = useElementVisibility(selectComponent)

watch(targetIsVisible, (isTargetVisible) => {
    if (isTargetVisible && !(lastPage.value)) {
        fetchOptions()
    }
});

watch(selectVisible, (isTargetVisible) => {
    if (isTargetVisible) {
        setInitialLabel()
    }
});

const value = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value)
    }
});

const onOpen = async () => {
    if (!lastPage.value) {
        await fetchOptions()
    }

}

const setInitialLabel = () => {
    if (props.initLabel && !init.value) {
        const init: {
            id: any;
            [key: string]: any;
        } = { id: props.modelValue }
        init[props.labelProp as any] = props.initLabel
        optionsVal.value = [init]
    }
}

const refetchOptions = async (query?: string) => {
    clear(String(query))
    await fetchOptions()
}

const clear = (query: string) => {
    optionsVal.value = []
    page.value = 1
    init.value = false
    lastPage.value = false
    searchValue.value = query
    fetching.value = false
}

const fetchOptions = async () => {
    if (fetching.value) return
    if (reqExists.value) {
        reqExists.value.abort()
        reqExists.value = null
    }
    const controller = new AbortController();
    fetching.value = true
    const q = {
        q: ""
    }
    if (searchValue.value) {
        q.q = searchValue.value
    }
    if (page.value == 1) {
        optionsVal.value = []
    }
    return ApiService.query<PaginatedData<{ id: string, label: string }>>(props.api, {
        params: {
            page: page.value,
            per_page: props.perPage,
            ...props.params,
            ...q
        },
        headers: {
            Authorization: authStore.getBearer()
        },
        signal: controller.signal
    }).then((res) => {
        if (!res.data.pages || res.data.pages == page.value) {
            lastPage.value = true
        }
        page.value++
        if (!init.value) {
            init.value = true
        }
        optionsVal.value = [...optionsVal.value, ...res.data.data]
        fetching.value = false
    }).catch(() => {
        console.error("Error fetching data")
        fetching.value = false
    })
}

const selectionChanged = (e: any) => {
    // emit together the id + label in {id: 1, label: 'label'} format
    // find the object
    if (e) {
        const found = optionsVal.value.find((element) => element[props.valueProp] === e);

        if (found) {
            emit('selection-changed', {
                id: e,
                label: found[props.labelProp]
            })
        }
    } else {
        emit('selection-changed', e)
    }
}

defineExpose({ selectComponent, clear, refetchOptions })
export type PaginatedSelectionEvent = {
    id: number | string,
    label: number | string,
}
</script>
  