import { createRouter, createWebHistory, type RouteLocationNormalized, type RouteRecordRaw, } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ResourceView from '@/views/ResourceView.vue'
import ListResourceView from '@/views/resource/ListResourceView.vue'
import ShowResourceView from '@/views/resource/ShowResourceView.vue'
import AboutView from '../views/AboutView.vue'
import RegisterView from '@/views/RegisterView.vue'
import TenantNotAvailableView from '@/views/TenantNotAvailableView.vue'
import { useTenantStore } from '@/stores/tenant'
import { useAuthStore } from '@/stores/auth'
import CreateTenantView from '@/views/CreateTenantView.vue'
import CreateNoteResourceView from '@/views/resource/CreateNoteResourceView.vue'
import TestView from '@/views/TestView.vue'
import AdminView from '@/views/AdminView.vue'
import ListUsersView from '@/views/admin/ListUsersView.vue'
import UpdateNoteResourceView from '@/views/resource/UpdateNoteResourceView.vue'
import VerifyEmailView from '@/views/VerifyEmailView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      logout: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      logout: true
    }
  },
  {
    path: '/create/tenant',
    name: 'create-tenant',
    component: CreateTenantView,
    meta: {
      auth: {
        main: true,
        tenant: true
      },
      isMain: true,
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      auth: {
        main: true,
        tenant: true
      }
    }
  },
  {
    path: '/resources',
    name: 'resources',
    component: ResourceView,
    meta: {
      auth: {
        main: false,
        tenant: true
      }
    },
    children: [
      {
        path: '',
        name: 'list-resource',
        component: ListResourceView,
        meta: {
          auth: {
            main: false,
            tenant: true
          }
        }
      },
      {
        path: 'create/note',
        name: 'create-note-resource',
        component: CreateNoteResourceView,
        meta: {
          auth: {
            main: true,
            tenant: true
          }
        }
      },
      {
        path: 'update/note/:resourceId',
        name: 'update-note-resource',
        component: UpdateNoteResourceView,
        meta: {
          auth: {
            main: true,
            tenant: true
          }
        }
      },
      {
        path: ':id',
        name: 'show-resource',
        component: ShowResourceView,
        meta: {
          auth: {
            main: false,
            tenant: true
          }
        }
      },
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: {
      auth: {
        main: true,
        tenant: true
      }
    },
    children: [
      {
        path: 'users',
        name: 'admin-users',
        component: ListUsersView,
        meta: {
          auth: {
            main: true,
            tenant: true
          }
        }
      },
    ]
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: VerifyEmailView,
  },
  {
    path: '/tenant-not-available',
    name: 'tenant-not-available',
    component: TenantNotAvailableView,
    meta: {
      showNavbar: false
    }
  },
  {
    path: '/test',
    name: 'test',
    component: TestView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})



router.beforeEach(async (to, from, next) => {
  const tenantStore = useTenantStore();
  const authStore = useAuthStore();
  await tenantStore.initTenant()
  await authStore.initAuth()
  if (to.meta?.auth) {
    if (
      (tenantStore.isMain() && (to.meta.auth as any).main && (!authStore.isAuthed)) ||
      (!tenantStore.isMain() && (to.meta.auth as any).tenant && !authStore.isAuthed)
    ) {
      // check if logged in
      next({ name: 'login' });
      return
    }
    // logged in but not verified
    if (authStore.isAuthed && !authStore.user?.isEmailVerified) {
      next({ name: 'verify-email' });
    }
  }

  if (to.meta?.isMain && !tenantStore.isMain()) {
    // check if logged in
    next({ name: 'home' });
    return
  }

  if (!tenantStore.isEnabled() && to.name !== 'tenant-not-available') {
    next({ name: "tenant-not-available" });
    return
  }

  // if (to.meta?.logout ? to.meta.logout : false) {
  if (authStore.isAuthed && to.meta?.logout) {
    next({ name: 'home' })
    return
  }
  // }
  // explicitly return false to cancel the navigation
  // return false
  next();
})
const checkAuthMeta = (route: RouteLocationNormalized) => {
  return route.meta?.auth ? route.meta.auth : false
}


export default router
