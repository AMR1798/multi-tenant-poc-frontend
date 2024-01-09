import type { App } from "vue";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/services/JwtService";
import { useAuthStore } from "@/stores/auth";
import type { useTenantStore } from "@/stores/tenant";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;
  public static tenantSlug: string | undefined;
  private static authStore: ReturnType<typeof useAuthStore>;
  private static tenantStore: ReturnType<typeof useTenantStore>;

  private static applyMiddlewares = <T extends (...args: any[]) => Promise<any>>(
    func: T,
    middlewares: ((func: T) => T)[] = [this.authHandler]
  ): T => {
    return middlewares.reduce((resultFunc, middleware) => middleware(resultFunc), func);
  };

  private static authHandler = <T extends (...args: any[]) => Promise<any>>(func: T): T =>
    <T>(async (...args: any[]) => {
      try {
        const res = await func(...args);
        return res;
      } catch (e: any) {
        if (ApiService.isAxiosError(e) && e.response) {
          if (e.response.data.errorCode && e.response.data.errorCode === 'UNAUTHED') {
            const res = await this.authStore.initToken();
            if (res) {
              return await func(...args);
            }
          }
        }
        throw e;
      }
    }) as T;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>, authStore: ReturnType<typeof useAuthStore>, tenantStore: ReturnType<typeof useTenantStore>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    // @ts-ignore
    ApiService.vueInstance.axios.defaults.baseURL = import.meta.env.VITE_APP_API_DOMAIN;
    ApiService.authStore = authStore;
    ApiService.tenantStore = tenantStore
  }

  public static setTenant(tenantSlug: string) {
    this.tenantSlug = tenantSlug
  }

  public static getUrl() {
    if (this.tenantSlug) {
      return `//${this.tenantSlug}.${ApiService.vueInstance.axios.defaults.baseURL}`
    }
    return `//${ApiService.vueInstance.axios.defaults.baseURL}`
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Token ${JwtService.getToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  // public static query<T>(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<T>> {
  //   return ApiService.vueInstance.axios(
  //     {
  //       method: 'get',
  //       url,
  //       baseURL: this.getUrl(),
  //       ...config
  //     }
  //   );
  // }

  public static query = ApiService.applyMiddlewares(
    async <T>(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<T>> => {
      return ApiService.vueInstance.axios(
        {
          method: 'get',
          url,
          baseURL: this.getUrl(),
          ...config
        }
      );
    },
  );


  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get<T>(
    resource: string,
    slug = "" as string,
    config?: AxiosRequestConfig<any> | undefined
  ): Promise<AxiosResponse<T>> {
    let url = `${resource}`;
    if (slug !== "") {
      url = url + `/${slug}`
    }
    return ApiService.vueInstance.axios(
      {
        method: 'get',
        url,
        baseURL: this.getUrl(),
        ...config
      }
    );
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post<T>(url: string, data?: any | undefined, config?: AxiosRequestConfig<any> | undefined): Promise<AxiosResponse<T>> {
    // return ApiService.vueInstance.axios.post(`${url}`, data, config);
    return ApiService.vueInstance.axios(
      {
        method: 'post',
        url,
        baseURL: this.getUrl(),
        data,
        ...config
      }
    );
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static update<T>(resource: string, slug: string, data?: any | undefined, config?: AxiosRequestConfig<any> | undefined): Promise<AxiosResponse<T>> {
    // return ApiService.vueInstance.axios.post(`${url}`, data, config);
    let url = `${resource}`;
    if (slug !== "") {
      url = url + `/${slug}`
    }
    return ApiService.vueInstance.axios(
      {
        method: 'patch',
        url,
        baseURL: this.getUrl(),
        data,
        ...config
      }
    );
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}`, params);
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource);
  }

  public static isAxiosError(error: unknown): boolean {
    return ApiService.vueInstance.axios.isAxiosError(error);
  }

}

export default ApiService;
