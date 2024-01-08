<template>
  <div class="w-full flex-grow">
    <div class="container mx-auto px-2 h-full">
      <div class="flex content-center justify-center h-full py-5">
        <div class="w-full px-4">
          <div v-if="!verified">
            <div v-if="!verifying" class="p-6 bg-slate-200 dark:bg-neutral-800 rounded-lg text-black dark:text-white">
              <div class="py-3">
                Stahp! You need to verify your account before you can proceed.
              </div>
              <div class="py-3 flex">
                <div>
                  <button @click.prevent="sendVerification"
                    class="flex bg-gray-900 dark:bg-slate-200 text-white dark:text-black active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 gap-2"
                    type="button" style="transition: all 0.15s ease 0s;">
                    <div class="flex items-center h-5">
                      <FontAwesomeIcon icon="fa-solid fa-envelope" class="mr-2"></FontAwesomeIcon>
                    </div>

                    <div class="flex items-center">Send Verification</div>

                    <div v-if="loading" class="flex items-center">
                      <svg class="animate-spin ml-1 h-5 w-5 " xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                    </div>
                    <div v-if="emailSent" class="flex items-center h-5 ml-2">
                      <FontAwesomeIcon icon="fa-solid fa-check" class="mr-2 text-green-400"></FontAwesomeIcon>
                    </div>
                  </button>
                </div>


              </div>
              <p class="py-3">
                Click the link in your email to verify your account.
              </p>
            </div>
            <div v-else class="p-6 bg-slate-200 dark:bg-neutral-800 rounded-lg">
              <div class="py-3 flex">
                Verifying your account
                <svg class="animate-spin ml-1 h-5 w-5 " xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </div>

            </div>
          </div>
          <div v-else>
            <div v-if="!verifying" class="p-6 bg-slate-200 dark:bg-neutral-800 rounded-lg">
              <div class="py-3 text-black dark:text-white">
                Account verified 🎉
                You may continue to use the site
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ApiService from '@/services/ApiService';
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import toast from '@/utils/toast';

const authStore = useAuthStore();
const router = useRouter();
const enabled = ref(true);
const loading = ref(false);
const emailSent = ref(false);
const route = useRoute();
const verifying = ref(false);
const verified = ref(false);



onMounted(() => {
  if (authStore.user?.isEmailVerified) {
    router.push('/')
  }
  const token = route.query.token
  console.log(token);
  if (token) {
    verifyToken(String(token))
  }
})

async function verifyToken(token: string) {
  verifying.value = true;
  // await new Promise(resolve => setTimeout(resolve, 2000));
  try {
    await ApiService.post('/v1/api/auth/verify-email', {
      token,
    } )
    await authStore.initToken();
    verified.value = true;
  } catch (e: any) {
    if (ApiService.isAxiosError(e) && e.response) {
      toast(e.response.data.message, 'Api Error', 'error')
    } else {
      toast('Something went wrong', 'Error', 'error')
    }
  } finally {
    verifying.value = false;
  }
}

async function sendVerification() {
  // const res = ApiService.post
  loading.value = true;
  // await new Promise(resolve => setTimeout(resolve, 2000));
  try {
    const res = await ApiService.post('/v1/api/auth/send-verification-email', {}, {
      headers: {
        Authorization: authStore.getBearer()
      }
    });
    emailSent.value = true;
  } catch (e: any) {
    if (ApiService.isAxiosError(e) && e.response) {
      toast(e.response.data.message, 'Api Error', 'error')
    }
  } finally {
    loading.value = false;
  }


}
</script>
