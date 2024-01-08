import { ref, type Ref } from 'vue';

export function componentRef2<T extends abstract new (...args: unknown[]) => unknown>(): Ref<InstanceType<T> | undefined>{
    return ref<InstanceType <T>>();
}

export function componentRef<T extends abstract new (...args: unknown[]) => unknown>(param: T): Ref<InstanceType<T>>{
    return ref<InstanceType <typeof param>>() as Ref<InstanceType<T>>
}
