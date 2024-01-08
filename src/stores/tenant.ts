import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import ApiService from '@/services/ApiService';
import { useAuthStore } from './auth';

export interface Tenant {
  "id": Number;
  "name": String;
  "slug": String;
  "enable": Boolean;
}

const mainTenant = <Tenant>{
  id: 0,
  name: 'MAIN',
  slug: '',
  enable: true
}

export const useTenantStore = defineStore('tenant', () => {
  const authStore = useAuthStore();
  const init = ref(false);
  const tenant = ref<Tenant>(mainTenant);
  const tenantSlug = ref<string | undefined>(undefined)
  async function initTenant() {
    if (init.value) {
      return
    }
    init.value = true
    tenantSlug.value = getTenantSlug()
    if (!tenantSlug.value) {
      tenant.value = mainTenant;
    } else {
      // set tenant slug to api service
      ApiService.setTenant(tenantSlug.value)
      // do api call to tenant
      try {
        const res = await ApiService.get<{ message: string, data: Tenant }>('/v1/api/tenants')
        tenant.value = res.data.data
        // set tenant to vue instance


      } catch (e) {
        console.error(e)
        tenant.value.enable = false
      }

    }
  }

  function getTenantSlug() {
    const host = window.location.host;
    const parts = host.split('.');
    const domainLength = 3;
    if (parts.length === (domainLength - 1) || parts[0] === 'www') {
      return undefined
    } else {
      return parts[0]
    }
  }

  function isMain() {
    // this is main
    return tenant.value.id === 0 && getTenantSlug() === undefined
  }

  function isEnabled() {
    return tenant.value.enable
  }

  function getTenant(): Tenant {
    return tenant.value
  }

  function getBaseDomainFromLocation(): string {
    const hostname = window.location.hostname;

    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }

    return hostname;
  }

  async function checkSlug(slug: string): Promise<boolean> {
    try {
      const res = await ApiService.get<{ available: boolean }>(`/v1/api/tenants/slug-check`, slug, {
        headers: {
          Authorization: authStore.getBearer()
        }
      })
      return res.data.available;
    } catch (e) {
      return false
    }

  }

  async function createTenant(slug: string, name: string): Promise<Tenant | undefined> {
    try {
      const res = await ApiService.post<Tenant>(
        `/v1/api/tenants/create`,
        {
          name,
          slug
        },
        {
          headers: {
            Authorization: authStore.getBearer()
          }
        }
      )
      return res.data
    } catch (e) {
      console.error(e)
      return undefined
    }
  }

  return { initTenant, getTenant, isMain, getTenantSlug, isEnabled, getBaseDomainFromLocation, checkSlug, createTenant }
})
