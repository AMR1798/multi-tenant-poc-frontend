import './assets/main.css'
import "@fortawesome/fontawesome-free/css/all.min.css";
import '@bhplugin/vue3-datatable/dist/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Ripple from 'primevue/ripple';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';
import SpeedDial from 'primevue/speeddial';
// @ts-ignore
import Lara from '@/presets/lara';

// @ts-expect-error
import { vue3Debounce } from 'vue-debounce';

import App from './App.vue'
import router from './router'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
    faUserSecret,
    faUpRightFromSquare,
    faRightToBracket,
    faCheckSquare,
    faSquareXmark,
    faLock,
    faBuilding,
    faGlobe,
    faPenToSquare,
    faHouse,
    faBolt,
    faIdCard,
    faFile,
    faPencil,
    faQuestion,
    faCaretDown,
    faPlus,
    faUsers,
    faEllipsisV,
    faEnvelope,
    faCheck,
} from '@fortawesome/free-solid-svg-icons'
import ApiService from '@/services/ApiService';
import { useAuthStore } from './stores/auth';
import { useTenantStore } from './stores/tenant';

/* add icons to the library */
library.add(
    faUserSecret,
    faUpRightFromSquare,
    faRightToBracket,
    faCheckSquare,
    faSquareXmark,
    faLock,
    faBuilding,
    faGlobe,
    faPenToSquare,
    faHouse,
    faBolt,
    faIdCard,
    faFile,
    faQuestion,
    faCaretDown,
    faPlus,
    faPencil,
    faUsers,
    faEllipsisV,
    faEnvelope,
    faCheck
)

const app = createApp(App)
// pass in vue variable to pinia
const pinia = createPinia();
pinia.use(({ store }) => {
    store.$vueInstance = app
});
app.use(router)
app.use(pinia)
ApiService.init(app, useAuthStore() , useTenantStore());
// app.use(router)
app.use(PrimeVue, {
    unstyled: true,
    pt: Lara,
    ripple: true
});
app.use(ToastService)
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('SpeedDial', SpeedDial)
app
    .directive('debounce', vue3Debounce({ lock: true }))
    .directive('tooltip', Tooltip)
    .directive('ripple', Ripple)
    .mount('#app')
